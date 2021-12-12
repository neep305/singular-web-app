'use strict';

const initSingularSdk = () => {
    const apiKey="jaredinternaltestaccount_5c7f106a";
    const secretKey="65c36d10fff97b67e34b6c36714c4f52";
    const productId="com.herokuapp.singular-web-app";
    const config = new SingularConfig(apiKey, secretKey, productId);
    singularSdk.init(config);
}

const openApp = () => {
    console.log('executed openApp()');
    // https://jared.sng.link/Asyhj/eh31?_ios_dl=jasonapp%3A%2F%2F&_android_dl=jasonapp
    singularSdk.openApp("https://jared.sng.link/Asyhj/eh31?_ios_dl=jasonapp%3A%2F%2F&_android_dl=jasonapp", "jasonapp://", "passthrough_test", "jasonapp://");
}