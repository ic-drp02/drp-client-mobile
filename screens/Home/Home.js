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
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import PostSummary from "../../components/PostSummary.js";

const StackNavigator = createStackNavigator();

export default function Home({ navigation }) {
  return (
    <Container>
      <Header>
        <StatusBar barStyle="light-content" />
        <Left>
          <Button transparent onPress={() => navigation.openDrawer()}>
            <Icon style={styles.navicon} name="menu" />
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
        <View style={styles.content}>
          <H3 style={styles.margin}>Recently viewed</H3>
          <PostSummary
            title="Pre op assessment"
            summary="New guidelines on pre op assessment for elective surgery during COVID"
          />
          <PostSummary
            title="Minutes from ICON Q&A"
            summary="The official minutes from yesteray's ICON Q&A"
          />
          <H3 style={styles.margin}>Latest updates</H3>
          <PostSummary
            title="Antibody testing"
            summary="Antibody testing is available @ Imperial"
          />
          <PostSummary
            title="COVID patients referral"
            summary="How to refer vulnerable COVID patients to the LCW"
          />
        </View>
        <View style={styles.buttons}>
          <Button
            style={styles.button}
            onPress={() => navigation.navigate("Ask a question")}
          >
            <Text>Ask a question</Text>
          </Button>
          <Button
            style={styles.button}
            onPress={() => navigation.navigate("Post an update")}
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
  navicon: {
    color: "#FFF",
  },
});
