import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, ACCOUNT_DELETED } from "../actions/types";

const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null
}


function authReducer (state=initialState, action){
    const {type, payload} = action;
    switch (type) {
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem("token", payload.token);
            return {
                ...state,
                ...payload,
                loading: false,
                isAuthenticated: true
            };
        case USER_LOADED:
            return {
                ...state,
                user: payload,
                loading: false,
                isAuthenticated: true
            };
        //same handle: REGISTER_FAIL, AUTH_ERROR
        case LOGIN_FAIL:
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGOUT:
        case ACCOUNT_DELETED:   
            localStorage.removeItem("token");
            return {
                ...state,
                token: null,
                loading: false,
                isAuthenticated: false,
                user: null
            };
        default:
            return state;
    }
}

export default authReducer;