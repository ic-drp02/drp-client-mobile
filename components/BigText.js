import React from "react";

import { Text } from "react-native-paper";

export default function BigText(props) {
  return (
    <Text
      style={{
        fontSize: 40,
        fontWeight: "bold",
        margin: 20,
      }}
    >
      {props.text}
    </Text>
  );
}
