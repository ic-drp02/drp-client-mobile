import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, ScrollView, RefreshControl, StyleSheet } from "react-native";
import { Text, Title } from "react-native-paper";

import PostsList from "../../../components/PostsList";

export default function Favourites() {
  const dispatch = useDispatch();
  const favourites = useSelector((s) => s.posts.favourites);

  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    if (favourites) {
      setRefreshing(false);
    }
  }, [favourites]);

  if (favourites && favourites.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ textAlign: "center" }}>No favourite posts</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            dispatch(refreshPosts());
          }}
        />
      }
    >
      {favourites && favourites.length > 0 && (
        <View>
          <Title>Favourites</Title>
          <PostsList posts={favourites} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
});
