import React, { useState } from "react";
import { TextInput as NativeTextInput, View } from "react-native";
import { TextInput, Text, ToggleButton } from "react-native-paper";

import { NodeType, parse as parseRichText } from "../rich-text";

function Delimiter({ value }) {
  return <Text style={{ color: "lightgrey" }}>{value}</Text>;
}

function DelimitedNode({ node, delimiter, style }) {
  return (
    <Text>
      <Delimiter value={delimiter} />
      {node.children.map((node, i) => renderNode(node, i, style))}
      <Delimiter value={delimiter} />
    </Text>
  );
}

function renderNode(node, key, parentStyle) {
  switch (node.type) {
    case NodeType.Plain:
      return (
        <Text key={key} style={parentStyle}>
          {node.value}
        </Text>
      );

    case NodeType.Bold:
      return (
        <DelimitedNode
          key={key}
          node={node}
          delimiter="*"
          style={{ ...parentStyle, fontWeight: "bold" }}
        />
      );

    case NodeType.Italic:
      return (
        <DelimitedNode
          key={key}
          node={node}
          delimiter="_"
          style={{ ...parentStyle, fontStyle: "italic" }}
        />
      );

    case NodeType.Underline:
      return (
        <DelimitedNode
          key={key}
          node={node}
          delimiter="+"
          style={{
            ...parentStyle,
            textDecorationLine:
              parentStyle.textDecorationLine === "line-through" ||
              parentStyle.textDecorationLine === "underline line-through"
                ? "underline line-through"
                : "underline",
          }}
        />
      );

    case NodeType.Strikethrough:
      return (
        <DelimitedNode
          key={key}
          node={node}
          delimiter="~"
          style={{
            ...parentStyle,
            textDecorationLine:
              parentStyle.textDecorationLine === "underline" ||
              parentStyle.textDecorationLine === "underline line-through"
                ? "underline line-through"
                : "line-through",
          }}
        />
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
          const ast = parseRichText(value);
          return (
            <NativeTextInput {...props}>
              {ast.map((node, i) => renderNode(node, i, {}))}
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
