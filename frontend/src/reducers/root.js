import { combineReducers } from 'redux';
import errors from 'reducers/errors/errors';
import session from 'reducers/session/session';
import game from 'reducers/game/game';

export default combineReducers({
    session,
    game,
    errors
});