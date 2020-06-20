import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";

import auth from "./auth";
import posts from "./posts";
import questions from "./questions";
import snackbar from "./snackbar";

const root = combineReducers({
  auth,
  posts,
  questions,
  snackbar,
});

export default createStore(root, applyMiddleware(thunkMiddleware));

export * from "./auth";
export * from "./posts";
export * from "./questions";
export * from "./snackbar";
