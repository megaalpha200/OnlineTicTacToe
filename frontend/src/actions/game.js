import * as apiUtil from 'util/game';
import { receiveErrors } from 'actions/error';
import { parseError } from 'util/helpers';
import { _nullSession } from 'reducers/game/game';

export const INITIALIZE_GAME_DATA = 'INITIALIZE_GAME_DATA';
export const UPDATE_GAME_DATA = 'UPDATE_GAME_DATA';
export const CLEAR_GAME_DATA = 'CLEAR_GAME_DATA';

const initializeGameData = gameData => ({
    type: INITIALIZE_GAME_DATA,
    gameData
});

const updateGameData = gameData => ({
    type: UPDATE_GAME_DATA,
    gameData
});

const clearGameData = gameData => ({
    type: CLEAR_GAME_DATA,
    gameData
});

const handleReceivedGameData = async (receivedGameData, dispatch, action, shouldAssignPlayer, shouldRefresh) => {
    if (receivedGameData && receivedGameData.game && !receivedGameData.message) {
        const gameData = receivedGameData.game;
        const sessionData = {
            session_id: gameData.session_id
        };

        if (shouldAssignPlayer) sessionData.assignedPlayer = gameData.assignedPlayer;

        await apiUtil.persistGameSession(sessionData);
        if (shouldRefresh) window.location.reload();

        delete gameData._id;
        return dispatch(action(gameData));
    }

    if (receivedGameData.game == null) receivedGameData.game = _nullSession;

    return dispatch(receiveErrors(parseError(receivedGameData)));
}

export const initializeData = (session_id, hasAssignedPlayer) => async dispatch => {
    try {
        if (session_id !== null) apiUtil.initializeUpdateSocket(session_id, updateData => handleReceivedGameData(updateData, dispatch, updateGameData));

        if (hasAssignedPlayer && session_id) return;

        let initData = {..._nullSession};

        if (session_id) { // Only if a second player is joining
            initData.session_id = session_id;
        }

        apiUtil.initialize(initData, (data) => handleReceivedGameData(data, dispatch, initializeGameData, true, session_id === null));
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

        game.session_id = session_id;
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