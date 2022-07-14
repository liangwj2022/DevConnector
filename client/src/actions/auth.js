import axios from "axios";
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CLEAR_PROFILE } from "./types";
import { setAlert } from "./alert.js";
import setAuthToken from "../utils/setAuthToken";

//Load User
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get("/api/auth");
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (error) {
        dispatch({type: AUTH_ERROR});
    }
}

//Register User
export const register = (formData) => async dispatch => {
    try {
        /*
        NOTE: we don't need a config object for axios as the
        default headers in axios are already Content-Type: application/json
        also axios stringifies and parses JSON for you, so no need for 
        JSON.stringify or JSON.parse
        */
        const res = await axios.post("/api/users", formData);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data //token back
        });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;
        console.log(errors);
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
            type: REGISTER_FAIL
        });
    }
} 

//Register User
export const login = (formData) => async dispatch => {
    try {
        /*
        NOTE: we don't need a config object for axios as the
        default headers in axios are already Content-Type: application/json
        also axios stringifies and parses JSON for you, so no need for 
        JSON.stringify or JSON.parse
        */
        const res = await axios.post("/api/auth", formData);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data //token back
        });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
            type: LOGIN_FAIL
        });
    }
}

//logout / clear profile
export const logout = () => dispatch => {
    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: LOGOUT });
}