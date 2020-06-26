import React, { useState, useEffect } from "react";
import { View, RefreshControl, FlatList } from "react-native";
import { Appbar } from "react-native-paper";

import PostSummary from "../components/PostSummary";
import api from "../util/api";

const POSTS_PER_PAGE = 10;

export default function Updates({ navigation }) {
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState();

  const fullHeight = { flex: 1 };

  async function loadMore() {
    if (refreshing || posts.length < page * POSTS_PER_PAGE) {
      // Already loading or nothing to load
      return;
    }
    setRefreshing(true);
    const res = await api.getPosts(undefined, undefined, POSTS_PER_PAGE, page);
    setPosts([...posts, ...res.data]);
    setPage(page + 1);
    setRefreshing(false);
  }

  async function refresh() {
    setRefreshing(true);
    const res = await api.getPosts(undefined, undefined, POSTS_PER_PAGE, 0);
    setPage(1);
    setPosts(res.data);
    setRefreshing(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <View style={fullHeight}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="All Updates" />
      </Appbar.Header>
      <View style={fullHeight}>
        <FlatList
          data={posts || []}
          renderItem={({ item }) => <PostSummary post={item} />}
          keyExtractor={(post) => post.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.2}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
        />
      </View>
    </View>
  );
}
