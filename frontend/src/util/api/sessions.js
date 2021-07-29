import { backendEndpoint } from 'util/helpers';
import SocketIOClient from 'socket.io-client';

const apiEndpoint = `${backendEndpoint}/api`;
const socketEndpoint = `${backendEndpoint}/sessionsdb`;

export const signup = user => (
    fetch(`${apiEndpoint}/users`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
            user: {
                ...user
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
);

export const login = user => (
    fetch(`${apiEndpoint}/session`, {
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
    fetch(`${apiEndpoint}/session`, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include'
    })
);

export const changeUsername = user => (
    fetch(`${apiEndpoint}/users/change-user-username`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
            user: {
                ...user
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
);

export const changeUserEmail = user => (
    fetch(`${apiEndpoint}/users/change-user-email`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
            user: {
                ...user
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
);

export const changeUserPassword = user => (
    fetch(`${apiEndpoint}/users/change-user-password`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
            user: {
                ...user
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
);

export const getUsersList = () => (
    fetch(`${apiEndpoint}/users/get-usernames`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    })
);

export const getUserData = userId => (
    fetch(`${apiEndpoint}/users/get-user-data`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
            user: {
                _id: userId
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
);

export const modifyUserData = (userId, userData) => (
    fetch(`${apiEndpoint}/users/modify-user-data`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
            user: {
                _id: userId,
                userData
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
);

export const deleteUserData = userId => (
    fetch(`${apiEndpoint}/users/delete-user-data`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
            user: {
                _id: userId
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
);

export const getNumberOfActiveSessions = () => (
    fetch(`${apiEndpoint}/session/get-user-sessions`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    })
)

export const clearUserSessions = (userId, callback) => {
    const socket = SocketIOClient(socketEndpoint);
    socket.on(`sessionsClearUserIndvRes${userId}`, callback);
    socket.emit('sessionsClearUserReq');
}

export const clearSessions = callback => {
    const socket = SocketIOClient(socketEndpoint);
    socket.on('sessionsClearAllIndvRes', callback);
    socket.emit('sessionsClearAllReq');
}

export const initializeClearSessionsSocket = (userId, callback) => {
    const socket = SocketIOClient(socketEndpoint);
    socket.on('sessionsClearAllRes', callback);
    socket.on(`sessionsClearUserRes${userId}`, callback);
}

export const checkLoggedIn = async () => {
    let preloadedState = {};

    const response = await fetch(`${apiEndpoint}/session`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    });
    const { user } = await response.json();

    try {
        if (user) {
            preloadedState = {
                session: {
                    ...user,
                    email: Buffer.from(window.localStorage.getItem('em'), 'base64').toString('ascii'),
                    isAdmin: (user.user_type === 'true_admin') ? true : undefined,
                    isPseudoAdmin: (user.user_type === 'pseudo_admin') ? true : undefined
                }
            };
        }
    }
    catch(err) {

    }

    return preloadedState;
};