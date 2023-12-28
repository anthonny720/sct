import {
    ADD_STAFF_FAIL,
    ADD_STAFF_SUCCESS,
    FIND_USER_FAIL,
    FIND_USER_SUCCESS,
    GET_ABSENTEEISM_FAIL,
    GET_ABSENTEEISM_SUCCESS,
    GET_DEPARTMENTS_FAIL,
    GET_DEPARTMENTS_SUCCESS,
    GET_STAFFS_FAIL,
    GET_STAFFS_SUCCESS,
    GET_USERS_NOT_TRACKING_FAIL,
    GET_USERS_NOT_TRACKING_SUCCESS,
    UPDATE_STAFF_FAIL,
    UPDATE_STAFF_SUCCESS
} from "./types";
import axios from "axios";
import {setAlert} from "./alert";

export const get_departments = () => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`, 'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/staff/department/`, config);
        if (res.status === 200) {
            dispatch({
                type: GET_DEPARTMENTS_SUCCESS, payload: res.data
            });
        } else {
            dispatch({
                type: GET_DEPARTMENTS_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: GET_DEPARTMENTS_FAIL
        });
    }
}
export const get_absenteeism = () => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`, 'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/staff/absenteeism/`, config);
        if (res.status === 200) {
            dispatch({
                type: GET_ABSENTEEISM_SUCCESS, payload: res.data
            });
        } else {
            dispatch({
                type: GET_ABSENTEEISM_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: GET_ABSENTEEISM_FAIL
        });
    }
}

export const get_staffs = (params) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`, 'Accept': 'application/json'
        }, params: {...params}
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/staff/`, config);
        if (res.status === 200) {
            dispatch({
                type: GET_STAFFS_SUCCESS, payload: res.data
            });
        } else {
            dispatch({
                type: GET_STAFFS_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: GET_STAFFS_FAIL
        });
    }
}

export const add_staff = (form, params) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`, 'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/staff/`, form, config);
        if (res.status === 201) {
            dispatch({
                type: ADD_STAFF_SUCCESS
            });
            dispatch(get_staffs(params));
            dispatch(setAlert(res.data.message, 'success'));
        } else {
            dispatch({
                type: ADD_STAFF_FAIL
            });
        }
    } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
            dispatch(setAlert(err.response.data.message, 'error'));
        } else {
            dispatch(setAlert('Ocurrió un error al registrar el usuario', 'error'));
        }
        dispatch({type: ADD_STAFF_FAIL});
    }
}

export const update_staff = (form, id, params) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`, 'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.patch(`${process.env.REACT_APP_API_URL}/api/staff/${id}/`, form, config);
        if (res.status === 200) {
            dispatch({
                type: UPDATE_STAFF_SUCCESS
            });
            dispatch(setAlert(res.data.message, 'success'));
            dispatch(get_staffs(params));
        } else {
            dispatch({
                type: UPDATE_STAFF_FAIL
            });
        }
    } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
            dispatch(setAlert(err.response.data.message, 'error'));
        } else {
            dispatch(setAlert('Ocurrió un error al actualizar el usuario', 'error'));
        }
        dispatch({type: UPDATE_STAFF_FAIL});
    }
}

export const get_users_not_tracking = (form) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`, 'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/staff/not-tracking/`, form, config);
        if (res.status === 200) {
            dispatch({
                type: GET_USERS_NOT_TRACKING_SUCCESS, payload: res.data
            });
        } else {
            dispatch({
                type: GET_USERS_NOT_TRACKING_FAIL
            });
        }
    } catch (err) {
        dispatch({type: GET_USERS_NOT_TRACKING_FAIL});
    }
}

export const find_user = (form) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`, 'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/staff/find/`, form, config);
        if (res.status === 200) {
            dispatch({
                type: FIND_USER_SUCCESS, payload: res.data
            });
        } else {
            dispatch({
                type: FIND_USER_FAIL
            });
        }
    } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
            dispatch(setAlert(err.response.data.message, 'error'));
        } else {
            dispatch(setAlert('Ocurrió un error al actualizar el usuario', 'error'));
        }
        dispatch({
            type: FIND_USER_FAIL
        });

    }
}