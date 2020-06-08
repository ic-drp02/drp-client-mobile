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
  ...props
}) {
  return (
    <SectionWithButton
      title={title}
      buttonText={buttonText}
      onButtonPress={onButtonPress}
      {...props}
    >
      {posts ? (
        <PostsList posts={posts} limit={3} />
      ) : (
        <ProgressBar indeterminate />
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
