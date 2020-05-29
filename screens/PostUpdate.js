import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { Appbar, TextInput, Button } from "react-native-paper";

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

  const submitPost = useCallback(() => submitData(title, summary, content), [
    title,
    summary,
    content,
  ]);

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="New post" />
        </Appbar.Header>
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.content}>
            <TextInput
              label="Title"
              mode="outlined"
              onChangeText={(text) => setTitle(text)}
              style={{ margin: 8 }}
            />
            <TextInput
              label="Summary"
              mode="outlined"
              onChangeText={(text) => setSummary(text)}
              style={{ margin: 8 }}
            />
            <TextInput
              label="Post text"
              mode="outlined"
              multiline={true}
              numberOfLines={7}
              onChangeText={(text) => setContent(text)}
              style={{ margin: 8 }}
            />
            <Button
              mode="contained"
              onPress={() => submitPost()}
              style={styles.button}
            >
              Post
            </Button>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
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
    margin: 8,
    padding: 8,
  },
});
