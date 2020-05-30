import React from "react";

export default React.createContext({
  visible: false,
  message: null,
  duration: 0,
  action: {
    label: null,
    onPress(hide) {},
  },
  show(message, duration, action) {},
});
