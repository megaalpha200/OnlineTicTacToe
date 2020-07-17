//import psl from 'psl';

export const parseError = err => {
    if (err.isJoi) return err.details[0];
    return { message: JSON.stringify(err, Object.getOwnPropertyNames(err)) };
};

export const currentLocation = `${window.location.origin}`;
export const backendEndpoint = `${window.location.protocol}//${window.location.hostname}:8524`;
//export const backendEndpoint = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? `${window.location.protocol}//${window.location.hostname}:8524` : `${window.location.protocol}//api.${psl.parse(window.location.hostname).domain}`;