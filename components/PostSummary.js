import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { Text, useTheme } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { timeElapsedSince } from "../util/date.js";
import { COLOR_TEXT_SECONDARY, COLOR_ICON_BACKGROUND } from "../util/colors.js";
import Attachments from "./Attachments.js";
import Label, { LABEL_TYPES } from "./Label";

export default function PostSummary({ post, showAttachments }) {
  const theme = useTheme();
  const navigation = useNavigation();
  const date = new Date(post.created_at);

  const [ago, setAgo] = useState(timeElapsedSince(date));

  // Update the shown time every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAgo(timeElapsedSince(date));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  let icon;
  if (post.is_guideline) {
    icon = <Icon name="information-outline" size={35} />;
  } else if (!post.files || post.files.length === 0) {
    icon = <Icon name="bell-outline" size={35} />;
  } else {
    icon = <Icon name="file-outline" size={35} />;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push("UpdateDetails", { postId: post.id });
      }}
    >
      <View style={[styles.row, styles.margin]}>
        <View style={styles.iconView}>{icon}</View>
        <View style={[styles.column, styles.wrap]}>
          <View style={styles.view}>
            <Text style={[styles.lmargin, styles.postTitle]}>{post.title}</Text>
            {post.updated === true && (
              <Label
                style={{ marginLeft: 10 }}
                labelType={LABEL_TYPES.UPDATED}
              />
            )}
          </View>
          <Text style={[styles.lmargin, styles.postInfo]}>
            {(!post.author ? "ICON Admin" : post.author) + ", " + ago}
          </Text>
          {post.summary != "" && (
            <Text style={[styles.lmargin, styles.postSummary]}>
              {post.summary}
            </Text>
          )}
          <View style={styles.lmargin}>
            {showAttachments && <Attachments files={post.files} />}
          </View>
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
  view: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
});
