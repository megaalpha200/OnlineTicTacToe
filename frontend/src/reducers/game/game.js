import {
    INITIALIZE_GAME_DATA,
    UPDATE_GAME_DATA,
    UPDATE_CHAT_DATA,
    CLEAR_RECEIVED_MESSAGE_FLAG,
    SET_IS_TYPING_FLAG,
    CLEAR_IS_TYPING_FLAG,
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
    hasP2Joined: false,
    chatMessages: [],
    hasReceivedMessage: false,
    isOtherPlayerTyping: false,
};

const gameReducer =  (state = _nullSession, { type, gameData, chatData, assignedPlayerTyping }) => {
    Object.freeze(state);
    switch (type) {
        case INITIALIZE_GAME_DATA:
            return gameData;
        case UPDATE_GAME_DATA:
            return { ...state, ...gameData, assignedPlayer: state.assignedPlayer };
        case UPDATE_CHAT_DATA:
            const chatMessages = (state.chatMessages !== undefined) ? state.chatMessages : [];
            chatMessages.push(chatData);
            return { ...state, chatMessages, hasReceivedMessage: true };
        case CLEAR_RECEIVED_MESSAGE_FLAG:
            return { ...state, hasReceivedMessage: false };
        case SET_IS_TYPING_FLAG:
            if (assignedPlayerTyping !== state.assignedPlayer) return { ...state, isOtherPlayerTyping: true }; else return state;
        case CLEAR_IS_TYPING_FLAG:
            if (assignedPlayerTyping !== state.assignedPlayer) return { ...state, isOtherPlayerTyping: false }; else return state;
        case CLEAR_GAME_DATA:
        case CLEAR_GAME_SESSIONS:
            return _nullSession;
        default:
            return state;
    }
};

export default gameReducer;