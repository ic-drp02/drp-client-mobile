import api from "../util/api";
import {
  getPids,
  getFavouriteIds,
  saveFavouriteIds,
  buildPostIdToRevIdMap,
} from "../util/favourites";

import { showSnackbar, hideSnackbar } from "./snackbar";

const REFRESH_POSTS_BEGIN = "REFRESH_POSTS_BEGIN";
const REFRESH_POSTS_SUCCESS = "REFRESH_POSTS_SUCCESS";
const DELETE_POST_BEGIN = "DELETE_POST_BEGIN";
const DELETE_POST_FAILURE = "DELETE_POST_FAILURE";

const initialState = {
  latest: [],
  favourites: [],
};

function refreshPostsBegin() {
  return { type: REFRESH_POSTS_BEGIN };
}

function refreshPostsSuccess(latest, favourites) {
  return { type: REFRESH_POSTS_SUCCESS, latest, favourites };
}

export function refreshPosts() {
  return async function (dispatch) {
    dispatch(refreshPostsBegin());

    // Fetch 3 newest post to show in the latest updates
    // TODO: This call is horrific, change API to use object instead
    const latestRes = await api.getPosts(undefined, undefined, 3, 0);
    if (!latestRes.success) {
      console.warn("failed to get posts with status " + latestRes.status);
    }
    const latest = latestRes.data;

    // Fetch most recent versions of all of the favourite posts
    let favouriteIds = await getFavouriteIds();
    const favouritesRes = await api.getMultiplePosts(getPids(favouriteIds));
    if (!favouritesRes.success) {
      console.warn(
        "failed to get favourite posts with status " + favouritesRes.status
      );
    }
    let favourites = favouritesRes.data;

    // Remove records for favourite posts that no longer exist
    const existingFavouriteIds = favourites.map((p) => p.id);
    favouriteIds = favouriteIds.filter((f) =>
      existingFavouriteIds.includes(f.postId)
    );
    await saveFavouriteIds(favouriteIds);

    /* Set the updated flag on all favourites that have been updated
       since viewing */
    const map = buildPostIdToRevIdMap(favouriteIds);
    favourites = favourites.map((f) => {
      return {
        ...f,
        updated: map[f.id.toString()] < f.revision_id,
      };
    });

    dispatch(refreshPostsSuccess(latest, favourites));
  };
}

function deletePostBegin(id) {
  return { type: DELETE_POST_BEGIN, id };
}

function deletePostFailure(id) {
  return { type: DELETE_POST_FAILURE, id };
}

export function deletePost(id, deleteAll) {
  return async function (dispatch) {
    dispatch(deletePostBegin(id));

    if (deleteAll) {
      res = await api.deletePost(id);
    } else {
      res = await api.deleteRevision(id);
    }
    if (!res.success) {
      console.warn(`failed to delete post ${id} with status ${res.status}`);
      dispatch(deletePostFailure(id));
      return;
    }

    dispatch(refreshPosts());

    dispatch(
      showSnackbar("Deleted!", 2000, {
        label: "hide",
        onPress: () => dispatch(hideSnackbar()),
      })
    );
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REFRESH_POSTS_BEGIN:
      return state;

    case REFRESH_POSTS_SUCCESS:
      return {
        ...state,
        latest: action.latest,
        favourites: action.favourites,
      };

    default:
      return state;
  }
}
