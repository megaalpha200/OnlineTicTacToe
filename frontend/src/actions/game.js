import * as apiUtil from 'util/api/game';
import { callAPI } from 'util/helpers';
import { receiveErrors } from 'actions/error';
import { parseError } from 'util/helpers';
import { _nullSession } from 'reducers/game/game';

export const INITIALIZE_GAME_DATA = 'INITIALIZE_GAME_DATA';
export const UPDATE_GAME_DATA = 'UPDATE_GAME_DATA';
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

        if (shouldAssignPlayer) sessionData.assignedPlayer = gameData.assignedPlayer;

        await apiUtil.persistGameSession(sessionData);

        return dispatch(action(gameData));
    }

    if (receivedGameData.game == null) receivedGameData.game = _nullSession;

    return dispatch(receiveErrors(parseError(receivedGameData)));
}

const initUpdateSocket = (session_id, assignedPlayer, dispatch) => apiUtil.initializeUpdateSocket(session_id, assignedPlayer, updateData => handleReceivedGameData(updateData, dispatch, updateGameData));

export const initializeData = (session_id, assignedPlayer) => async dispatch => {
    try {
        if (assignedPlayer && session_id) {
            initUpdateSocket(session_id, assignedPlayer, dispatch);
            return;
        }

        let initData = {..._nullSession};

        if (session_id) { // Only if a second player is joining
            initData._id = session_id;
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

export const resetData = session_id => async dispatch => {
    try {
        const game = { 
            ..._nullSession
        };

        game._id = session_id;
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