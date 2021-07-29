import {
    INITIALIZE_GAME_DATA,
    UPDATE_GAME_DATA,
    CLEAR_GAME_DATA
} from 'actions/game';

export const _nullSession = { 
    game_board: Array(9).fill(null),
    currPlayerTurn: 1,
    session_id: null,
    winningPlayer: null,
    winningLine: null,
    isDraw: false,
    hasQuitGame: false,
};

const gameReducer =  (state = _nullSession, { type, gameData }) => {
    Object.freeze(state);
    switch (type) {
        case INITIALIZE_GAME_DATA:
            return gameData;
        case UPDATE_GAME_DATA:
            gameData.assignedPlayer = state.assignedPlayer;
            return gameData;
        case CLEAR_GAME_DATA:
            return _nullSession;
        default:
            return state;
    }
};

export default gameReducer;