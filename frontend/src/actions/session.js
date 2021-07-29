import * as apiUtil from 'util/api/sessions';
import { receiveErrors } from 'actions/error';
import Joi from 'joi';
import { signIn, signUp, changeUsername as changeUsernameJoi, changePassword as changePasswordJoi } from 'validations/user';
import { parseError } from 'util/helpers';

export const SUBSCRIBE_USER_TO_SESSION_EVENTS = 'SUBSCRIBE_USER_TO_SESSION_EVENTS';
export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const RECEIVE_CURRENT_USER_AFTER_DETAIL_UPDATE = 'RECEIVE_CURRENT_USER_AFTER_PASSWORD_CHANGE';
export const LOGOUT_CURRENT_USER = 'LOGOUT_CURRENT_USER';
export const LOGOUT_ALL_USERS = 'LOGOUT_ALL_USERS';
export const RESET_WAS_USER_DETAIL_UPDATED_FLAG = 'RESET_WAS_USER_DETAIL_UPDATED_FLAG';

const subscribeUserToSessionEvents = () => ({
    type: SUBSCRIBE_USER_TO_SESSION_EVENTS
});

const receiveCurrentUser = user => ({
    type: RECEIVE_CURRENT_USER,
    user
});

const receiveCurrentUserAfterDetailUpdate = user => ({
    type: RECEIVE_CURRENT_USER_AFTER_DETAIL_UPDATE,
    user
});

export const logoutCurrentUser = () => ({
    type: LOGOUT_CURRENT_USER
});

const logoutAllUsers = () => ({
    type: LOGOUT_ALL_USERS
});

export const resetWasUserDetailUpdatedFlag = () => ({
    type: RESET_WAS_USER_DETAIL_UPDATED_FLAG
});

export const clearUserSessions = (prompt = false) => async (dispatch, getState) => {
    const clearSessions = async (dispatch, getState) => {
        await apiUtil.clearUserSessions(getState().session.userId, data => {
            if (data !== 'ERROR') {
                return dispatch(logoutCurrentUser());
            }
            else {
                alert('Unable to clear user sessions! Please try again later.');
            }
        });
    }

    if (prompt) {
        const res = window.confirm('Are you sure you want to clear all your sessions?');

        if (res) {
            await clearSessions(dispatch, getState);
        }
    }
    else {
        await clearSessions(dispatch, getState);
    }
};

export const login = user => async dispatch => {
    try {
        const { email, emailHash, passwordHash } = user;
        await Joi.validate({ email }, signIn);

        const userData = {
            email: emailHash,
            password: passwordHash
        };

        const response = await apiUtil.login(userData);
        const data = await response.json();

        if (response.ok) {
            window.localStorage.setItem('em', Buffer.from(email).toString('base64'));
            data.email = email;
            return dispatch(receiveCurrentUser(data));
        }
        return dispatch(receiveErrors(data));
    }
    catch(err) {
        return dispatch(receiveErrors(parseError(err)));
    }
};

export const signup = user => async dispatch => {
    try {
        const { email, password, username, emailHash, passwordHash, user_type } = user;
        await Joi.validate({ username, email, password }, signUp);

        const userData = {
            email: emailHash,
            password: passwordHash,
            username,
            user_type
        };

        const response = await apiUtil.signup(userData);
        const data = await response.json();

        if (response.ok) {
            window.localStorage.setItem('em', Buffer.from(email).toString('base64'));
            data.email = email;

            window.location.href='/dashboard';
            return dispatch(receiveCurrentUser(data));
        }
        return dispatch(receiveErrors(data));
    }
    catch(err) {
        return dispatch(receiveErrors(parseError(err)));
    }
};

export const logout = () => async dispatch => {
    const res = window.confirm('Are you sure you want to log out?');

    if (res) {
        const response = await apiUtil.logout();
        const data = await response.json();

        if (response.ok) {
            window.localStorage.removeItem('em');
            window.location.reload();
            return dispatch(logoutCurrentUser());
        }
        return dispatch(receiveErrors(data));
    }
};

export const changeUsername = (user) => async (dispatch, getState) => {
    try {
        const { userId, username } = user;
        await Joi.validate({ username }, changeUsernameJoi);

        const userData = {
            userId,
            username
        };

        const response = await apiUtil.changeUsername(userData);
        const data = await response.json();

        if (response.ok) {
            alert('Username Changed Successfully!');
            return dispatch(receiveCurrentUserAfterDetailUpdate({ ...getState().session, ...data }));
        }
        return dispatch(receiveErrors(data));
    }
    catch(err) {
        return dispatch(receiveErrors('Something went wrong! Please try again later.'));
    }
};

export const changeEmail = (user) => async (dispatch, getState) => {
    try {
        const { userId, email, emailHash, password, oldPasswordHash, newPasswordHash } = user;
        await Joi.validate({ email, password }, signIn);

        const userData = {
            userId,
            email: emailHash,
            old_password: oldPasswordHash,
            new_password: newPasswordHash
        };

        const response = await apiUtil.changeUserEmail(userData);
        const data = await response.json();

        if (response.ok) {
            alert('Email Changed Successfully!');
            window.localStorage.removeItem('em');
            dispatch(clearUserSessions());
        }
        return dispatch(receiveErrors(data));
    }
    catch(err) {
        return dispatch(receiveErrors('Something went wrong! Please try again later.'));
    }
};

export const changePassword = (user) => async (dispatch, getState) => {
    try {
        const { userId, emailHash, oldPassword, oldPasswordHash, newPassword, newPasswordHash} = user;
        await Joi.validate({ old_password: oldPassword, new_password: newPassword }, changePasswordJoi);

        const userData = {
            userId,
            email: emailHash,
            old_password: oldPasswordHash,
            new_password: newPasswordHash
        };

        const response = await apiUtil.changeUserPassword(userData);
        const data = await response.json();

        if (response.ok) {
            alert('Password Changed Successfully!');
            dispatch(clearUserSessions());
        }
        return dispatch(receiveErrors(data));
    }
    catch(err) {
        return dispatch(receiveErrors('Something went wrong! Please try again later.'));
    }
};

export const subscribeToSessionValidation = () => async (dispatch, getState) => {
    const isLoggedIn = Boolean(getState().session.userId);
    const subscribed_to_session_events = getState().session.subscribed_to_session_events;

    if (isLoggedIn && !subscribed_to_session_events) {
        await apiUtil.initializeClearSessionsSocket(getState().session.userId, data => {
            if (data !== 'ERROR') {
                alert('Your session has expired! Please log in again.');
                window.location.href='/login';
                return dispatch(logoutCurrentUser());
            }
        });

        return dispatch(subscribeUserToSessionEvents());
    }
};

export const clearAllSessions = () => async dispatch => {
    const res = window.confirm('Are you sure you want to clear all sessions?');

    if (res) {
        await apiUtil.clearSessions(data => {
            if (data !== 'ERROR') {
                return dispatch(logoutAllUsers());
            }
            else {
                alert('Unable to clear user sessions! Please try again later.');
            }
        });
    }
};