import api from "../util/api";

import * as SecureStore from "expo-secure-store";

const LOGIN_BEGIN = "LOGIN_BEGIN";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_ABORT = "LOGIN_ABORT";
const LOGIN_ERROR = "LOGIN_ERROR";
const REGISTER_BEGIN = "REGISTER_BEGIN";
const REGISTER_SUCCESS = "REGISTER_SUCCESS";
const REGISTER_ERROR = "REGISTER_ERROR";
const SOFT_LOGOUT = "SOFT_LOGOUT";
const LOGOUT = "LOGOUT";

export function offlineLogin() {
  return async function (dispatch, getState) {
    const isInternetReachable = getState().connection.isInternetReachable;
    if (isInternetReachable) {
      console.warn("Offline login should only be used while offline!");
      return;
    }

    dispatch({ type: LOGIN_BEGIN });
    const savedRole = await SecureStore.getItemAsync("CREDENTIALS_ROLE");

    if (!savedRole) {
      // No previous login, nothing to load
      dispatch({ type: LOGIN_ABORT });
      return;
    }

    dispatch({
      type: LOGIN_SUCCESS,
      user: { role: savedRole },
      offline: true,
    });
  };
}

export function softLogout() {
  return { type: SOFT_LOGOUT };
}

export function login(email, password) {
  return async function (dispatch) {
    dispatch({ type: LOGIN_BEGIN });

    const res = await api.authenticate(email, password);

    if (!res.success) {
      if (!!res.error) {
        dispatch({ type: LOGIN_ERROR, error: res.error });
      } else {
        dispatch({
          type: LOGIN_ERROR,
          error: {
            type: "Unknown",
            message: "An error occurred while trying to log in.",
          },
        });
      }
    } else {
      await SecureStore.setItemAsync("CREDENTIALS_EMAIL", email);
      await SecureStore.setItemAsync("CREDENTIALS_PASSWORD", password);
      await SecureStore.setItemAsync("CREDENTIALS_ROLE", res.data.role);
      dispatch({
        type: LOGIN_SUCCESS,
        user: res.data,
        offline: false,
      });
    }
  };
}

export function register(email, password) {
  return async function (dispatch) {
    dispatch({ type: REGISTER_BEGIN });

    let res;
    try {
      res = await fetch(api.baseUrl + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });
    } catch {
      dispatch({
        type: REGISTER_ERROR,
        error: {
          type: "Unknown",
          message: "An eerror occurred while communicating with the server.",
        },
      });
    }

    if (res.status !== 200) {
      const body = await res.json();
      if (!!body.type) {
        dispatch({ type: REGISTER_ERROR, error: body });
      } else {
        console.warn("Registration error: " + body.message);
        dispatch({
          type: REGISTER_ERROR,
          error: {
            type: "Unknown",
            message: "An error occurred while creating your account.",
          },
        });
      }
    } else {
      dispatch({ type: REGISTER_SUCCESS });
    }
  };
}

export function logout() {
  return async function (dispatch) {
    dispatch({ type: LOGOUT });

    await SecureStore.deleteItemAsync("CREDENTIALS_EMAIL");
    await SecureStore.deleteItemAsync("CREDENTIALS_PASSWORD");
  };
}

const initialState = {
  user: null,
  error: null,
  offline: false,
  loading: false,
  registering: false,
  registered: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_BEGIN:
      return {
        ...state,
        user: null,
        error: null,
        registering: false,
        loading: true,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.user,
        offline: action.offline,
        loading: false,
      };

    case LOGIN_ABORT:
      return { ...state, loading: false };

    case LOGIN_ERROR:
      return { ...state, error: action.error, loading: false };

    case REGISTER_BEGIN:
      return { ...state, registering: true, registered: false, error: null };

    case REGISTER_SUCCESS:
      return { ...state, registering: false, registered: true };

    case REGISTER_ERROR:
      return { ...state, error: action.error, registering: false };

    case SOFT_LOGOUT:
      return {
        user: null,
        error: null,
        offline: false,
        loading: false,
        registering: false,
        registered: false,
      };

    case LOGOUT:
      return { ...state, user: null };

    default:
      return state;
  }
}
