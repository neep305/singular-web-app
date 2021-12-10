import ApiManager from "../api/apiManager";
import Utils from "../utils/utils";
import SingularState from "./singularState";
import SingularLog from "./singularLog";
import PageVisitApi from "../api/pageVisitApi";
import { Params } from '../consts/constants';

export default class SingularInstance {

    constructor(config) {
        this._singularState = SingularState.getInstance().init(config);

        if (!Utils.isNullOrEmpty(config.customUserId)) {
            this._singularState.setCustomUserId(config.customUserId);
        }

        SingularLog.info(`SDK is initialized Apikey:${config.apikey}, Product Id:${config.productId}`);

        this._apiManager = new ApiManager();
        this.sendApi(new PageVisitApi());
    }

    sendApi(api) {
        this._apiManager.sendApi(api);
    }

    setCustomUserId(customUserId) {
        this._singularState.setCustomUserId(customUserId);
    }

    unsetCustomUserId() {
        this._singularState.unsetCustomUserId();
    }

    openApp(baseLink, deeplink, passthrough, deferredDeeplink) {
        const webToAppLink = this.buildWebToAppLink(baseLink, deeplink, passthrough, deferredDeeplink);

        if (!webToAppLink) {
            return;
        }

        window.open(webToAppLink);
    }

    buildWebToAppLink(baseLink, deeplink, passthrough, deferredDeeplink) {
        const webToAppLink = Utils.buildWebToAppLink(baseLink, this._singularState.getWebUrl(), deeplink, passthrough, deferredDeeplink);

        if (!webToAppLink) {
            SingularLog.warn("Invalid base link when generating web to app link");
        }

        return webToAppLink;
    }

    getSingularDeviceId() {
        return this._singularState.getSingularDeviceId();
    }

    isSameApp(config) {
        return this._singularState.getSingularConfig().isSameApp(config);
    }

    updateSingularConfig(config) {
        this._singularState.updateSingularConfig(config);
    }

    enrichUrlWithMarketingData(url) {
        if (!this._singularState._isWebUrlContainingMarketingData(window.location.href)) {
            return url;
        }

        let locationQueryObject = Utils.parseQueryFromUrl(window.location.href);
        let urlQueryObject = Utils.parseQueryFromUrl(url);

        let locationQueryKeys = Object.keys(locationQueryObject);
        let urlQueryKeys = Object.keys(urlQueryObject);

        // Filter the keys to check if keys available to be added in url
        let keysToAdd = locationQueryKeys.filter(function(v) {
            return urlQueryKeys.indexOf(v)==-1;
        })

        // Filter the keys to check if keys to be added are marketing params or not
        let marketingParams = Utils.extractMarketingData(keysToAdd);

        /* if url has other parameters added , append utm parameters to url
           if url has '#', then append params before '#' in url
           if url has no parameters added , add utm parameters to url */

        for (const [i, key] of marketingParams.entries()) {
            let queryParam = `${encodeURIComponent(key)}=${encodeURIComponent(locationQueryObject[key])}`;

            url = (url.indexOf("?") != -1 ? Utils.appendQueryParamsToUrl('?',queryParam,url)
              : (url.indexOf("#") != -1 ? Utils.appendQueryParamsToUrl('#',queryParam,url)
                : (`${url}${"?"}${queryParam}`)));
        }
        return url;
    }
}
