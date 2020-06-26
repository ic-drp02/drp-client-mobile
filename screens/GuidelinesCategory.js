import React, { useState, useEffect } from "react";
import { View, RefreshControl, FlatList, Text } from "react-native";
import { Appbar } from "react-native-paper";

import PostSummary from "../components/PostSummary";

import api from "../util/api";
import { showInfoSnackbar } from "../util/snackbar";

const POSTS_PER_PAGE = 10;

export default function GuidelinesCategory({ navigation, route }) {
  const tag = route.params.tag;

  const [guidelines, setGuidelines] = useState([]);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fullHeight = { flex: 1 };

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setRefreshing(true);
    const res = await api.getGuidelines(tag.name, undefined, POSTS_PER_PAGE, 0);
    if (!res.success) {
      showInfoSnackbar(
        `Could not load guidelines with error code ${res.status}!`
      );
      return;
    }
    setPage(1);
    setGuidelines(res.data);
    setRefreshing(false);
  }

  async function loadMore() {
    if (refreshing || guidelines.length < page * POSTS_PER_PAGE) {
      // Already loading or nothing to load
      return;
    }
    setRefreshing(true);
    const res = await api.getGuidelines(
      tag.name,
      undefined,
      POSTS_PER_PAGE,
      page
    );
    if (!res.success) {
      showInfoSnackbar(
        `Could not load guidelines with error code ${res.status}!`
      );
      return;
    }
    setGuidelines([...guidelines, ...res.data]);
    setPage(page + 1);
    setRefreshing(false);
  }

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
      {refreshing || guidelines.length > 0 ? (
        <View style={fullHeight}>
          <FlatList
            data={guidelines || []}
            renderItem={({ item }) => (
              <PostSummary post={item} showAttachments={true} />
            )}
            keyExtractor={(g) => g.id.toString()}
            contentContainerStyle={{ padding: 16 }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            }
          />
        </View>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ textAlign: "center" }}>
            There are no guidelines in this category.
          </Text>
        </View>
      )}
    </View>
  );
}
