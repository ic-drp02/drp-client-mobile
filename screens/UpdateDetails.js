import React, { useCallback } from "react";
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
  Toast,
} from "native-base";
import { StatusBar } from "react-native";

import UpdateData from "../components/UpdateData.js";

import { deletePost } from "../util/api.js";

export default function UpdateDetails({ route, navigation }) {
  const { postId } = route.params;

  async function requestDeletion(postId) {
    try {
      const res = await deletePost(postId);
      if (!res.success) {
        console.warn("An error occured, status code " + res.status + "!");
      }
      Toast.show({
        text: "Deleted!",
        style: {
          backgroundColor: "green",
        },
        buttonText: "Go to home screen",
        duration: 10000,
        onClose: (reason) => {
          if (reason == "user") {
            navigation.navigate("Home");
          }
        },
      });
    } catch (error) {
      console.warn(error);
    }
  }

  const del = useCallback(() => {
    requestDeletion(postId);
  }, [postId]);

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
          <Button style={styles.button} onPress={() => del(postId)}>
            <Text>Delete</Text>
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
  margin: {
    margin: 10,
  },
  button: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "red",
  },
});
