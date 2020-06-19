import React, { useState, useEffect } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Appbar, List, Badge } from "react-native-paper";

import { refreshPosts } from "../store";

import api from "../util/api";

export default function Question({ navigation }) {
  const fullHeight = { flex: 1 };

  const [refreshing, setRefreshing] = useState(true);
  const posts = useSelector((s) => s.posts);
  const dispatch = useDispatch();
  const guidelines = posts.filter((p) => p.is_guideline);
  const [tags, setTags] = useState([]);

  async function refresh() {
    setRefreshing(true);

    await dispatch(refreshPosts());

    const tagResults = await api.getTags();

    if (!tagResults.success) {
      console.warn("Fetching tags failed with status " + tagResults.status);
      return;
    }

    const tags = tagResults.data;

    for (const tag of tags) {
      const count = guidelines.filter((g) =>
        g.tags.map((t) => t.id).includes(tag.id)
      ).length;
      tag.count = count;
    }

    //const relevantTags = tags.filter((t) => t.count > 0);
    tags.sort((t1, t2) => t1.name.localeCompare(t2.name));

    setTags(tags);
    setRefreshing(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <View style={fullHeight}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Guidelines" />
        <Appbar.Action
          icon="magnify"
          onPress={() =>
            navigation.navigate("Search", { guidelinesOnly: true })
          }
        />
      </Appbar.Header>
      <View style={fullHeight}>
        <ScrollView
          style={fullHeight}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
        >
          {tags &&
            tags.map((t) => (
              <List.Item
                key={t.id}
                title={t.name}
                right={(props) => (
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        justifyContent: "center",
                      }}
                    >
                      {<Badge {...props}>{t.count}</Badge>}
                    </View>
                    <List.Icon {...props} icon="chevron-right" />
                  </View>
                )}
                onPress={() =>
                  navigation.navigate("GuidelinesCategory", { tag: t })
                }
              />
            ))}
        </ScrollView>
      </View>
    </View>
  );
}
