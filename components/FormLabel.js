import React from "react";
import { StyleSheet, View } from "react-native";

import { Text } from "native-base";

import { COLOR_TEXT_SECONDARY } from "../util/colors.js";

export default function FormLabel(props) {
  return (
    <Text
      style={{
        color: COLOR_TEXT_SECONDARY,
        margin: 7,
      }}
    >
      {props.text}
    </Text>
  );
}
