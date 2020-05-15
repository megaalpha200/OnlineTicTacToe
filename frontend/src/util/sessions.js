import { backendEndpoint } from 'util/helpers';

const endpoint = `${backendEndpoint}/api`

export const signup = user => (
    fetch(`${endpoint}/users`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    })
);

export const login = user => (
    fetch(`${endpoint}/session`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    })
);

export const logout = () => (
    fetch(`${endpoint}/session`, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include'
    })
)

export const checkLoggedIn = async () => {
    let preloadedState = {};

    const response = await fetch(`${endpoint}/session`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    });
    const { user } = await response.json();

    try {
        if (user) {
            preloadedState = {
                session: user
            };
        }
    }
    catch(err) {

    }

    return preloadedState;
};