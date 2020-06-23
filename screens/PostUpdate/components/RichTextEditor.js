import React, { useState } from "react";
import { TextInput as NativeTextInput, View } from "react-native";
import { TextInput, Text, ToggleButton, useTheme } from "react-native-paper";

import { NodeType, parse as parseRichText, DELIMITERS } from "../rich-text";

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

function shouldPrependSpace(str, selection) {
  return (
    selection.start > 0 &&
    /\S/.test(str[selection.start - 1]) &&
    !DELIMITERS.has(str[selection.start - 1])
  );
}

function shouldAppendSpace(str, selection) {
  return (
    selection.end < str.length &&
    /\S/.test(str[selection.end]) &&
    !DELIMITERS.has(str[selection.end])
  );
}

function wrapSelection(str, selection, delimiter) {
  const left = str.slice(0, selection.start);
  const selected = str.slice(selection.start, selection.end);
  const right = str.slice(selection.end, str.length);

  let wrapped = delimiter + selected + delimiter;

  if (shouldPrependSpace(str, selection)) {
    wrapped = " " + wrapped;
  }

  if (shouldAppendSpace(str, selection)) {
    wrapped = wrapped + " ";
  }

  return left + wrapped + right;
}

export default function RichTextEditor({ label, value, onChange }) {
  const theme = useTheme();
  const [showWarning, setShowWarning] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  function format(delimiter) {
    if (selection.end > selection.start) {
      onChange(wrapSelection(value, selection, delimiter));
    } else {
      setShowWarning(true);
    }
  }

  return (
    <View style={{ margin: 8 }}>
      <TextInput
        label={label}
        mode="outlined"
        multiline={true}
        numberOfLines={7}
        value={value}
        onChangeText={(v) => {
          setShowWarning(false);
          onChange(v);
        }}
        onSelectionChange={(e) => {
          setShowWarning(false);
          setSelection(e.nativeEvent.selection);
        }}
        render={({ value, ...props }) => {
          const ast = parseRichText(value);
          return (
            <NativeTextInput {...props}>
              {ast.map((node, i) => renderNode(node, i, {}))}
            </NativeTextInput>
          );
        }}
      />
      {showWarning && (
        <Text style={{ marginTop: 8, color: "orange" }}>
          You must select some text first.
        </Text>
      )}
        <ToggleButton icon="format-bold" onPress={() => format("*")} />
        <ToggleButton icon="format-italic" onPress={() => format("_")} />
        <ToggleButton icon="format-underline" onPress={() => format("+")} />
        <ToggleButton icon="format-strikethrough" onPress={() => format("~")} />
      </View>
    </View>
  );
}
