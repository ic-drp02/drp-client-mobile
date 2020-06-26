import store, { showSnackbar } from "../store";

export function showInfoSnackbar(text, time) {
  store.dispatch(
    showSnackbar(text, time ? time : 5000, {
      label: "hide",
      onPress: () => dispatch(hideSnackbar()),
    })
  );
}
