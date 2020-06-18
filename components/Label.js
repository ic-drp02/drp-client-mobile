import React from "react";
import { Text } from "react-native-paper";

import { View } from "react-native";

export const LABEL_TYPES = Object.freeze({
  OLD: { text: "Old", color: "red", textColor: "white" },
  CURRENT: { text: "Current", color: "green", textColor: "white" },
  UPDATED: { text: "Updated", color: "#2f80ed", textColor: "white" },
  RESOLVED: { text: "Resolved", color: "green", textColor: "white" },
});

export default function Label({ style, labelType }) {
  return (
    <View
      style={{
        ...style,
        backgroundColor: labelType.color,
        paddingHorizontal: 5,
        borderRadius: 5,
      }}
    >
      <Text style={{ color: labelType.textColor }}>{labelType.text}</Text>
    </View>
  );
}
