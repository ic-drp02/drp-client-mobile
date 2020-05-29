import React from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Button, Text, Title } from "react-native-paper";

import PostSummary from "../../components/PostSummary.js";
import LatestUpdates from "../../components/LatestUpdates.js";

export default function Home({ navigation }) {
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
      <View style={styles.container}>
        <View style={[styles.content, styles.margin]}>
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
          <LatestUpdates limit={4} />
        </View>
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  headingWithButton: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    width: "45%",
    margin: 10,
    justifyContent: "center",
  },
  margin: {
    margin: 10,
  },
});
