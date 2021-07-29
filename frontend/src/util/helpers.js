import psl from 'psl';
import SHA256 from 'crypto-js/sha256';
import bcrypt from 'bcryptjs';

const BACKEND_DEPLOY_CONFIG_MODE = parseInt(process.env.REACT_APP_BACKEND_DEPLOY_CONFIG_MODE) ?? 1;

export const parseError = err => {
    if (err.isJoi) return err.details[0];
    return JSON.stringify(err, Object.getOwnPropertyNames(err));
};

export const currentLocation = `${window.location.origin}`;

export const backendEndpoint = (BACKEND_DEPLOY_CONFIG_MODE === 2 && (process.env.NODE_ENV && process.env.NODE_ENV === 'production'))
                                ? `${window.location.protocol}//api.${psl.parse(window.location.hostname).domain}`
                                : `${window.location.protocol}//${window.location.hostname}:8525`;

//TODO: Use these functions to call API functions
export const callAPI = async (responsePromise, errMsg, successCallback = (response = null) => {}, errCallback = () => {}, hasCatchMsg = true) => {
    let response = null;

    try {
        response = await responsePromise;

        if (response.ok) {
            try {
                const responseJSON = await response.json();
                successCallback(responseJSON);
            }
            catch(e) {
                successCallback(response);
            }
        }
        else {
            throw Error(errMsg);
        }   
    }
    catch(e) {
        if (hasCatchMsg && response && Number(response.status) === 403) {
            alert(`${e.message} Access Forbidden!`);
        }
        else if (hasCatchMsg && response && Number(response.status) === 404) {
            alert(`${e.message} Not Found!`);
        }
        else if (hasCatchMsg) {
            alert(`${e.message} Please try again later.`);
        }

        errCallback((response !== null) ? response : { status: 500 });
    }
}

export const callAPIAsync = async (responsePromise, errMsg, hasCatchMsg = true) => {
    let response = null;

    try {
        response = await responsePromise;

        if (response.ok) {
            try {
                const responseJSON = {};
                responseJSON.result = await response.json();
                responseJSON.status = 200;
                return responseJSON;
            }
            catch(e) {
                return response;
            }
        }
        else {
            throw Error(errMsg);
        }   
    }
    catch(e) {
        if (hasCatchMsg && response && Number(response.status) === 403) {
            alert(`${e.message} Access Forbidden!`);
        }
        else if (hasCatchMsg && response && Number(response.status) === 404) {
            alert(`${e.message} Not Found!`);
        }
        else if (hasCatchMsg) {
            alert(`${e.message} Please try again later.`);
        }

        return (response !== null) ? response : { status: 500 };
    }
}

export const combinedQueryURL = () => {
    const currentPageUrl = window.location.pathname;
    const querySearch = window.location.search;
    const combinedUrl = currentPageUrl + querySearch;

    return combinedUrl;
}

export const hashEmail = email => bcrypt.hashSync(email, `$2b$10$${SHA256(email).toString().slice(-22)}`).slice(-40);
export const hashPassword = (email, password) => bcrypt.hashSync(password, `$2b$10$${SHA256(email + password).toString().slice(-22)}`).slice(-40);