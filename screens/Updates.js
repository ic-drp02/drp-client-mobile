import React from "react";
import { View, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { Appbar, ProgressBar } from "react-native-paper";

import PostsList from "../components/PostsList";

export default function Updates({ navigation }) {
  const posts = useSelector((s) => s.posts);
  const fullHeight = { flex: 1 };
  return (
    <View style={fullHeight}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="All Updates" />
      </Appbar.Header>
      <View style={fullHeight}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {posts ? <PostsList posts={posts} /> : <ProgressBar indeterminate />}
        </ScrollView>
      </View>
    </View>
  );
}
