import NetInfo from "@react-native-community/netinfo";

import { refreshPosts } from "./posts";

const UPDATE_CONNECTION_INFO = "UPDATE_CONNECTION_INFO";

const initialState = {
  isInternetReachable: false,
  isExpensive: false,
};

function onConnectionChange(dispatch, getState, connectionState) {
  if (getState().settings.initialized) {
    // Actions that require initialized settings go here

    dispatch(refreshPosts());
  }
}

function updateConnectionInfo(state) {
  return { type: UPDATE_CONNECTION_INFO, state };
}

export function initConnectionInfo() {
  return function (dispatch, getState) {
    NetInfo.addEventListener((state) => {
      dispatch(updateConnectionInfo(state));
      onConnectionChange(dispatch, getState, state);
    });
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CONNECTION_INFO:
      const isInternetReachable =
        action.state.isConnected && action.state.isInternetReachable;
      const isExpensive =
        action.state.details && action.state.details.isConnectionExpensive;
      return {
        isInternetReachable: isInternetReachable,
        isExpensive: isExpensive,
      };

    default:
      return state;
  }
}
