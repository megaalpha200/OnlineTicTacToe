import * as siteInfoAPI from 'util/api/site_info';
import { callAPIAsync } from 'util/helpers';

export const RETRIEVE_INFO = 'RETRIEVE_INFO';
export const SET_UPDATE_DATE = 'SET_UPDATE_DATE';
export const UPDATE_MARQUEE_TEXT = 'UPDATE_MARQUEE_TEXT';
export const SET_MARQUEE_TEXT = 'SET_MARQUEE_TEXT';
export const CLEAR_MARQUEE_TEXT = 'CLEAR_MARQUEE_TEXT';
export const TOGGLE_EDIT_MARQUEE_TEXT = 'TOGGLE_EDIT_MARQUEE_TEXT';

const retrieveInfo = site_info => ({
    type: RETRIEVE_INFO,
    site_info
});

const setUpdateDate = () => ({
    type: SET_UPDATE_DATE
});

export const toggleEditMarqueeText = () => ({
    type: TOGGLE_EDIT_MARQUEE_TEXT
});

export const setMarqueeText = temp_marquee_text => ({
    type: SET_MARQUEE_TEXT,
    temp_marquee_text
});

export const clearMarqueeText = () => ({
    type: CLEAR_MARQUEE_TEXT
});

const updateMarqueeTextAction = () => ({
    type: UPDATE_MARQUEE_TEXT
});

export const retrieveSiteInfo = () => async dispatch => {
    try {
        const responseJSON = await callAPIAsync(await siteInfoAPI.getInfo(), 'Unable to retrieve site info data!');

        if (responseJSON.status === 200) {
            return dispatch(retrieveInfo(responseJSON.result));
        }
    }
    catch(err) {
    }
};

export const updateLastUpdateDate = () => async dispatch => {
    try {
        const res = window.confirm('Set the update date to the current timestamp?');

        if (res) {
            const responseJSON = await callAPIAsync(await siteInfoAPI.updateSiteUpdateDate(), 'Unable to update site update date!');

            if (responseJSON.status === 200) {
                dispatch(setUpdateDate());
                return dispatch(retrieveSiteInfo());
            }
        }
    }
    catch(err) {
    }
};

export const updateMarqueeText = () => async (dispatch, getState) => {
    try {
        const marqueeText = getState().site_info.temp_marquee_text;
        const res = window.confirm('Set the marquee text?');

        if (res) {
            const responseJSON = await callAPIAsync(await siteInfoAPI.updateMarqueeText(marqueeText), 'Unable to update site marquee text!');

            if (responseJSON.status === 200) {
                dispatch(updateMarqueeTextAction());
                return dispatch(retrieveSiteInfo());
            }
        }
    }
    catch(err) {
    }
};