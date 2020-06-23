import React, { useState } from "react";
import { TextInput as NativeTextInput, View } from "react-native";
import { TextInput, Text, ToggleButton } from "react-native-paper";

import * as richtext from "../rich-text";

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

    case "u":
      return (
        <Text key={key}>
          <Text style={{ color: "lightgrey" }}>+</Text>
          <Text key={key} style={{ textDecorationLine: "underline" }}>
            {token.value.slice(1, token.value.length - 1)}
          </Text>
          <Text style={{ color: "lightgrey" }}>+</Text>
        </Text>
      );

    case "s":
      return (
        <Text key={key}>
          <Text style={{ color: "lightgrey" }}>~</Text>
          <Text key={key} style={{ textDecorationLine: "line-through" }}>
            {token.value.slice(1, token.value.length - 1)}
          </Text>
          <Text style={{ color: "lightgrey" }}>~</Text>
        </Text>
      );
  }
}

function wrapSelection(str, selection, value) {
  return (
    str.slice(0, selection.start) +
    (selection.start > 0 && /\S/.test(str[selection.start]) ? " " : "") +
    value +
    str.slice(selection.start, selection.end) +
    value +
    (selection.end < str.length && /\S/.test(str[selection.end]) ? " " : "") +
    str.slice(selection.end, str.length)
  );
}

export default function RichTextEditor({ label, value, onChange }) {
  const [selection, setSelection] = useState(null);
  return (
    <View style={{ margin: 8 }}>
      <TextInput
        label={label}
        mode="outlined"
        multiline={true}
        numberOfLines={7}
        value={value}
        onChangeText={onChange}
        onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
        render={({ value, ...props }) => {
          const tokens = richtext.parse(value);
          return (
            <NativeTextInput {...props}>
              {tokens.map(renderToken)}
            </NativeTextInput>
          );
        }}
      />
      <View style={{ flexDirection: "row" }}>
        <ToggleButton
          icon="format-bold"
          onPress={() => {
            if (selection.end > selection.start) {
              onChange(wrapSelection(value, selection, "*"));
            }
          }}
        />
        <ToggleButton
          icon="format-italic"
          onPress={() => {
            if (selection.end > selection.start) {
              onChange(wrapSelection(value, selection, "_"));
            }
          }}
        />
        <ToggleButton
          icon="format-underline"
          onPress={() => {
            if (selection.end > selection.start) {
              onChange(wrapSelection(value, selection, "+"));
            }
          }}
        />
        <ToggleButton
          icon="format-strikethrough"
          onPress={() => {
            if (selection.end > selection.start) {
              onChange(wrapSelection(value, selection, "~"));
            }
          }}
        />
      </View>
    </View>
  );
}
