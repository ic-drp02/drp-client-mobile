import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  ScrollView,
} from "react-native";

import {
  Appbar,
  Button,
  Chip,
  TextInput,
  withTheme,
  ProgressBar,
  Portal,
  Switch,
} from "react-native-paper";

import * as DocumentPicker from "expo-document-picker";

import TagPickerDialog from "../components/TagPickerDialog";
import GuideLinePickerDialog from "../components/GuidelinePickerDialog";
import FileRenameDialog from "../components/FileRenameDialog";
import BigText from "../components/BigText";
import GuidelineCard from "../components/GuidelineCard";

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
  const [isGuideline, setIsGuideline] = useState(false);
  const [supersedingGuideline, setSupersedingGuideline] = useState(null);
  const [guidelinePicker, setGuidelinePicker] = useState(false);

  const handleIsGuidelineChange = () => {
    setIsGuideline(!isGuideline);
    if (!isGuideline) {
      setSupersedingGuideline(null);
    }
  };

  const handlePostPress = (post) => {
    setSupersedingGuideline(post);
    setGuidelinePicker(false);
  };

  useEffect(() => {
    preFillPost();
  }, [supersedingGuideline]);

  function preFillPost() {
    if (supersedingGuideline) {
      if (!title) {
        setTitle(supersedingGuideline.title);
      }
      if (!summary) {
        setSummary(supersedingGuideline.summary);
      }
    }
  }

  function handleSupersedeChange(value) {
    if (value) {
      setGuidelinePicker(true);
      return;
    }
    setSupersedingGuideline(null);
  }

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

  async function submitData(
    title,
    summary,
    content,
    isGuideline,
    supersedingGuideline,
    tags,
    files
  ) {
    setSubmitting(true);
    try {
      const res = await api.createPost({
        title,
        summary,
        content: "<p>" + content.replace(/\n/g, "<br/>") + "</p>",
        is_guideline: isGuideline,
        superseding: supersedingGuideline ? supersedingGuideline.id : undefined,
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
    () =>
      submitData(
        title,
        summary,
        content,
        isGuideline,
        supersedingGuideline,
        tags,
        files
      ),
    [
      title,
      summary,
      content,
      isGuideline,
      supersedingGuideline,
      tags,
      files,
      progress,
      submitting,
    ]
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="New post" />
        </Appbar.Header>
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={styles.content}>
              <TextInput
                label="Title"
                mode="outlined"
                value={title}
                onChangeText={(text) => setTitle(text)}
                clearButtonMode="always"
                style={{ margin: 8 }}
              />
              <TextInput
                label="Summary"
                mode="outlined"
                value={summary}
                onChangeText={(text) => setSummary(text)}
                clearButtonMode="always"
                style={{ margin: 8 }}
              />
              <TextInput
                label="Post text"
                mode="outlined"
                multiline={true}
                numberOfLines={7}
                value={content}
                onChangeText={(text) => setContent(text)}
                style={{ margin: 8 }}
              />

              {/* Tag Picker */}
              <View style={styles.view}>
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

              {/* File Picker */}
              <View style={styles.view}>
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

              {/* Guideline check */}
              <View style={styles.viewWithSpace}>
                <Text style={styles.guidelineText}>Is this a guideline?</Text>
                <Switch
                  value={isGuideline}
                  onValueChange={handleIsGuidelineChange}
                  color={theme.colors.primary}
                />
              </View>

              {/* New guideline check */}
              {isGuideline ? (
                <View style={styles.viewWithSpace}>
                  <Text style={styles.guidelineText}>
                    Does this supersede an old guideline?
                  </Text>
                  <Switch
                    value={supersedingGuideline === null ? false : true}
                    onValueChange={(value) => handleSupersedeChange(value)}
                    color={theme.colors.primary}
                  />
                </View>
              ) : (
                <></>
              )}

              {/* Preceding guideline picker */}
              <Portal>
                <GuideLinePickerDialog
                  visible={guidelinePicker}
                  onDismiss={() => {
                    setSupersedingGuideline(null);
                    setGuidelinePicker(false);
                  }}
                  onSelect={handlePostPress}
                ></GuideLinePickerDialog>
              </Portal>

              {/* Preceding guideline view */}
              {isGuideline && supersedingGuideline != null ? (
                <View style={styles.view}>
                  <Text style={styles.guidelineText}>
                    This guideline will supersede:
                  </Text>
                  <GuidelineCard
                    guideline={supersedingGuideline}
                    showRemove={true}
                    onRemove={() => setSupersedingGuideline(null)}
                  />
                </View>
              ) : (
                <></>
              )}
              <Button
                mode="contained"
                onPress={() => submitPost()}
                style={styles.button}
              >
                Post
              </Button>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
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
  guidelineText: {
    alignSelf: "center",
    textAlign: "left",
    fontSize: 15,
    marginLeft: 4,
  },
  view: {
    margin: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  viewWithSpace: {
    margin: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  center: {
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
  },
});
