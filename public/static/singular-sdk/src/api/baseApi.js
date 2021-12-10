import Utils from "../utils/utils";
import {Params, Request} from "../consts/constants";
import SingularState from "../singular/singularState";
import SingularLog from "../singular/singularLog";
import DynamicStorage from "../storage/dynamicStorage";

export default class BaseApi {

    _endpoint;
    static apiClasses = {};

    constructor() {
        this._extra = {};
        this.initApiParams();
        SingularState.getInstance().updateLastEventTimestamp();
    };

    initApiParams() {
        this._params = {
            [Params.BrowserAvailableMemory]: Utils.getBrowserAvailableMemory(),
            [Params.BrowserUsedMemory]: Utils.getBrowserUsedMemory(),
            [Params.CustomUserId]: SingularState.getInstance().getCustomUserId(),
            [Params.CurrentDeviceTime]: Utils.getCurrentTimestamp(),
            [Params.EventId]: Utils.generateUUID(),
            [Params.IsConversion]: false,
            [Params.Keyspace]: Params.SingularDeviceId,
            [Params.Owner]: SingularState.getInstance().getSingularConfig().apikey,
            [Params.Platform]: Params.PlatformWeb,
            [Params.ProductId]: SingularState.getInstance().getSingularConfig().productId,
            [Params.ScreenHeight]: window.screen.height,
            [Params.ScreenWidth]: window.screen.width,
            [Params.SdkVersion]: Utils.getSdkVersion(),
            [Params.SingularInstanceId]: SingularState.getInstance().getSingularInstanceId(),
            [Params.SingularDeviceId.toLowerCase()]: SingularState.getInstance().getSingularDeviceId(),
            [Params.StorageType]: DynamicStorage.getAvailableStorageType(),
            [Params.Timezone]: Utils.getTimeZone(),
            [Params.TouchpointTimestamp]: SingularState.getInstance().getTouchpointTimestamp(),
            [Params.UserAgent]: navigator.userAgent,
            [Params.UUID]: SingularState.getInstance().getSingularDeviceId(),
        }
    }

    async sendRequest() {
        // We add these here instead of init because they are async operations
        this._params[Params.OS] = await Utils.getOS();
        const clientHints = await Utils.getClientHints();

        if (clientHints) {
            this._params[Params.ClientHints] = JSON.stringify(clientHints);
        }

        return new Promise(resolve => {
            if (Object.keys(this._extra).length > 0) {
                this._params[Params.Extra] = JSON.stringify(this._extra);
            }

            // All events should get their session id here except for page visit that get it on init
            if (!this._params[Params.SessionId]) {
                this._params[Params.SessionId] = SingularState.getInstance().getSessionId();
            }

            const params = {
                ...this._params,
                [Params.Lag]: (Utils.getCurrentTimestamp() - parseInt(this._params[Params.CurrentDeviceTime])),
            };

            const body = this._buildRequestBody(params);
            const url = this._buildRequestUrl(params);

            SingularLog.debug(`Sending api request\nUrl:${url}\nBody:${JSON.stringify(body)}`);

            const request = new XMLHttpRequest();
            request.open(Request.Method, url, true);
            request.setRequestHeader(Request.ContentType, Request.ContentTypeValue);
            request.timeout = Request.RequestTimeoutMs;

            request.ontimeout = () => {
                resolve(false);
            };

            request.onreadystatechange = () => {
                // The ready state of the request is still XMLHttpRequest.DONE even if the request failed
                if (request.readyState === XMLHttpRequest.DONE) {
                    resolve(this.handleResponse(request));
                }
            };

            request.send(JSON.stringify(body));
        });
    }

    handleResponse(request) {
        try {
            const response = JSON.parse(request.responseText);

            return request.status === Request.ValidResponseCode &&
                response[Request.Status] === Request.ValidResponse;
        } catch (e) {
            return false;
        }
    }

    get eventId() {
        return this._params[Params.EventId];
    }

    _buildRequestBody(params) {
        let payload = {};
        Object.entries(params).filter(([key, value]) => {
            return Request.PostParams.includes(key) && !Utils.isNullOrEmpty(value);
        }).forEach(([key, value]) => {
            payload[key] = value;
        });

        if (Object.keys(payload).length === 0) {
            return {};
        }

        const payloadString = JSON.stringify(payload);

        return {
            payload: payloadString,
            signature: Utils.calculateHash(payloadString, SingularState.getInstance().getSingularConfig().secret)
        };
    }

    _buildRequestUrl(params) {
        // Build the request url with all the query params that are not in the POST body
        const queryParams = Object.keys(params)
            .filter((key) => !Utils.isNullOrEmpty(params[key]) && !Request.PostParams.includes(key))
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);

        const queryString = `?${queryParams.join('&')}`;
        const hash = Utils.calculateHash(queryString, SingularState.getInstance().getSingularConfig().secret);

        return `${Request.BaseUrl}${this._endpoint}${queryString}&h=${hash}`;
    }

    static toJsonString(api) {
        if (Utils.isNullOrEmpty(api)) {
            return null;
        }

        return JSON.stringify(api);
    }

    static fromJsonString(json) {
        if (Utils.isNullOrEmpty(json)) {
            return null;
        }

        const apiData = JSON.parse(json);

        // The parsed object is BaseApi by default. I need to cast it to it's original type when parsing from json
        // We use Object.create in order to support IE10
        const api = Object.create(this.apiClasses[apiData._apiType].prototype);
        Object.assign(api, apiData);
        return api
    }
}
