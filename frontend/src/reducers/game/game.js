import {
    INITIALIZE_GAME_DATA,
    UPDATE_GAME_DATA,
    CLEAR_GAME_DATA,
    CLEAR_GAME_SESSIONS
} from 'actions/game';

export const _nullSession = {
    _id: null,
    game_board: Array(9).fill(null),
    currPlayerTurn: 1,
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
        case CLEAR_GAME_SESSIONS:
            return _nullSession;
        default:
            return state;
    }
};

export default gameReducer;