'use strict';
import Singular from "./singular/singular";
import Config from "./singular/singularConfig";

// This workaround is used to prevent from the SDK to be loaded twice
let SingularObject = Singular;
let ConfigObject = Config;

if (!window.singularSdk) {
    window.singularSdk = SingularObject;
    window.SingularConfig = ConfigObject;
} else {
    SingularObject = window.singularSdk;
    ConfigObject = window.SingularConfig;
}

export const singularSdk = SingularObject;
export const SingularConfig = ConfigObject;
