import api from "../util/api";

export function login(email, password) {
  return async function (dispatch) {
    dispatch({ type: "LOGIN_BEGIN" });

    const res = await fetch(api.baseUrl + "/auth/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const body = await res.json();

    if (res.status !== 200) {
      if (!!body.type) {
        dispatch({ type: "LOGIN_ERROR", error: body });
      } else {
        dispatch({
          type: "LOGIN_ERROR",
          error: {
            type: "Unknown",
            message: "An error occurred while trying to log in.",
          },
        });
      }
    } else {
      dispatch({ type: "LOGIN_SUCCESS", token: body.token });
    }
  };
}

export function register(email, password) {
  return async function (dispatch) {
    dispatch({ type: "REGISTER_BEGIN" });

    const res = await fetch(api.baseUrl + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (res.status !== 200) {
      const body = await res.json();
      if (!!body.type) {
        dispatch({ type: "REGISTER_ERROR", error: body });
      } else {
        console.warn("Registration error: " + body.message);
        dispatch({
          type: "REGISTER_ERROR",
          error: {
            type: "Unknown",
            message: "An error occurred while creating your account.",
          },
        });
      }
    } else {
      dispatch({ type: "REGISTER_SUCCESS" });
    }
  };
}

const initialState = {
  token: null,
  error: null,
  loading: false,
  registering: false,
  registered: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN_BEGIN":
      return {
        ...state,
        token: null,
        error: null,
        registering: false,
        loading: true,
      };

    case "LOGIN_SUCCESS":
      return { ...state, token: action.token, loading: false };

    case "LOGIN_ERROR":
      return { ...state, error: action.error, loading: false };

    case "REGISTER_BEGIN":
      return { ...state, registering: true, registered: false, error: null };

    case "REGISTER_SUCCESS":
      return { ...state, registering: false, registered: true };

    case "REGISTER_ERROR":
      return { ...state, error: action.error, registering: false };

    default:
      return state;
  }
}
