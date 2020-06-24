import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";

import auth from "./auth";
import connection, { initConnectionInfo } from "./connection";
import downloads from "./downloads";
import posts from "./posts";
import questions from "./questions";
import settings, { initSettings } from "./settings";
import snackbar from "./snackbar";

const root = combineReducers({
  auth,
  connection,
  downloads,
  posts,
  questions,
  settings,
  snackbar,
});

const store = createStore(root, applyMiddleware(thunkMiddleware));
export default store;

// Initialize connection monitoring
store.dispatch(initConnectionInfo());

// Initialize settings store from AsyncStorage
store.dispatch(initSettings());

export * from "./auth";
export * from "./connection";
export * from "./downloads";
export * from "./posts";
export * from "./questions";
export * from "./settings";
export * from "./snackbar";
