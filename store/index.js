import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";

import posts from "./posts";
import snackbar from "./snackbar";

const root = combineReducers({
  posts,
  snackbar,
});

export default createStore(root, applyMiddleware(thunkMiddleware));

export * from "./posts";
export * from "./snackbar";
