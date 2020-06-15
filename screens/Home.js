import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Dimensions,
  AsyncStorage,
} from "react-native";
import { Appbar, Button, Title, Text, useTheme } from "react-native-paper";
import { TabView, TabBar } from "react-native-tab-view";
import { useSelector, useDispatch } from "react-redux";

import PostsList from "../components/PostsList";
import PostsListWithButton from "../components/PostsListWithButton";

import { fetchRecentPosts } from "../store";
import { useNavigation } from "@react-navigation/native";
import api from "../util/api";

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
  const [pinned, setPinned] = useState(null);

  useEffect(() => navigation.addListener("focus", refreshPinned), [navigation]);

  async function refreshPinned() {
    const json = await AsyncStorage.getItem("PINNED_POSTS");
    setPinned(!!json ? JSON.parse(json) : []);
  }

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
            indicatorStyle={{ backgroundColor: theme.colors.accent }}
            style={{ backgroundColor: theme.colors.primary }}
          />
        )}
        navigationState={{
          index,
          routes: [
            { key: "home", title: "Home" },
            { key: "recents", title: "Recents" },
            { key: "pinned", title: "Pinned" },
          ],
        }}
        renderScene={({ route }) => {
          switch (route.key) {
            case "home":
              return <Main />;

            case "recents":
              return <Recents />;

            case "pinned":
              return <Pinned pinnedIds={pinned} onRefresh={refreshPinned} />;
          }
        }}
        initialLayout={{ width: Dimensions.get("window").width }}
        onIndexChange={(i) => {
          setIndex(i);
          refreshPinned();
        }}
      />
    </>
  );
}

function Main() {
  const navigation = useNavigation();
  const auth = useSelector((s) => s.auth);

  const [refreshing, setRefreshing] = useState(true);
  const [posts, setPosts] = useState(null);

  async function refreshPosts() {
    setRefreshing(true);
    const res = await api.getPosts(undefined, undefined, 3, 0);
    setPosts(res.data);
    setRefreshing(false);
  }

  useEffect(() => {
    refreshPosts();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => refreshPosts()}
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

function Recents() {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(true);
  const recentIds = useSelector((s) => s.recents.posts);
  const [recents, setRecents] = useState(null);

  async function refreshRecents() {
    setRefreshing(true);
    const posts = await Promise.all(
      recentIds.map((id) => api.getPost(id).then((res) => res.data))
    );
    setRecents(posts.filter((p) => !!p));
    setRefreshing(false);
  }

  useEffect(() => {
    refreshRecents();
  }, [recentIds]);

  useEffect(() => {
    dispatch(fetchRecentPosts());
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => refreshRecents()}
        />
      }
    >
      {recents && recents.length > 0 && <RecentlyViewed recents={recents} />}
    </ScrollView>
  );
}

function Pinned({ pinnedIds, onRefresh }) {
  const [refreshing, setRefreshing] = useState(true);
  const [pinned, setPinned] = useState(null);

  useEffect(() => {
    (async () => {
      if (pinnedIds) {
        const posts = await Promise.all(
          pinnedIds.map((id) => api.getPost(id).then((res) => res.data))
        );
        setPinned(posts);
      } else {
        setPinned([]);
      }
      setRefreshing(false);
    })();
  }, [pinnedIds]);

  if (pinned && pinned.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ textAlign: "center" }}>No pinned posts</Text>
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
            onRefresh && onRefresh();
          }}
        />
      }
    >
      {pinned && pinned.length > 0 && (
        <View>
          <Title>Pinned updates</Title>
          <PostsList posts={pinned} />
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
