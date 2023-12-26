import {
    AUTHENTICATED_FAIL,
    AUTHENTICATED_SUCCESS,
    CHANGE_PASSWORD_FAIL,
    CHANGE_PASSWORD_SUCCESS,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT,
    REFRESH_FAIL,
    REFRESH_SUCCESS,
    REMOVE_AUTH_LOADING,
    SET_AUTH_LOADING,
    USER_LOADED_FAIL,
    USER_LOADED_SUCCESS
} from '../actions/types'

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    user: null,
    loading: false
}

export default function Auth(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case SET_AUTH_LOADING:
            return {
                ...state, loading: true
            }
        case REMOVE_AUTH_LOADING:
            return {
                ...state, loading: false
            }
        case USER_LOADED_SUCCESS:
            return {
                ...state, user: payload
            }
        case USER_LOADED_FAIL:
            return {
                ...state, user: null
            }
        case AUTHENTICATED_SUCCESS:
            return {
                ...state, isAuthenticated: true
            }
        case AUTHENTICATED_FAIL:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state, isAuthenticated: false, access: null, refresh: null
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('access', payload.access);
            localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                access: localStorage.getItem('access'),
                refresh: localStorage.getItem('refresh')
            }
        case REFRESH_SUCCESS:
            localStorage.setItem('access', payload.access);
            return {
                ...state, access: localStorage.getItem('access')
            }
        case LOGIN_FAIL:
        case REFRESH_FAIL:
        case LOGOUT:
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            return {
                ...state, access: null, refresh: null, isAuthenticated: false, user: null,
            }
        case CHANGE_PASSWORD_SUCCESS:
        case CHANGE_PASSWORD_FAIL:
            return {
                ...state,
            }
        default:
            return state
    }
}