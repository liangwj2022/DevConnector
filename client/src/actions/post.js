import axios from "axios";
import { ADD_POST, DELETE_POST, GET_POSTS, GET_POST ,POST_ERROR, UPDATE_LIKES, ADD_COMMENT, REMOVE_COMMENT } from "./types";
import { setAlert } from "./alert";
//Get posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get("/api/posts");
        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Add like
export const addLike = (postId) => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${postId}`);
        dispatch({
            type: UPDATE_LIKES,
            payload: {postId, likes: res.data}
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Remove like
export const removeLike = (postId) => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${postId}`);
        dispatch({
            type: UPDATE_LIKES,
            payload: {postId, likes: res.data}
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Delete post
export const deletePost = (id) => async dispatch => {
    try {
        await axios.delete(`/api/posts/${id}`);
        dispatch({
            type: DELETE_POST,
            payload: id
        })
        dispatch(setAlert("Post removed", "success"));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Add post
export const addPost = (formData) => async dispatch => {
    try {
        const res = await axios.post(`/api/posts`, formData);
        dispatch({
            type: ADD_POST,
            payload: res.data
        })
        dispatch(setAlert("Post created", "success"));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Get post
export const getPost = (id) => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`);
        dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Add comment
export const addComment = (id, formData) => async dispatch => {
    try {
        const res = await axios.post(`/api/posts/comment/${id}`, formData);
        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })
        dispatch(setAlert("Comment added", "success"));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Delete comment
export const deleteComment = (postId, comment_id) => async dispatch => {
    try {
        await axios.delete(`/api/posts/comment/${postId}/${comment_id}`);
        dispatch({
            type: REMOVE_COMMENT,
            payload: comment_id
        })
        dispatch(setAlert("Comment deleted", "success"));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}
