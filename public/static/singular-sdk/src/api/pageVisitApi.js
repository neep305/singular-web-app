import ConversionEventApi from "./conversionEventApi";
import {EventTypes, Params} from '../consts/constants';
import Utils from "../utils/utils";
import SingularState from "../singular/singularState";

export default class PageVisitApi extends ConversionEventApi {
    constructor() {
        // We get the session id before the super constructor because baseApi updates the last event
        // Timestamp and that will prevent from generating a new session id if needed
        const sessionId = SingularState.getInstance().getSessionIdForPageVisit();

        super(EventTypes.PageVisitEventName);

        this._apiType = EventTypes.PageVisitApi;
        this._params[Params.SessionId] = sessionId;
        this._params[Params.WebUrl] = window.location.href;
        this._params[Params.DocumentReferrer] = document.referrer;
        this._params[Params.IsFirstVisit] = SingularState.getInstance().isFirstVisit();
        this._params[Params.IsPageRefreshed] = Utils.isPageRefreshed();
        this._params[Params.SdidPersistMode] = SingularState.getInstance().getSdidPersistMode();

        const failReason = SingularState.getInstance().getSdidPersistFailReason();

        if (!Utils.isNullOrEmpty(failReason)) {
            this._params[Params.SdidPersistFailedReason] = failReason;
        }

        const prevSdid = SingularState.getInstance().getPreviousSdid();

        if (!Utils.isNullOrEmpty(prevSdid)) {
            this._params[Params.PreviousSdid] = prevSdid;
        }
    }

    handleResponse(request) {
        const isSuccess = super.handleResponse(request);

        if (isSuccess) {
            SingularState.getInstance().saveSessionId(this._params[Params.SessionId]);
        }

        return isSuccess;
    }
}
