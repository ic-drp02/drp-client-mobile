import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from "react-native";

import {
  Appbar,
  Button,
  Chip,
  TextInput,
  withTheme,
  ProgressBar,
  Portal,
} from "react-native-paper";

import * as DocumentPicker from "expo-document-picker";

import TagPickerDialog from "../components/TagPickerDialog";
import FileRenameDialog from "../components/FileRenameDialog";
import BigText from "../components/BigText";

import api from "../util/api";

export default withTheme(function PostUpdate({ navigation, theme }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagsDialogVisible, setTagsDialogVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const [renameDialogVisible, setRenameDialogVisible] = useState(false);
  const [renamedFile, setRenamedFile] = useState(0);
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  function newFile(name, uri) {
    return {
      uri: uri,
      type: "*/*",
      name: name,
    };
  }

  async function selectDocument() {
    const selected = await DocumentPicker.getDocumentAsync();
    if (selected.type !== "success") {
      // User cancelled
      return;
    }

    const file = newFile(selected.name, selected.uri);
    setFiles([...files, file]);
  }

  const addDocument = useCallback(() => {
    selectDocument();
  }, [files]);

  async function submitData(title, summary, content, tags, files) {
    setSubmitting(true);
    try {
      const res = await api.createPost({
        title,
        summary,
        content: "<p>" + content.replace(/\n/g, "<br/>") + "</p>",
        tags: tags.map((t) => t.name),
        files: files,
        names: files.map((f) => f.name),
        onUploadedFraction: (fraction) => {
          setProgress(fraction);
        },
      });

      if (!res.success) {
        console.warn("An error occured, status code " + res.status + "!");
        return;
      }

      navigation.replace("UpdatePosted");
    } catch (error) {
      console.warn(error);
    }
  }

  const submitPost = useCallback(
    () => submitData(title, summary, content, tags, files),
    [title, summary, content, tags, files, progress, submitting]
  );

  if (submitting) {
    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Submitting post" />
        </Appbar.Header>
        <View style={[styles.container, styles.justifyCenter]}>
          <View style={[styles.center, styles.margin]}>
            <BigText text="Just a moment!" />
            <Text>Your post is being submitted to our servers...</Text>
          </View>
          <ProgressBar progress={progress} />
        </View>
      </View>
    );
  }

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
            <View
              style={{
                margin: 8,
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {files.map((file, index) => (
                <Chip
                  key={index}
                  icon="pen"
                  mode="outlined"
                  onClose={() => setFiles(files.filter((_, i) => i != index))}
                  onPress={() => {
                    setRenamedFile(index);
                    setRenameDialogVisible(true);
                  }}
                  style={{ margin: 4 }}
                >
                  {file.name}
                </Chip>
              ))}
              <Chip
                icon="plus"
                mode="outlined"
                onPress={() => addDocument()}
                style={{ margin: 4, backgroundColor: theme.colors.primary }}
                theme={{ colors: { text: "#fff" } }}
              >
                Add attachment
              </Chip>
              <Portal>
                <FileRenameDialog
                  visible={renameDialogVisible}
                  renamedFile={
                    renameDialogVisible ? files[renamedFile].name : ""
                  }
                  onCancel={() => setRenameDialogVisible(false)}
                  onRenameTo={(newName) => {
                    let oldName = files[renamedFile].name;
                    setFiles(
                      files.map((f, i) => {
                        return i !== renamedFile
                          ? f
                          : newFile(newName, files[renamedFile].uri);
                      })
                    );

                    setRenameDialogVisible(false);
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
  justifyCenter: {
    justifyContent: "center",
  },
  margin: {
    marginBottom: 40,
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
  center: {
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
  },
});
