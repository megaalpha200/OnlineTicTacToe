import SocketIOClient from 'socket.io-client';
import { backendEndpoint } from 'util/helpers';

const socketEndpoint = `${backendEndpoint}/gameSession`;
const APIEndpoint = `${backendEndpoint}/api/game`;

export const initialize = (data, callback) => {
    const socket = SocketIOClient(socketEndpoint);

    socket.on('gameDataInitRes', callback);
    socket.emit('gameDataInitReq', data._id, data);
}

export const update = (data) => {
    const socket = SocketIOClient(socketEndpoint);
    socket.emit('gameDataUpdateReq', data._id, data);
}

export const signalPlayerTyping = (session_id, assignedPlayer, isTyping) => {
    const socket = SocketIOClient(socketEndpoint);
    socket.emit('gameDataChatIsTypingReq', session_id, assignedPlayer, isTyping);
}

export const sendChatMessage = (session_id, assignedPlayer, message) => {
    const socket = SocketIOClient(socketEndpoint);
    socket.emit('gameDataChatMsgSentReq', session_id, assignedPlayer, message);
}

export const initializeUpdateSocket = (session_id, assignedPlayer, gameDataCallback, chatDataCallback) => {
    const socket = SocketIOClient(socketEndpoint);
    socket.on('gameDataUpdateRes', gameDataCallback);
    socket.on('gameDataChatIsTypingRes', chatDataCallback);
    socket.on('gameDataChatMsgSentRes', chatDataCallback);
    socket.emit('room', session_id);
    
    if (session_id && assignedPlayer) socket.emit('gameDataRejoinReq', session_id, assignedPlayer);
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

export const clearAllGameSessions = () => (
    fetch(`${APIEndpoint}/clear-game-sessions`, {
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
            preloadedState = {
                game: gameData
            };
        }
    }
    catch(err) {

    }

    return preloadedState;
};