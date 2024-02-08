import {
    ADD_TRACKING_FAIL,
    ADD_TRACKING_SUCCESS,
    GET_CALENDAR_FAIL,
    GET_CALENDAR_SUCCESS,
    GET_OUTSOURCING_FAIL,
    GET_OUTSOURCING_SUCCESS,
    GET_REAL_TRACKING_FAIL,
    GET_REAL_TRACKING_SUCCESS,
    GET_SUMMARY_FAIL,
    GET_SUMMARY_SUCCESS,
    GET_TRACKING_FAIL,
    GET_TRACKING_SUCCESS,
    SEND_TRACKING_FAIL,
    SEND_TRACKING_SUCCESS,
    UPDATE_TRACKING_FAIL,
    UPDATE_TRACKING_SUCCESS
} from "../actions/types";

const initialState = {
    tracking: null, summary: null, outsourcing: null, calendar: null, info: null, tracking_real: null
}

export default function Tracking(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {

        case GET_CALENDAR_SUCCESS:
            return {
                ...state, calendar: payload.data
            }
        case GET_CALENDAR_FAIL:
            return {
                ...state, calendar: null
            }
        case GET_OUTSOURCING_SUCCESS:
            return {
                ...state, outsourcing: payload.data
            }
        case GET_OUTSOURCING_FAIL:
            return {
                ...state, outsourcing: null
            }
        case GET_SUMMARY_SUCCESS:
            return {
                ...state, summary: payload.data
            }
        case GET_SUMMARY_FAIL:
            return {
                ...state, summary: null
            }
        case GET_TRACKING_SUCCESS:
            return {
                ...state, tracking: payload.data
            }
        case GET_TRACKING_FAIL:
            return {
                ...state, tracking: null
            }
        case GET_REAL_TRACKING_SUCCESS:
            return {
                ...state, tracking_real: payload.data
            }
        case GET_REAL_TRACKING_FAIL:
            return {
                ...state, tracking_real: null
            }
        case SEND_TRACKING_SUCCESS:
            return {
                ...state, info: payload.data
            }

        case SEND_TRACKING_FAIL:
            return {
                ...state, info: null
            }
        case ADD_TRACKING_SUCCESS:
        case ADD_TRACKING_FAIL:
        case UPDATE_TRACKING_SUCCESS:
        case UPDATE_TRACKING_FAIL:

            return {
                ...state
            }
        default:
            return state
    }
}