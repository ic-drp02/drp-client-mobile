import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, RefreshControl, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";

import PostsListWithButton from "../../../components/PostsListWithButton";

import { showInfoSnackbar } from "../../../util/snackbar";

import { refreshPosts } from "../../../store";

export default function Main() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const auth = useSelector((s) => s.auth);
  const posts = useSelector((s) => s.posts.latest);
  const isInternetReachable = useSelector(
    (s) => s.connection.isInternetReachable
  );

  const [refreshing, setRefreshing] = useState(true);

  function refresh() {
    if (!isInternetReachable) {
      showInfoSnackbar("Cannot refresh posts while offline!");
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    dispatch(refreshPosts());
  }

  useEffect(() => {
    if (posts) {
      setRefreshing(false);
    }
  }, [posts]);

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
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
          title="Latest"
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
