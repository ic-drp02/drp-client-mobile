import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Snackbar } from "react-native-paper";

import { hideSnackbar } from "../store";

export default function AppSnackbar() {
  const snackbar = useSelector((s) => s.snackbar);
  const dispatch = useDispatch();
  return (
    <Snackbar
      visible={snackbar.visible}
      duration={snackbar.duration}
      onDismiss={() => dispatch(hideSnackbar())}
      action={snackbar.action}
    >
      {snackbar.message}
    </Snackbar>
  );
}
