import { backendEndpoint } from 'util/helpers';

const endpoint = `${backendEndpoint}/api/contact-form`

export const submitForm = formData => (
    fetch(`${endpoint}/send-form`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
            formData
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
);

export const retrieveFormTimestamps = (skipCursor, formLimit = -1) => (
    fetch(`${endpoint}/retrieve-timestamps`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
            skipCursor,
            formLimit
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
);

export const retrieveFormData = formID => (
    fetch(`${endpoint}/retrieve-form-data`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
            formID
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
);

export const deleteFormData = formID => (
    fetch(`${endpoint}/delete-form-data`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
            formID
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
);