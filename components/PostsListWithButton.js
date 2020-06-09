import React from "react";
import { StyleSheet } from "react-native";
import { ProgressBar } from "react-native-paper";

import PostsList from "./PostsList";
import SectionWithButton from "./SectionWithButton";

export default function PostsListWithButton({
  title,
  buttonText,
  onButtonPress,
  posts,
  loading,
  limit,
  ...props
}) {
  return (
    <SectionWithButton
      title={title}
      buttonText={buttonText}
      onButtonPress={onButtonPress}
      {...props}
    >
      {(loading ? loading : !posts) ? (
        <ProgressBar indeterminate />
      ) : (
        <PostsList posts={posts} limit={limit ? limit : 3} />
      )}
    </SectionWithButton>
  );
}

const styles = StyleSheet.create({
  headingWithButton: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
