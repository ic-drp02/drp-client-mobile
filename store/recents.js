import * as recents from "../util/recents";

export function fetchRecentPosts() {
  return async function (dispatch) {
    const posts = await recents.getRecentPosts();
    dispatch({ type: "FETCH_RECENT_POSTS", posts });
  };
}

export function addRecentPost(pId, rId) {
  return async function (dispatch) {
    const posts = await recents.pushRecentPost(pId, rId);
    dispatch({ type: "ADD_RECENT_POST", posts });
  };
}

export function removeRecentPost(id) {
  return async function (dispatch) {
    const posts = await recents.removeRecentPost(id);
    dispatch({ type: "REMOVE_RECENT_POST", posts });
  };
}

const initialState = {
  posts: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_RECENT_POSTS":
      return { ...state, posts: action.posts };

    case "ADD_RECENT_POST":
      return { ...state, posts: action.posts };

    case "REMOVE_RECENT_POST":
      return { ...state, posts: action.posts };

    default:
      return state;
  }
}
