import React from "react";
import { TextInput } from "react-native-paper";

export function NormalTextInput({ label, value, onChange }) {
  return (
    <TextInput
      label={label}
      mode="outlined"
      value={value}
      onChangeText={onChange}
      clearButtonMode="always"
      style={{ margin: 8 }}
    />
  );
}

export function LargeTextInput({ label, value, onChange }) {
  return (
    <TextInput
      label={label}
      mode="outlined"
      multiline={true}
      numberOfLines={7}
      value={value}
      onChangeText={onChange}
      style={{ margin: 8 }}
    />
  );
}
