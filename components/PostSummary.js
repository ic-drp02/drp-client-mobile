import React from "react";
import { StyleSheet, View } from "react-native";

import {
  Container,
  Header,
  Button,
  Icon,
  Left,
  Item,
  Input,
  H3,
  Text,
} from "native-base";

export default function PostSummary(props) {
  return (
    <View style={[styles.row, styles.margin]}>
      <View style={styles.iconView}></View>
      <View style={[styles.column, styles.wrap]}>
        <H3 style={styles.lmargin}>{props.title}</H3>
        <Text style={styles.lmargin}>{props.summary}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconView: {
    backgroundColor: "#e8e8e8",
    borderRadius: 10,
    width: 65,
    height: 65,
  },
  margin: {
    margin: 10,
  },
  lmargin: {
    marginLeft: 10,
  },
  wrap: {
    flexShrink: 1,
  },
});
