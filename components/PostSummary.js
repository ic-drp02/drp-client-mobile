import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import timeElapsedSince from "../util/date.js";

import { COLOR_TEXT_SECONDARY, COLOR_ICON_BACKGROUND } from "../util/colors.js";

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
  const [ago, setAgo] = useState(timeElapsedSince(props.date));

  // Update the shown time every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAgo(timeElapsedSince(props.date));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.row, styles.margin]}>
      <View style={styles.iconView}></View>
      <View style={[styles.column, styles.wrap]}>
        <Text style={[styles.lmargin, styles.postTitle]}>{props.title}</Text>
        <Text style={[styles.lmargin, styles.postInfo]}>
          {((props.author === undefined) ? 'Anonymous user' : props.author) + ", " + timeElapsedSince(props.date)}
        </Text>
        <Text style={[styles.lmargin, styles.postSummary]}>
          {props.summary}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  iconView: {
    backgroundColor: COLOR_ICON_BACKGROUND,
    borderRadius: 10,
    width: 70,
    height: 70,
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
  postInfo: {
    color: COLOR_TEXT_SECONDARY,
    fontSize: 11,
  },
  postSummary: {
    fontSize: 14,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
