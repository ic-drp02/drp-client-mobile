import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import {
  Appbar,
  Button,
  Chip,
  TextInput,
  withTheme,
  Portal,
} from "react-native-paper";

import TagPickerDialog from "../components/TagPickerDialog";

import api from "../util/api";

export default withTheme(function PostUpdate({ navigation, theme }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagsDialogVisible, setTagsDialogVisible] = useState(false);

  async function submitData(title, summary, content, tags) {
    try {
      const res = await api.createPost({
        title,
        summary,
        content: "<p>" + content.replace(/\n/g, "<br/>") + "</p>",
        tags: tags.map((t) => t.name),
      });

      if (!res.success) {
        console.warn("An error occured, status code " + res.status + "!");
        return;
      }

      navigation.navigate("UpdatePosted");
    } catch (error) {
      console.warn(error);
    }
  }

  const submitPost = useCallback(
    () => submitData(title, summary, content, tags),
    [title, summary, content, tags]
  );

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
            <View
              style={{
                margin: 8,
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {tags.map((tag) => (
                <Chip
                  key={tag.id}
                  mode="outlined"
                  onClose={() => setTags(tags.filter((t) => t.id !== tag.id))}
                  style={{ margin: 4 }}
                >
                  {tag.name}
                </Chip>
              ))}
              <Chip
                icon="plus"
                mode="outlined"
                onPress={() => setTagsDialogVisible(true)}
                style={{ margin: 4, backgroundColor: theme.colors.primary }}
                theme={{ colors: { text: "#fff" } }}
              >
                Add Tag
              </Chip>
              <Portal>
                <TagPickerDialog
                  visible={tagsDialogVisible}
                  initialSelected={tags}
                  onDismiss={() => setTagsDialogVisible(false)}
                  onTagSelectionChange={(tag) => {
                    if (tag.selected) {
                      setTags([...tags, tag]);
                    } else {
                      setTags(tags.filter((t) => t.id !== tag.id));
                    }
                  }}
                  style={{ maxHeight: "80%" }}
                />
              </Portal>
            </View>
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
});

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
