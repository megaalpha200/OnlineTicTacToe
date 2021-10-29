import * as apiUtil from 'util/api/game';
import { callAPI } from 'util/helpers';
import { receiveErrors } from 'actions/error';
import { parseError } from 'util/helpers';
import { _nullSession } from 'reducers/game/game';

export const INITIALIZE_GAME_DATA = 'INITIALIZE_GAME_DATA';
export const UPDATE_GAME_DATA = 'UPDATE_GAME_DATA';
export const UPDATE_CHAT_DATA = 'UPDATE_CHAT_DATA';
export const CLEAR_RECEIVED_MESSAGE_FLAG = 'CLEAR_RECEIVED_MESSAGE_FLAG';
export const SET_IS_TYPING_FLAG = 'SET_IS_TYPING_FLAG';
export const CLEAR_IS_TYPING_FLAG = 'CLEAR_IS_TYPING_FLAG';
export const CLEAR_GAME_DATA = 'CLEAR_GAME_DATA';
export const CLEAR_GAME_SESSIONS = 'CLEAR_GAME_SESSIONS';

const initializeGameData = gameData => ({
    type: INITIALIZE_GAME_DATA,
    gameData
});

const updateGameData = gameData => ({
    type: UPDATE_GAME_DATA,
    gameData
});

const updateChatData = chatData => ({
   type: UPDATE_CHAT_DATA,
   chatData
});

export const clearMessageReceivedFlag = () => ({
   type: CLEAR_RECEIVED_MESSAGE_FLAG
});

export const setIsTypingFlag = assignedPlayerTyping => ({
   type: SET_IS_TYPING_FLAG,
    assignedPlayerTyping
});

export const clearIsTypingFlag = assignedPlayerTyping => ({
    type: CLEAR_IS_TYPING_FLAG,
    assignedPlayerTyping
});

const clearGameData = () => ({
    type: CLEAR_GAME_DATA
});

const clearGameSessions = () => ({
    type: CLEAR_GAME_SESSIONS,
});

const handleReceivedGameData = async (receivedGameData, dispatch, action, shouldAssignPlayer) => {
    if (receivedGameData && receivedGameData.game && !receivedGameData.message) {
        const gameData = receivedGameData.game;
        const sessionData = {
            session_id: gameData._id
        };

        if (shouldAssignPlayer) {
            sessionData.assignedPlayer = gameData.assignedPlayer;
            sessionData.playerName = (gameData.assignedPlayer === 1) ? gameData.p1Name : gameData.p2Name;
        }

        await apiUtil.persistGameSession(sessionData);

        return dispatch(action(gameData));
    }

    if (receivedGameData.game == null) receivedGameData.game = _nullSession;

    return dispatch(receiveErrors(parseError(receivedGameData)));
}

const handleReceivedChatData = async (receivedChatData, dispatch) => {
    if (receivedChatData) {
        if (receivedChatData.isTyping === undefined) {
            const sessionData = {
                session_id: receivedChatData.game_session_id
            };

            await apiUtil.persistGameSession(sessionData);

            return dispatch(updateChatData(receivedChatData));
        }
        else {
            if (receivedChatData.isTyping) {
                return dispatch(setIsTypingFlag(receivedChatData.assignedPlayer));
            }
            else {
                return dispatch(clearIsTypingFlag(receivedChatData.assignedPlayer));
            }
        }
    }

    return dispatch(receiveErrors(parseError(receivedChatData)));
}

const initUpdateSocket = (session_id, assignedPlayer, dispatch) => apiUtil.initializeUpdateSocket(session_id,
    assignedPlayer,
    updateData => handleReceivedGameData(updateData, dispatch, updateGameData),
    chatData => handleReceivedChatData(chatData, dispatch)
);

export const initializeData = (session_id, assignedPlayer, playerName = "Player") => async dispatch => {
    try {
        if (assignedPlayer && session_id) {
            initUpdateSocket(session_id, assignedPlayer, dispatch);
            return;
        }

        let initData = prepareGameDataForSending({ ..._nullSession });

        if (session_id) { // Only if a second player is joining
            initData._id = session_id;
            initData.p2Name = playerName + ' (O)';
        }
        else {
            initData.p1Name = playerName + ' (X)';
            initData.p2Name = 'Player (O)';
        }

        apiUtil.initialize(initData, async data => {
            await handleReceivedGameData(data, dispatch, initializeGameData, true);
            initUpdateSocket(data.game._id, false, dispatch);
        });
    }
    catch(err) {
        return dispatch(receiveErrors(parseError(err)));
    }
};

export const updateData = gameData => async dispatch => {
    try {
        apiUtil.update(gameData);
    }
    catch(err) {
        return dispatch(receiveErrors(parseError(err)));
    }
};

export const resetData = (session_id, hasP2Joined) => async dispatch => {
    try {
        const game = prepareGameDataForSending({ ..._nullSession });

        game._id = session_id;
        game.hasP2Joined = hasP2Joined;
        apiUtil.update(game);
    }
    catch(err) {
        return dispatch(receiveErrors(parseError(err)));
    }
};

export const cleanUpData = () => async dispatch => {
    try {
        apiUtil.cleanUpGameData();
        return dispatch(clearGameData());
    }
    catch(err) {
        return dispatch(receiveErrors(parseError(err)));
    }
};

export const clearAllGameSessions = () => async dispatch => {
    try {
        const res = window.confirm('Are you sure you want to clear game all sessions?');

        if (res) {
            await callAPI(apiUtil.clearAllGameSessions(), 'Unable to clear game sessions!', (_) => {
                alert('Game Sessions Cleared!');
                return dispatch(clearGameSessions());
            });
        }
    }
    catch(err) {
        return dispatch(receiveErrors(parseError(err)));
    }
};

export const signalPlayerTyping = (session_id, assignedPlayer, isTyping) => async dispatch => {
    try {
        apiUtil.signalPlayerTyping(session_id, assignedPlayer, isTyping);
    }
    catch(err) {
        return dispatch(receiveErrors(parseError(err)));
    }
};

export const sendChatMessage = (msgData) => async dispatch => {
    try {
        apiUtil.sendChatMessage(msgData.session_id, msgData.assignedPlayer, msgData.message);
    }
    catch(err) {
        return dispatch(receiveErrors(parseError(err)));
    }
};

const prepareGameDataForSending = (gameData) => {
    delete gameData.chatMessages;
    delete gameData.hasReceivedMessage;
    delete gameData.isOtherPlayerTyping;
    delete gameData.p1Name;
    delete gameData.p2Name;

    return gameData;
}