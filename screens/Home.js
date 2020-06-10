import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Appbar, Button, Title, useTheme } from "react-native-paper";
import { TabView, TabBar } from "react-native-tab-view";
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
  const theme = useTheme();
  const [index, setIndex] = useState(0);

  return (
    <>
      <Appbar.Header style={{ elevation: 0 }}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="ICON" />
        <Appbar.Action
          icon="magnify"
          onPress={() => navigation.navigate("Search")}
        />
      </Appbar.Header>
      <TabView
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{ backgroundColor: theme.colors.primary }}
          />
        )}
        navigationState={{
          index,
          routes: [
            { key: "home", title: "Home" },
            { key: "pinned", title: "Pinned" },
          ],
        }}
        renderScene={({ route }) => {
          switch (route.key) {
            case "home":
              return <Main />;

            case "pinned":
              return <Pinned />;
          }
        }}
        initialLayout={{ width: Dimensions.get("window").width }}
        onIndexChange={setIndex}
      />
    </>
  );
}

function Main() {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(true);
  const auth = useSelector((s) => s.auth);
  const recents = useSelector(selectRecentPosts);

  const posts = useSelector((s) => s.posts);

  useEffect(() => {
    dispatch(refreshPosts());
    dispatch(fetchRecentPosts());
  }, []);

  useEffect(() => {
    if (posts) {
      setRefreshing(false);
    }
  }, [posts]);

  return (
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
          style={
            auth.user.role === "admin" ? styles.button : styles.singleButton
          }
          mode="contained"
          onPress={() => navigation.navigate("Question")}
        >
          Ask a question
        </Button>
        {auth.user.role === "admin" && (
          <Button
            style={styles.button}
            mode="contained"
            onPress={() => navigation.navigate("PostUpdate")}
          >
            Post an update
          </Button>
        )}
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
  );
}

function Pinned() {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(true);

  const auth = useSelector((s) => s.auth);
  const posts = useSelector((s) => s.posts);

  useEffect(() => {
    dispatch(refreshPosts());
    dispatch(fetchRecentPosts());
  }, []);

  useEffect(() => {
    if (posts) {
      setRefreshing(false);
    }
  }, [posts]);

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
      {posts && (
        <View>
          <Title>Pinned updates</Title>
          <PostsList posts={posts} />
        </View>
      )}
    </ScrollView>
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
  singleButton: {
    width: "100%",
    justifyContent: "center",
    marginVertical: 8,
  },
});
