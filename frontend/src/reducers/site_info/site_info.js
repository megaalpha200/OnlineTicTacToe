import {
    RETRIEVE_INFO,
    TOGGLE_EDIT_MARQUEE_TEXT,
    SET_MARQUEE_TEXT,
    UPDATE_MARQUEE_TEXT,
    SET_UPDATE_DATE,
    CLEAR_MARQUEE_TEXT
} from 'actions/site_info';

const _nullInfo = { 
    last_update: 0, 
    marquee_text: null,
    temp_marquee_text: null,
    canEditMarqueeText: true,
};

 const siteInfoReducer = (state = _nullInfo, { type, site_info, temp_marquee_text }) => {
    Object.freeze(state);
    switch (type) {
        case RETRIEVE_INFO:
            return { ...state, ...site_info, temp_marquee_text: site_info.marquee_text };
        case SET_UPDATE_DATE:
            return { ...state, last_update: 'Updated!' };
        case TOGGLE_EDIT_MARQUEE_TEXT:
            return { ...state, canEditMarqueeText: !state.canEditMarqueeText, temp_marquee_text: state.marquee_text };
        case SET_MARQUEE_TEXT:
            return { ...state, temp_marquee_text: temp_marquee_text };
        case CLEAR_MARQUEE_TEXT:
            return { ...state, temp_marquee_text: null };
        case UPDATE_MARQUEE_TEXT:
            return { ...state, marquee_text: 'Updated!', canEditMarqueeText: false };
        default:
            return state;
    }
};

export default siteInfoReducer;