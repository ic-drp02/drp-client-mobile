import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Appbar, ProgressBar } from "react-native-paper";

import PostsList from "../components/PostsList";
import { refreshPosts } from "../store";

export default function Updates({ navigation }) {
  const posts = useSelector((s) => s.posts);
  const guidelines = posts.filter((p) => p.is_guideline);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const fullHeight = { flex: 1 };

  const refresh = async () => {
    setRefreshing(true);
    await dispatch(refreshPosts());
    setRefreshing(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <View style={fullHeight}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="All Guidelines" />
      </Appbar.Header>
      <View style={fullHeight}>
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
        >
          <PostsList posts={guidelines || []} />
        </ScrollView>
      </View>
    </View>
  );
}
