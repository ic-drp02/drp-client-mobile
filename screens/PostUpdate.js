import React, { useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";

import {
  Container,
  Footer,
  FooterTab,
  Content,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Text,
  Item,
  Form,
  Input,
  Label,
  CheckBox,
  Textarea,
  ListItem,
} from "native-base";
import { StatusBar } from "react-native";

import FormLabel from "../components/FormLabel.js";

export default function PostUpdate({ navigation }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  const submitPost = useCallback(() => {
    setTitle("Hello!!!!");
    console.warn(title);
    alert("hey there" + title);
  }, [title, summary, content]);

  return (
    <Container>
      <Header>
        <StatusBar barStyle="light-content" />
        <Left style={styles.left}>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>New post</Title>
        </Body>
      </Header>
      <View style={styles.container}>
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
          <FormLabel
            text="Post text"
            onChangeText={(text) => setContent(text)}
          />
          <Textarea
            style={styles.textarea}
            rowSpan={12}
            bordered
            placeholder="The text of your post"
          />
          <Button style={styles.button} onPress={() => submitPost()}>
            <Text>Post</Text>
          </Button>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  left: {
    flex: 0.15,
  },
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
});
