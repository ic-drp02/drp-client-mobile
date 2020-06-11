import React, { useState, useEffect } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Appbar, Text } from "react-native-paper";

import PostsList from "../components/PostsList";
import { refreshPosts } from "../store";

export default function GuidelinesCategory({ navigation, route }) {
  const tag = route.params.tag;

  const posts = useSelector((s) => s.posts);
  const guidelines = posts.filter(
    (p) => p.is_guideline && p.tags.map((t) => t.id).includes(tag.id)
  );
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
        <Appbar.Content title={`${tag.name}`} />
        <Appbar.Action
          icon="magnify"
          onPress={() =>
            navigation.navigate("Search", { guidelinesOnly: true, tag: tag })
          }
        />
      </Appbar.Header>
      {guidelines && (
        <View style={fullHeight}>
          <ScrollView
            contentContainerStyle={{ padding: 16 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            }
          >
            <PostsList posts={guidelines || []} showAttachments={true} />
          </ScrollView>
        </View>
      )}
    </View>
  );
}
