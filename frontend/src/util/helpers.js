import psl from 'psl';

const BACKEND_DEPLOY_CONFIG_MODE = parseInt(process.env.REACT_APP_BACKEND_DEPLOY_CONFIG_MODE) ?? 1;

export const parseError = err => {
    if (err.isJoi) return err.details[0];
    return JSON.stringify(err, Object.getOwnPropertyNames(err));
};

export const currentLocation = `${window.location.origin}`;

export const backendEndpoint = (BACKEND_DEPLOY_CONFIG_MODE === 2 && (process.env.NODE_ENV && process.env.NODE_ENV === 'production'))
                                ? `${window.location.protocol}//api.${psl.parse(window.location.hostname).domain}`
                                : `${window.location.protocol}//${window.location.hostname}:8524`;