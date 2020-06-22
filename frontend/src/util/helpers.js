export const parseError = err => {
    if (err.isJoi) return err.details[0];
    return JSON.stringify(err, Object.getOwnPropertyNames(err));
};

export const currentLocation = `${window.location.protocol}//${window.location.hostname}${(window.location.port !== 80) ? `:${window.location.port}` : ''}`;
export const backendEndpoint = `${window.location.protocol}//${window.location.hostname}:8524`;