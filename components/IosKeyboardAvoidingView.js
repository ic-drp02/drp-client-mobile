import React from "react";

import { KeyboardAvoidingView, Platform } from "react-native";

export default function IosKeyboardAvoidingView(props) {
  if (Platform.OS === "ios") {
    return (
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={40}>
        {props.children}
      </KeyboardAvoidingView>
    );
  }
  return <>{props.children}</>;
}
