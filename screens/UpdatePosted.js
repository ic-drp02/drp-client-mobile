import React from "react";
import { StyleSheet, View } from "react-native";

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
} from "native-base";
import { StatusBar } from "react-native";

import BigText from "../components/BigText.js";

export default function UpdatePosted({ navigation }) {
  return (
    <Container>
      <Header>
        <StatusBar barStyle="light-content" />
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Update posted</Title>
        </Body>
        <Right />
      </Header>
      <View style={styles.container}>
        <View style={[styles.content, styles.center]}>
          <BigText text="Great!" />
          <Text>Your post has been submitted!</Text>
          <Button
            style={styles.topMargin}
            onPress={() => navigation.navigate("Home")}
          >
            <Text>Go to home screen</Text>
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
  center: {
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
  },
  topMargin: {
    marginTop: 30,
  },
});