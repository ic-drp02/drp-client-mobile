import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  AsyncStorage,
} from "react-native";
import { Appbar, Button, Title, ProgressBar } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";

import PostsList from "../../components/PostsList";

import { refreshPosts, fetchRecentPosts } from "../../store";

async function shouldShowWelcome() {
  const value = await AsyncStorage.getItem("SHOW_WELCOME");
  return value === null || value !== "0";
}

async function setWelcomeShown() {
  await AsyncStorage.setItem("SHOW_WELCOME", "0");
}

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
          <LatestUpdates
            posts={posts}
            onViewAll={() => navigation.navigate("Updates")}
          />
        )}
        {posts && (
          <MostPopular
            posts={posts}
            onMore={() => navigation.navigate("Updates")}
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

function LatestUpdates({ posts, onViewAll, ...props }) {
  return (
    <View {...props}>
      <View style={styles.headingWithButton}>
        <Title>Latest updates</Title>
        <Button compact mode="text" onPress={onViewAll}>
          View all
        </Button>
      </View>
      {posts && <PostsList posts={posts} limit={3} />}
    </View>
  );
}

function MostPopular({ posts, onMore, ...props }) {
  return (
    <View {...props}>
      <View style={styles.headingWithButton}>
        <Title>Most Popular</Title>
        <Button compact mode="text" onPress={onMore}>
          More
        </Button>
      </View>
      {posts && <PostsList posts={posts} limit={3} />}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  headingWithButton: {
    flexDirection: "row",
    justifyContent: "space-between",
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
