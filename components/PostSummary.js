import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { Text, useTheme } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { timeElapsedSince } from "../util/date.js";
import { COLOR_TEXT_SECONDARY, COLOR_ICON_BACKGROUND } from "../util/colors.js";

export default function PostSummary(props) {
  const theme = useTheme();
  const navigation = useNavigation();

  const [ago, setAgo] = useState(timeElapsedSince(props.date));

  // Update the shown time every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAgo(timeElapsedSince(props.date));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  let icon;
  if (!props.files || props.files.length === 0) {
    icon = <Icon name="bell-outline" size={35} />;
  } else {
    icon = <Icon name="file-outline" size={35} />;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        // TODO: Just for demo, remove later
        if (props.id !== undefined) {
          navigation.navigate("UpdateDetails", { postId: props.id });
        }
      }}
    >
      <View style={[styles.row, styles.margin]}>
        <View style={styles.iconView}>{icon}</View>
        <View style={[styles.column, styles.wrap]}>
          <Text style={[styles.lmargin, styles.postTitle]}>{props.title}</Text>
          <Text style={[styles.lmargin, styles.postInfo]}>
            {(!props.author ? "Anonymous user" : props.author) + ", " + ago}
          </Text>
          <Text style={[styles.lmargin, styles.postSummary]}>
            {props.summary}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  margin: {
    marginVertical: 10,
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
