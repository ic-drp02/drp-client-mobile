import React, { useState, useEffect } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { Appbar, List } from "react-native-paper";
import { useSelector } from "react-redux";

import { showInfoSnackbar } from "../util/snackbar";
import api from "../util/api";

export default function Question({ navigation }) {
  const fullHeight = { flex: 1 };

  const isInternetReachable = useSelector(
    (s) => s.connection.isInternetReachable
  );

  const [refreshing, setRefreshing] = useState(false);
  const [tags, setTags] = useState([]);

  async function refresh() {
    if (!isInternetReachable) {
      showInfoSnackbar("Cannot load guideline categories while offline!");
      navigation.goBack();
      return;
    }

    setRefreshing(true);

    let tagResults;
    try {
      tagResults = await api.getTags();
    } catch (error) {
      console.warn("Could not load tags:");
      console.warn(error);
    }

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
