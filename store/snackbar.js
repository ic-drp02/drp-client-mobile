const initialState = {
  visible: false,
  message: null,
  duration: 0,
  action: null,
};

export function showSnackbar(message, duration, action) {
  return { type: "SHOW_SNACKBAR", message, duration, action };
}

export function hideSnackbar() {
  return { type: "HIDE_SNACKBAR" };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "SHOW_SNACKBAR":
      return {
        visible: true,
        message: action.message,
        duration: action.duration,
        action: action.action,
      };

    case "HIDE_SNACKBAR":
      return { ...state.snackbar, visible: false };

    default:
      return state;
  }
}
