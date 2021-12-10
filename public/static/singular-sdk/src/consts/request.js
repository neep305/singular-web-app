import * as Params from "./params"

export const BaseUrl = SDK_ENDPOINT;
export const ContentType = 'Content-Type';
export const ContentTypeValue = 'application/json';
export const Endpoints = {
    Session: 'start',
    Event: 'event',
    DeviceCustomUserId: 'set_device_for_custom_id'
};
export const Method = 'POST';
export const PostParams = [Params.Extra, Params.WebUrl, Params.UserAgent, Params.EventProductName, Params.DocumentReferrer, Params.ClientHints];
export const Status = 'status';
export const RequestTimeoutMs = 30000;
export const ValidResponse = 'ok';
export const ValidResponseCode = 200;
