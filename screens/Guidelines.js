import React, { useState, useEffect } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { Appbar, List } from "react-native-paper";

import api from "../util/api";

export default function Question({ navigation }) {
  const fullHeight = { flex: 1 };

  const [refreshing, setRefreshing] = useState(true);
  const [tags, setTags] = useState([]);

  async function refresh() {
    setRefreshing(true);

    const tagResults = await api.getTags();

    if (!tagResults.success) {
      console.warn("Fetching tags failed with status " + tagResults.status);
      return;
    }

    const tags = tagResults.data;

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
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
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
