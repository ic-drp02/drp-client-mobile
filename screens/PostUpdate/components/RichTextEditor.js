import React from "react";
import { TextInput as NativeTextInput } from "react-native";
import { TextInput, Text } from "react-native-paper";

import * as richtext from "./rich-text";

function renderToken(token, key) {
  switch (token.type) {
    case "text":
      return <Text key={key}>{token.value}</Text>;

    case "em":
      return (
        <Text key={key}>
          <Text style={{ color: "lightgrey" }}>_</Text>
          <Text key={key} style={{ fontStyle: "italic" }}>
            {token.value.slice(1, token.value.length - 1)}
          </Text>
          <Text style={{ color: "lightgrey" }}>_</Text>
        </Text>
      );

    case "strong":
      return (
        <Text key={key}>
          <Text style={{ color: "lightgrey" }}>*</Text>
          <Text key={key} style={{ fontWeight: "bold" }}>
            {token.value.slice(1, token.value.length - 1)}
          </Text>
          <Text style={{ color: "lightgrey" }}>*</Text>
        </Text>
      );
  }
}

export default function RichTextEditor({ label, value, onChange }) {
  return (
    <TextInput
      label={label}
      mode="outlined"
      multiline={true}
      numberOfLines={7}
      value={value}
      onChangeText={onChange}
      style={{ margin: 8 }}
      render={({ value, ...props }) => {
        const tokens = richtext.parse(value);
        return (
          <NativeTextInput {...props}>
            {tokens.map(renderToken)}
          </NativeTextInput>
        );
      }}
    />
  );
}
