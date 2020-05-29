import React from "react";
import { StyleSheet, View, StatusBar } from "react-native";

import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Text,
  H3,
} from "native-base";

import PostSummary from "../../components/PostSummary.js";
import LatestUpdates from "../../components/LatestUpdates.js";

export default function Home({ navigation }) {
  return (
    <Container>
      <Header>
        <StatusBar barStyle="light-content" />
        <Left>
          <Button transparent onPress={() => navigation.openDrawer()}>
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
          <Title>ICON</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => navigation.navigate("Search")}>
            <Icon style={styles.navicon} name="search" />
          </Button>
        </Right>
      </Header>
      <View style={styles.container}>
        <View style={[styles.content, styles.margin]}>
          <H3>Recently viewed</H3>
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
            <H3>Latest updates</H3>
            <Button transparent onPress={() => navigation.navigate("Updates")}>
              <Text>View all</Text>
            </Button>
          </View>
          <LatestUpdates limit={4} />
        </View>
        <View style={styles.buttons}>
          <Button
            style={styles.button}
            onPress={() => navigation.navigate("Question")}
          >
            <Text>Ask a question</Text>
          </Button>
          <Button
            style={styles.button}
            onPress={() => navigation.navigate("PostUpdate")}
          >
            <Text>Post an update</Text>
          </Button>
        </View>
      </View>
    </Container>
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
