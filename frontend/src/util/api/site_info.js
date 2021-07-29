import { backendEndpoint } from 'util/helpers';

const endpoint = `${backendEndpoint}/api/site-info`

export const getInfo = () => (
    fetch(`${endpoint}/retrieve`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    })
);

export const updateSiteUpdateDate = () => (
    fetch(`${endpoint}/set-update-date`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include'
    })
);

export const updateMarqueeText = marqueeText => (
    fetch(`${endpoint}/set-marquee-text`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
            marqueeText
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
);