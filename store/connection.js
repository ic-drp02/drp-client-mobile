import NetInfo from "@react-native-community/netinfo";

const UPDATE_CONNECTION_INFO = "UPDATE_CONNECTION_INFO";

const initialState = {
  isInternetReachable: false,
  isExpensive: false,
};

function updateConnectionInfo(state) {
  return { type: UPDATE_CONNECTION_INFO, state };
}

export function initConnectionInfo() {
  return function (dispatch) {
    NetInfo.addEventListener((state) => {
      dispatch(updateConnectionInfo(state));
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
