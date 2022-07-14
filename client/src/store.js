import { configureStore } from "@reduxjs/toolkit";
import thunk from 'redux-thunk';
import rootReducer from './reducers';
//import setAuthToken from './utils/setAuthToken';

const initialState = {};

const middleware = [thunk];

const store = configureStore({
  reducer: rootReducer,
  middleware: middleware,
  initialState
});

export default store;

