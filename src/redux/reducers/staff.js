import {
    FIND_USER_FAIL,
    FIND_USER_SUCCESS,
    GET_ABSENTEEISM_FAIL,
    GET_ABSENTEEISM_SUCCESS,
    GET_DEPARTMENTS_FAIL,
    GET_DEPARTMENTS_SUCCESS,
    GET_STAFFS_FAIL,
    GET_STAFFS_SUCCESS,
    GET_USERS_NOT_TRACKING_FAIL,
    GET_USERS_NOT_TRACKING_SUCCESS
} from "../actions/types";

const initialState = {
    departments: null, absenteeism: null, staffs: null, users_not_tracking: null, user: null
}

export default function Staff(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case GET_STAFFS_SUCCESS:
            return {
                ...state, staffs: payload.data
            }
        case GET_STAFFS_FAIL:
            return {
                ...state, staffs: null

            }
        case GET_ABSENTEEISM_SUCCESS:
            return {
                ...state, absenteeism: payload.data
            }
        case GET_ABSENTEEISM_FAIL:
            return {
                ...state, absenteeism: null
            }
        case GET_DEPARTMENTS_SUCCESS:
            return {
                ...state, departments: payload.data
            }
        case GET_DEPARTMENTS_FAIL:
            return {
                ...state, departments: null
            }
        case GET_USERS_NOT_TRACKING_SUCCESS:
            return {
                ...state, users_not_tracking: payload.data
            }
        case GET_USERS_NOT_TRACKING_FAIL:
            return {
                ...state, users_not_tracking: null
            }
        case FIND_USER_SUCCESS:
            return {
                ...state, user: payload.data
            }
        case FIND_USER_FAIL:
            return {
                ...state, user: null
            }

        default:
            return state
    }
}