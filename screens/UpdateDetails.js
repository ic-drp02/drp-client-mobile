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
  H3,
} from "native-base";
import { StatusBar } from "react-native";

import UpdateData from "../components/UpdateData.js";

export default function UpdateDetails({ route, navigation }) {
  const { postId } = route.params;

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
          <Title>Update details</Title>
        </Body>
        <Right />
      </Header>
      <View style={styles.container}>
        <View style={styles.content}>
          <UpdateData style={styles.margin} id={postId} />
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
