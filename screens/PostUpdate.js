import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

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
  Item,
  Input,
  Textarea,
} from "native-base";

import FormLabel from "../components/FormLabel.js";

import * as api from "../util/api";

export default function PostUpdate({ navigation }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  async function submitData(title, summary, content) {
    try {
      const res = await api.createPost({ title, summary, content });
      if (!res.success) {
        console.warn("An error occured, status code " + res.status + "!");
        return;
      }
      navigation.navigate("UpdatePosted");
    } catch (error) {
      console.warn(error);
    }
  }

  const submitPost = useCallback(() => {
    submitData(title, summary, content);
  }, [title, summary, content]);

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
          <Title>New post</Title>
        </Body>
        <Right />
      </Header>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.content}>
            <FormLabel text="Title" />
            <Item regular>
              <Input
                placeholder="Brief title for your post"
                onChangeText={(text) => setTitle(text)}
              />
            </Item>
            <FormLabel text="Summary" />
            <Item regular>
              <Input
                placeholder="Brief summary of your post"
                onChangeText={(text) => setSummary(text)}
              />
            </Item>
            <FormLabel text="Post text" />
            <Textarea
              style={styles.textarea}
              rowSpan={12}
              bordered
              placeholder="The text of your post"
              onChangeText={(text) => setContent(text)}
            />
            <Button style={styles.button} onPress={() => submitPost()}>
              <Text>Post</Text>
            </Button>
          </View>
        </TouchableWithoutFeedback>
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
  textarea: {
    margin: 2,
    fontSize: 17,
  },
  noborder: {
    borderBottomWidth: 0,
    marginLeft: 7,
  },
  button: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
});
