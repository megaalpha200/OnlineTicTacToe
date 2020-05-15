import * as apiUtil from 'util/sessions';
import { receiveErrors } from 'actions/error';
import Joi from 'joi';
import { signIn, signUp } from 'validations/user';
import { parseError } from 'util/helpers';


export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const LOGOUT_CURRENT_USER = 'LOGOUT_CURRENT_USER';

const receiveCurrentUser = user => ({
    type: RECEIVE_CURRENT_USER,
    user
});

const logoutCurrentUser = () => ({
    type: LOGOUT_CURRENT_USER
});

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
        const { email, password, username, emailHash, passwordHash } = user;
        await Joi.validate({ username, email, password }, signUp);

        const userData = {
            email: emailHash,
            password: passwordHash,
            username: username
        };

        const response = await apiUtil.signup(userData);
        const data = await response.json();

        if (response.ok) {
            return dispatch(receiveCurrentUser(data));
        }
        return dispatch(receiveErrors(data));
    }
    catch(err) {
        return dispatch(receiveErrors(parseError(err)));
    }
};

export const logout = () => async dispatch => {
    const response = await apiUtil.logout();
    const data = await response.json();

    if (response.ok) {
        return dispatch(logoutCurrentUser());
    }
    return dispatch(receiveErrors(data));
};