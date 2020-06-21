import api from "../util/api";

import * as SecureStore from "expo-secure-store";

const LOGIN_BEGIN = "LOGIN_BEGIN";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_ERROR = "LOGIN_ERROR";
const REGISTER_BEGIN = "REGISTER_BEGIN";
const REGISTER_SUCCESS = "REGISTER_SUCCESS";
const REGISTER_ERROR = "REGISTER_ERROR";
const LOGOUT = "LOGOUT";

export function login(email, password) {
  return async function (dispatch) {
    dispatch({ type: LOGIN_BEGIN });

    let res;
    try {
      res = await fetch(api.baseUrl + "/auth/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
    } catch {
      dispatch({
        type: LOGIN_ERROR,
        error: {
          type: "Unknown",
          message: "An error occurred while communicating with the server.",
        },
      });
    }

    const body = await res.json();

    if (res.status !== 200) {
      if (!!body.type) {
        dispatch({ type: LOGIN_ERROR, error: body });
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
      dispatch({
        type: LOGIN_SUCCESS,
        user: body,
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
      return { ...state, user: action.user, loading: false };

    case LOGIN_ERROR:
      return { ...state, error: action.error, loading: false };

    case REGISTER_BEGIN:
      return { ...state, registering: true, registered: false, error: null };

    case REGISTER_SUCCESS:
      return { ...state, registering: false, registered: true };

    case REGISTER_ERROR:
      return { ...state, error: action.error, registering: false };

    case LOGOUT:
      return { ...state, user: null };

    default:
      return state;
  }
}
