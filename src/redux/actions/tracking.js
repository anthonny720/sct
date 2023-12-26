import {
    ADD_TRACKING_FAIL,
    ADD_TRACKING_SUCCESS,
    GET_CALENDAR_FAIL,
    GET_CALENDAR_SUCCESS,
    GET_OUTSOURCING_FAIL,
    GET_OUTSOURCING_SUCCESS,
    GET_SUMMARY_FAIL,
    GET_SUMMARY_SUCCESS,
    GET_TRACKING_FAIL,
    GET_TRACKING_SUCCESS,
    SEND_TRACKING_FAIL,
    SEND_TRACKING_SUCCESS,
    UPDATE_TRACKING_FAIL,
    UPDATE_TRACKING_SUCCESS
} from "./types";
import axios from "axios";
import {setAlert} from "./alert";

export const get_tracking = (params) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`, 'Accept': 'application/json'
        }, params: {...params}
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/tracking/`, config);
        if (res.status === 200) {
            dispatch({
                type: GET_TRACKING_SUCCESS, payload: res.data
            });
        } else {
            dispatch({
                type: GET_TRACKING_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: GET_TRACKING_FAIL
        });
    }
}
export const add_tracking = (form, params) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`, 'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/tracking/`, form, config);
        if (res.status === 201) {
            dispatch({
                type: ADD_TRACKING_SUCCESS
            })
            dispatch(get_tracking(params));
            dispatch(setAlert(res.data.message, 'success'));

        } else {
            dispatch({
                type: ADD_TRACKING_FAIL
            });
        }
    } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
            dispatch(setAlert(err.response.data.message, 'error'));
        } else {
            dispatch(setAlert('Ocurrió un error al registrar la asistencia', 'error'));
        }
        dispatch({type: ADD_TRACKING_FAIL});
    }
}
export const update_tracking = (form, id, params) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`, 'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.patch(`${process.env.REACT_APP_API_URL}/api/tracking/${id}`, form, config);
        if (res.status === 200) {
            dispatch({
                type: UPDATE_TRACKING_SUCCESS
            })
            dispatch(get_tracking(params));
            dispatch(setAlert(res.data.message, 'success'));

        } else {
            dispatch({
                type: UPDATE_TRACKING_FAIL
            });
        }
    } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
            dispatch(setAlert(err.response.data.message, 'error'));
        } else {
            dispatch(setAlert('Ocurrió un error al actualizar la asistencia', 'error'));
        }
        dispatch({type: UPDATE_TRACKING_FAIL});
    }
}

export const send_tracking = (form) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`, 'Accept': 'application/json'
        }
    };
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/tracking/scanner`, form, config);
        if (res.status === 201) {
            dispatch({
                type: SEND_TRACKING_SUCCESS, payload: res.data
            })
            dispatch(setAlert(res.data.message, 'success'));

        } else {
            dispatch({
                type: SEND_TRACKING_FAIL
            });
        }
    } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
            dispatch(setAlert(err.response.data.message, 'error'));
        } else {
            dispatch(setAlert('Ocurrió un error al registrar la asistencia', 'error'));
        }
        dispatch({type: SEND_TRACKING_FAIL});
    }
}


export const get_summary = (params) => async dispatch => {
    const config = {

        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`, 'Accept': 'application/json'
        },

        params: {...params}
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/tracking/summary`, config);
        if (res.status === 200) {
            dispatch({
                type: GET_SUMMARY_SUCCESS, payload: res.data
            });
        } else {
            dispatch({
                type: GET_SUMMARY_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: GET_SUMMARY_FAIL
        });
    }
}

export const get_outsourcing = (params) => async dispatch => {
    const config = {

        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`, 'Accept': 'application/json'
        },

        params: {...params}
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/tracking/outsourcing`, config);
        if (res.status === 200) {
            dispatch({
                type: GET_OUTSOURCING_SUCCESS, payload: res.data
            });
        } else {
            dispatch({
                type: GET_OUTSOURCING_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: GET_OUTSOURCING_FAIL
        });
    }
}

export const get_calendar = (params) => async dispatch => {
    const config = {

        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`, 'Accept': 'application/json'
        },

        params: {...params}
    };
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/tracking/calendar`, config);
        if (res.status === 200) {
            dispatch({
                type: GET_CALENDAR_SUCCESS, payload: res.data
            });
        } else {
            dispatch({
                type: GET_CALENDAR_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: GET_CALENDAR_FAIL
        });
    }
}

