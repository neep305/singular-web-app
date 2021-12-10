import EventApi from "../api/eventApi";
import ConversionEventApi from "../api/conversionEventApi";
import Utils from "../utils/utils";
import SingularInstance from "./singularInstance";
import PageVisitApi from "../api/pageVisitApi";
import CustomUserIdApi from "../api/customUserIdApi";
import SingularInitParams from "./singularInitParams";

export default class Singular {

    static _isInitialized = false;
    static _singularInstance;

    static init(config) {
        if (config === null) {
            throw new Error("Singular config can't be null");
        }

        if (this._isInitialized &&
            this._singularInstance && this._singularInstance.isSameApp(config)) {
            this._singularInstance.updateSingularConfig(config);
            return;
        }

        this._singularInstance = new SingularInstance(config);
        this._isInitialized = true;

        config._initFinished(new SingularInitParams(this.getSingularDeviceId()));
    }

    static pageVisit() {
        const pageVisit = new PageVisitApi();
        this._singularInstance.sendApi(pageVisit);
    }

    static event(eventName, args) {
        if (!this._isInitialized) {
            return;
        }

        const event = new EventApi(eventName).withArgs(args);
        this._singularInstance.sendApi(event);
    }

    static conversionEvent(eventName, args) {
        if (!this._isInitialized) {
            return;
        }

        const event = new ConversionEventApi(eventName).withArgs(args);
        this._singularInstance.sendApi(event);
    }

    static revenue(eventName, currency, amount, args) {
        if (!this._isInitialized) {
            return;
        }

        const event = new EventApi(eventName).withRevenue(currency, amount).withArgs(args);
        this._singularInstance.sendApi(event);
    }

    static login(customUserId) {
        if (!this._isInitialized || Utils.isNullOrEmpty(customUserId)) {
            return;
        }

        this._singularInstance.setCustomUserId(customUserId);
    }

    static logout() {
        if (!this._isInitialized) {
            return;
        }

        this._singularInstance.unsetCustomUserId();
    }

    static setDeviceCustomUserId(customUserId) {
        if (!this._isInitialized || Utils.isNullOrEmpty(customUserId)) {
            return;
        }

        this.login(customUserId);

        const event = new CustomUserIdApi();
        this._singularInstance.sendApi(event);
    }

    static openApp(baseLink, deeplink = null, passthrough = null, deferredDeeplink = null) {
        if (!this._isInitialized) {
            return;
        }

        this._singularInstance.openApp(baseLink, deeplink, passthrough, deferredDeeplink);
    }

    static buildWebToAppLink(baseLink, deeplink = null, passthrough = null, deferredDeeplink = null) {
        if (!this._isInitialized) {
            return null;
        }

        return this._singularInstance.buildWebToAppLink(baseLink, deeplink, passthrough, deferredDeeplink);
    }

    static getSingularDeviceId() {
        if (!this._isInitialized) {
            return null;
        }

        return this._singularInstance.getSingularDeviceId();
    }

    static enrichUrlWithMarketingData(url) {
        if (!this._isInitialized || !Utils.isValidUrl(url)) {
            return url;
        }

        return this._singularInstance.enrichUrlWithMarketingData(url);
    }
}
