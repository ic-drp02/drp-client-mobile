import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  AsyncStorage,
} from "react-native";
import { Appbar, Button, Title } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";

import PostsList from "../components/PostsList";
import PostsListWithButton from "../components/PostsListWithButton";

import { refreshPosts, fetchRecentPosts } from "../store";

function selectRecentPosts(s) {
  return s.posts
    ? s.recents.posts
        .map((id) => s.posts.find((p) => p.id === id))
        .filter((p) => !!p)
    : [];
}

export default function Home({ navigation }) {
  const posts = useSelector((s) => s.posts);
  const recents = useSelector(selectRecentPosts);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    // (async () => {
    //   if (await shouldShowWelcome()) {
    //     navigation.navigate("Welcome");
    //     await setWelcomeShown();
    //   }
    // })();
    dispatch(refreshPosts());
    dispatch(fetchRecentPosts());
  }, []);

  useEffect(() => {
    if (posts) {
      setRefreshing(false);
    }
  }, [posts]);

  return (
    <>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="ICON" />
        <Appbar.Action
          icon="magnify"
          onPress={() => navigation.navigate("Search")}
        />
      </Appbar.Header>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              Promise.all([
                dispatch(refreshPosts()),
                dispatch(fetchRecentPosts()),
              ]);
            }}
          />
        }
      >
        <View style={styles.buttons}>
          <Button
            style={styles.button}
            mode="contained"
            onPress={() => navigation.navigate("Question")}
          >
            Ask a question
          </Button>
          <Button
            style={styles.button}
            mode="contained"
            onPress={() => navigation.navigate("PostUpdate")}
          >
            Post an update
          </Button>
        </View>
        {recents.length > 0 && <RecentlyViewed recents={recents} />}
        {posts && (
          <PostsListWithButton
            title="Latest updates"
            buttonText="View all"
            onButtonPress={() => navigation.navigate("Updates")}
            posts={posts}
          />
        )}
        {posts && (
          <PostsListWithButton
            title="Most popular"
            buttonText="More"
            onButtonPress={() => navigation.navigate("Updates")}
            posts={posts}
          />
        )}
      </ScrollView>
    </>
  );
}

function RecentlyViewed({ recents, ...props }) {
  return (
    <View {...props}>
      <Title>Recently viewed</Title>
      {recents && <PostsList posts={recents} limit={3} />}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  button: {
    width: "48%",
    justifyContent: "center",
    marginVertical: 8,
  },
});
