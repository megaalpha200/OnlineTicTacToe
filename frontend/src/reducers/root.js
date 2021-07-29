import { combineReducers } from 'redux';
import errors from 'reducers/errors/errors';
import session from 'reducers/session/session';
import site_info from 'reducers/site_info/site_info';
import game from 'reducers/game/game';

export default combineReducers({
    session,
    site_info,
    game,
    errors
});