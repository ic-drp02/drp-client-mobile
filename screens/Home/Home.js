import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, RefreshControl } from "react-native";
import { Appbar, Button, Title, ProgressBar } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";

import PostSummary from "../../components/PostSummary";

import { refreshPosts } from "../../store";

export default function Home({ navigation }) {
  const posts = useSelector((s) => s.posts);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(refreshPosts());
  }, []);

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
              dispatch(refreshPosts()).then(() => setRefreshing(false));
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
        <View>
          <Title>Recently viewed</Title>
          <PostSummary
            title="Pre op assessment"
            summary="New guidelines on pre op assessment for elective surgery during COVID"
            author="Alice Smith"
            date={Date.parse("28 Mar 2020 12:47:00 UTC")}
          />
          <PostSummary
            title="Minutes from ICON Q&A"
            summary="The official minutes from yesteray's ICON Q&A"
            author="John Doe"
            date={Date.parse("29 Apr 2020 15:12:00 UTC")}
          />
        </View>
        <View>
          <View style={styles.headingWithButton}>
            <Title>Latest updates</Title>
            <Button
              compact
              mode="text"
              onPress={() => navigation.navigate("Updates")}
            >
              View all
            </Button>
          </View>
          {posts ? (
            <LatestPosts posts={posts} />
          ) : (
            <ProgressBar indeterminate />
          )}
        </View>
        <View>
          <View style={styles.headingWithButton}>
            <Title>Most Popular</Title>
            <Button
              compact
              mode="text"
              onPress={() => navigation.navigate("Updates")}
            >
              More
            </Button>
          </View>
          {posts ? (
            <LatestPosts posts={posts} />
          ) : (
            <ProgressBar indeterminate />
          )}
        </View>
      </ScrollView>
    </>
  );
}

function LatestPosts({ posts }) {
  return posts
    .slice(0, Math.min(posts.length, 3))
    .map((post) => (
      <PostSummary
        key={post.id}
        id={post.id}
        title={post.title}
        summary={post.summary}
        files={post.files}
        date={new Date(post.created_at)}
      />
    ));
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
