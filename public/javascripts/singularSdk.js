'use strict';
//const {  } = require('../../node_modules/singular-sdk/dist/singular-sdk');

const initSingularSdk = () => {
    const apiKey="jaredinternaltestaccount_5c7f106a";
    const secretKey="65c36d10fff97b67e34b6c36714c4f52";
    const productId="com.herokuapp.singular-web-app";
    const config = new SingularConfig(apiKey, secretKey, productId);
    singularSdk.init(config);
}

const sendEvent = (eventName, args) => {
    singularSdk.event(eventName, args);
}

const sendRevenue = (eventName, currency, amount, args) => {
    singularSdk.revenue(eventName, currency, amount, args);
}

const openApp = () => {
    // https://jared.sng.link/Asyhj/eh31?_ios_dl=jasonapp%3A%2F%2F&_android_dl=jasonapp
    singularSdk.openApp("https://jared.sng.link/Asyhj/eh31?_dl=jasonapp%3A%2F%2Fdeeplinking");
}

const openAppWithParams = (params) => {
    let baselink = "https://jared.sng.link/Asyhj/eh31?_dl=jasonapp%3A%2F%2Fdeeplinking&_forward_params=true";
    if (params != undefined || params != '') {
        if (params.startsWith('?')) {
            baselink = baselink.concat('&').concat(params.substring(1));
            console.log('baselink: ' + baselink);
            singularSdk.openApp(baselink, null, params.substring(1), null);
        }        
        
        return;
    }
    singularSdk.openApp(baselink);
}

const buildWebToAppLink = () => {
    console.log("buildWebToAppLink");
    const link = singularSdk.buildWebToAppLink("https://jared.sng.link/Asyhj/eh31", "jasonapp://dl", "passthrough_value", "jasonapp://ddl");
    console.log(link);
    return link;
}

const buildWebToAppLinkWithParams = (params) => {
    console.log("buildWebToAppLinkWithParams params: " + params);
    let baselink = "https://jared.sng.link/Asyhj/eh31?_ios_dl=jasonapp%3A%2F%2F&_android_dl=jasonapp&_forward_params=true";
    if (params != undefined || params != '') {
        if (params.startsWith('?')) {
            baselink = baselink.concat('&').concat(params);
        }
    }
    const link = singularSdk.buildWebToAppLink(baselink, null, params.substring(1), null);
    console.log(link);
    return link;
}