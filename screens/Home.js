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

import { refreshPosts } from "../store";
import { useNavigation } from "@react-navigation/native";
import api from "../util/api";

function buildPidToRidMap(ids) {
  const postIdToRevId = {};
  ids.forEach(
    ({ postId, revisionId }) => (postIdToRevId[postId.toString()] = revisionId)
  );
  return postIdToRevId;
}

function getPids(ids) {
  return ids.map((p) => p.postId);
}

export default function Home({ navigation }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [pinnedIds, setPinnedIds] = useState(null);
  const [updatedPinned, setUpdatedPinned] = useState(0);
  const [updatedRecents] = useState(0);

  useEffect(() => navigation.addListener("focus", refreshPinned), [navigation]);

  async function refreshPinned() {
    await dispatch(refreshPosts());
    const json = await AsyncStorage.getItem("PINNED_POSTS");
    setPinnedIds(!!json ? JSON.parse(json) : []);
  }

  function TabLabel({ route, color }) {
    let text = route.title.toUpperCase();
    if (route.title === "Pinned" && updatedPinned > 0) {
      text += ` (${updatedPinned})`;
    } else if (route.title === "Recents" && updatedRecents > 0) {
      text += ` (${updatedRecents})`;
    }
    return <Text style={{ color }}>{text}</Text>;
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
            renderLabel={({ route, focused, color }) => (
              <Text style={{ color }}>
                <TabLabel route={route} focused={focused} color={color} />
              </Text>
            )}
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
              return (
                <Pinned
                  pinnedIds={pinnedIds}
                  onUpdatedChange={(updated) => setUpdatedPinned(updated)}
                  onRefresh={refreshPinned}
                />
              );
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

function Pinned({ pinnedIds, onRefresh, onUpdatedChange }) {
  const [refreshing, setRefreshing] = useState(true);
  const [pinned, setPinned] = useState(null);

  useEffect(() => {
    (async () => {
      if (pinnedIds && pinnedIds.length > 0) {
        const res = await api.getMultiplePosts(getPids(pinnedIds));
        if (!res.success) {
          console.warn(
            "failed to fetch pinned posts with status " + res.status
          );
        }
        const fetchedPinned = res.data;
        /* Build a map mapping post IDs to IDs of revision that was last viewed
           by the user */
        const postIdToRevId = buildPidToRidMap(pinnedIds);
        /* Set old flag to true on all posts that have a revision that is
           newer than the last viewed revision */
        const ps = fetchedPinned.map((p) => {
          return {
            ...p,
            old: postIdToRevId[p.id.toString()] < p.revision_id,
          };
        });
        console.log(ps);
        setPinned(ps);
        // Propagate the number of updated pinned posts to the parent
        if (onUpdatedChange !== undefined) {
          onUpdatedChange(ps.filter((p) => p.old).length);
        }
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
          <PostsList posts={pinned} markOld={true} />
        </View>
      )}
    </ScrollView>
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
