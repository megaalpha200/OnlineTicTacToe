import { combineReducers } from 'redux';
import errors from 'reducers/errors/errors';
import session from 'reducers/session/session';

export default combineReducers({
    session,
    errors
});