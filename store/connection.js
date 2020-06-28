import NetInfo from "@react-native-community/netinfo";
import * as SecureStore from "expo-secure-store";

import { refreshPosts } from "./posts";
import { softLogout } from "./auth";

const UPDATE_CONNECTION_INFO = "UPDATE_CONNECTION_INFO";

const initialState = {
  isInternetReachable: null,
  isExpensive: null,
};

function onConnectionChange(dispatch, getState, connectionState) {
  if (getState().settings.initialized) {
    // Actions that require initialized settings go here

    dispatch(refreshPosts());
  }

  if (
    connectionState.isConnected &&
    connectionState.isInternetReachable &&
    getState().auth.offline
  ) {
    // Re-login if the device was offline
    dispatch(softLogout);

    (async () => {
      const email = await SecureStore.getItemAsync("CREDENTIALS_EMAIL");
      const password = await SecureStore.getItemAsync("CREDENTIALS_PASSWORD");

      if (email && password) {
        await dispatch(login(email, password));
      }
    })();
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
