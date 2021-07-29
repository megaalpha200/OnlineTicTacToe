import SocketIOClient from 'socket.io-client';
import { backendEndpoint } from 'util/helpers';

const socketEndpoint = `${backendEndpoint}/gameSession`;
const APIEndpoint = `${backendEndpoint}/api/game`;

export const initialize = (data, callback) => {
    const socket = SocketIOClient(socketEndpoint);

    socket.on('gameDataInitRes', callback);
    socket.emit('gameDataInitReq', data.session_id, data);
}

export const update = (data) => {
    const socket = SocketIOClient(socketEndpoint);
    socket.emit('gameDataUpdateReq', data.session_id, data);
}

export const initializeUpdateSocket = (session_id, callback) => {
    const socket = SocketIOClient(socketEndpoint);
    socket.on('gameDataUpdateRes', callback);
    socket.emit('room', session_id);
}

export const persistGameSession = data => (
    fetch(`${APIEndpoint}`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
);

export const cleanUpGameData = () => (
    fetch(`${APIEndpoint}`, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include'
    })
);

export const checkGameData = async () => {
    let preloadedState = {};

    const response = await fetch(`${APIEndpoint}`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    });
    const { gameData } = await response.json();

    try {
        if (gameData) {
            delete gameData._id;
            preloadedState = {
                game: gameData
            };
        }
    }
    catch(err) {

    }

    return preloadedState;
};