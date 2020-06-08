import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";

import posts from "./posts";
import questions from "./questions";
import recents from "./recents";
import snackbar from "./snackbar";

const root = combineReducers({
  posts,
  questions,
  recents,
  snackbar,
});

export default createStore(root, applyMiddleware(thunkMiddleware));

export * from "./posts";
export * from "./questions";
export * from "./recents";
export * from "./snackbar";
