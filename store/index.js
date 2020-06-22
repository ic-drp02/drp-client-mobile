import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";

import auth from "./auth";
import posts from "./posts";
import questions from "./questions";
import settings, { initSettings } from "./settings";
import snackbar from "./snackbar";

const root = combineReducers({
  auth,
  posts,
  questions,
  settings,
  snackbar,
});

const store = createStore(root, applyMiddleware(thunkMiddleware));
export default store;

// Initialize settings store from AsyncStorage
store.dispatch(initSettings());

export * from "./auth";
export * from "./posts";
export * from "./questions";
export * from "./settings";
export * from "./snackbar";
