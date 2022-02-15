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
    singularSdk.openApp("https://jared.sng.link/Asyhj/eh31?_ios_dl=jasonapp%3A%2F%2F&_android_dl=jasonapp&utm_source=slack&utm_medium=email&utm_campaign=slacktest", "jasonapp://", "passthrough_test", "jasonapp://");
}

const buildWebToAppLink = () => {
    console.log("buildWebToAppLink");
    const link = singularSdk.buildWebToAppLink("https://jared.sng.link/Asyhj/eh31?_ios_dl=jasonapp%3A%2F%2F&_android_dl=jasonapp", "jasonapp://", "passthrough_test", "jasonapp://");
    console.log(link);
}