import axios from "axios";
import { setAlert } from "./alert";
import { GET_REPOS, GET_PROFILE, GET_PROFILES, PROFILE_ERROR, UPDATE_PROFILE, ACCOUNT_DELETED, CLEAR_PROFILE } from "./types";

//Get current user profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get("/api/profile/me");
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Get all profile
export const getProfiles = () => async dispatch => {
    dispatch({
        type: CLEAR_PROFILE
    })
    try {
        const res = await axios.get("/api/profile");
        dispatch({
            type: GET_PROFILES,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Get profile by id
export const getProfileById = (id) => async dispatch => {
    dispatch({
        type: CLEAR_PROFILE
    })
    try {
        const res = await axios.get(`/api/profile/user/${id}`);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Get Github Repo
export const getGithubRepos = (username) => async dispatch => {
    try {
        const res = await axios.get(`/api/profile/github/${username}`);
        dispatch({
            type: GET_REPOS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Create or update profile
export const createProfile = (formData, navigate, edit = false) => async dispatch => {
    try {
        const res = await axios.post("/api/profile", formData);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
        dispatch(setAlert(edit? "Profile updated": "Profile created", "success"));
        if(!edit){
            navigate('/dashboard');
        }
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Add experience
export const addExperience = (formData, navigate) => async dispatch => {
    try {
        const res = await axios.put("/api/profile/experience", formData);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert("Experience Added Successfully!", "success"));
        navigate("/dashboard");
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Add education
export const addEducation = (formData, navigate) => async dispatch => {
    try {
        const res = await axios.put("/api/profile/education", formData);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert("Education Added Successfully!", "success"));
        navigate("/dashboard");
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Delete Experience
export const deleteExperience = (id) => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert("Experience Deleted Successfully!", "success"));
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//delete Education
export const deleteEducation = (id) => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert("Education Deleted Successfully!", "success"));
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Delete account and profile
export const deleteAccount = () => async dispatch => {
    if(window.confirm("Are you sure to delete the account?")){
        try {
            await axios.delete("/api/profile");
            dispatch({
                type: CLEAR_PROFILE
            });
            dispatch({
                type: ACCOUNT_DELETED
            });

            dispatch(setAlert("Account Deleted Successfully!", "success"));
        } catch (err) {
            const errors = err.response.data.errors;
            if(errors){
                errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
            }
            dispatch({
                type: PROFILE_ERROR,
                payload: {msg: err.response.statusText, status: err.response.status}
            })
        }
    }
}

