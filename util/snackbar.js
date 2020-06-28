import store, { showSnackbar, hideSnackbar } from "../store";

export function showInfoSnackbar(text, time) {
  store.dispatch(
    showSnackbar(text, time ? time : 5000, {
      label: "hide",
      onPress: () => store.dispatch(hideSnackbar()),
    })
  );
}
