import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";

import api from "./util/api";

function refreshPostsBegin() {
  return { type: "REFRESH_POSTS_BEGIN" };
}

function refreshPostsSuccess(posts) {
  return { type: "REFRESH_POSTS_SUCCESS", posts };
}

export function refreshPosts() {
  return async function (dispatch) {
    dispatch(refreshPostsBegin());

    const res = await api.getPosts();
    if (!res.success) {
      console.warn("failed to get posts with status " + res.status);
    }

    dispatch(refreshPostsSuccess(res.data));
  };
}

function deletePostBegin(id) {
  return { type: "DELETE_POST_BEGIN", id };
}

function deletePostSuccess(id) {
  return { type: "DELETE_POST_SUCCESS", id };
}

function deletePostFailure(id) {
  return { type: "DELETE_POST_FAILURE", id };
}

export function deletePost(id) {
  return async function (dispatch) {
    dispatch(deletePostBegin(id));

    const res = await api.deletePost(id);
    if (!res.success) {
      console.warn(`failed to delete post ${id} with status ${res.status}`);
      dispatch(deletePostFailure(id));
      return;
    }

    dispatch(
      showSnackbar("Deleted!", 2000, {
        label: "hide",
        onPress: () => dispatch(hideSnackbar()),
      })
    );

    dispatch(deletePostSuccess(id));
  };
}

export function showSnackbar(message, duration, action) {
  return { type: "SHOW_SNACKBAR", message, duration, action };
}

export function hideSnackbar() {
  return { type: "HIDE_SNACKBAR" };
}

const initialState = {
  posts: null,
  snackbar: {
    visible: false,
    message: null,
    duration: 0,
    action: null,
  },
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "REFRESH_POSTS_BEGIN":
      return { ...state, posts: null };

    case "REFRESH_POSTS_SUCCESS":
      return { ...state, posts: action.posts };

    case "DELETE_POST_SUCCESS":
      return { ...state, posts: state.posts.filter((p) => p.id !== action.id) };

    case "SHOW_SNACKBAR":
      return {
        ...state,
        snackbar: {
          visible: true,
          message: action.message,
          duration: action.duration,
          action: action.action,
        },
      };

    case "HIDE_SNACKBAR":
      return { ...state, snackbar: { ...state.snackbar, visible: false } };

    default:
      return state;
  }
}

export default createStore(reducer, applyMiddleware(thunkMiddleware));
