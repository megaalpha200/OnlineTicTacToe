import {
    SUBSCRIBE_USER_TO_SESSION_EVENTS,
    RECEIVE_CURRENT_USER,
    RECEIVE_CURRENT_USER_AFTER_DETAIL_UPDATE,
    LOGOUT_CURRENT_USER,
    LOGOUT_ALL_USERS,
    RESET_WAS_USER_DETAIL_UPDATED_FLAG
} from 'actions/session';

const _nullSession = { 
    userId: null,
    username: null,
    email: null,
    isAdmin: false,
    isPseudoAdmin: false,
    user_type: null,
    subscribed_to_session_events: false,
    wasUserDetailUpdated: false,
};

const userReceivedState = user => ({ ...user, isAdmin: (user.user_type === 'true_admin') ? true : undefined, isPseudoAdmin: (user.user_type === 'pseudo_admin') ? true : undefined });

 const sessionReducer = (state = _nullSession, { type, user }) => {
    Object.freeze(state);
    switch (type) {
        case SUBSCRIBE_USER_TO_SESSION_EVENTS:
            return { ...state, subscribed_to_session_events: true };
        case RECEIVE_CURRENT_USER:
            return userReceivedState(user);
        case RECEIVE_CURRENT_USER_AFTER_DETAIL_UPDATE:
            return userReceivedState({...user, wasUserDetailUpdated: true});
        case RESET_WAS_USER_DETAIL_UPDATED_FLAG:
            return { ...state, wasUserDetailUpdated: false};
        case LOGOUT_CURRENT_USER:
        case LOGOUT_ALL_USERS:
            return _nullSession;
        default:
            return state;
    }
};

export default sessionReducer;