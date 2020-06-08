import api from "../util/api";

import { showSnackbar, hideSnackbar } from "./snackbar";
import { removeRecentPost } from "./recents";

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
    dispatch(removeRecentPost(id));
  };
}

export default function reducer(state = null, action) {
  switch (action.type) {
    case "REFRESH_POSTS_BEGIN":
      return state;

    case "REFRESH_POSTS_SUCCESS":
      return action.posts;

    case "DELETE_POST_SUCCESS":
      return state.filter((p) => p.id !== action.id);

    default:
      return state;
  }
}
