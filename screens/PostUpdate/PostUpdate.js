import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";

import {
  Appbar,
  Button,
  withTheme,
  ProgressBar,
  Portal,
  Divider,
} from "react-native-paper";

import TagsView from "./components/TagsView";
import FilesView from "./components/FilesView";
import GuideLinePickerDialog from "./components/GuidelinePickerDialog";
import BigText from "../../components/BigText";

import { NormalTextInput, LargeTextInput } from "./components/TextInputs";
import SwitchView from "./components/SwitchView";
import SupersededGuideline from "./components/SupersededGuideline";
import RichTextEditor from "./components/RichTextEditor";

import api from "../../util/api";
import { showInfoSnackbar } from "../../util/snackbar";
import { NodeType, parse as parseRichText } from "./rich-text";

function richTextNodeToHtml(node) {
  switch (node.type) {
    case NodeType.Plain:
      return node.value;

    case NodeType.Bold:
      return (
        "<strong>" +
        node.children.map(richTextNodeToHtml).join("") +
        "</strong>"
      );

    case NodeType.Italic:
      return "<em>" + node.children.map(richTextNodeToHtml).join("") + "</em>";

    case NodeType.Underline:
      return "<u>" + node.children.map(richTextNodeToHtml).join("") + "</u>";

    case NodeType.Strikethrough:
      return "<s>" + node.children.map(richTextNodeToHtml).join("") + "</s>";
  }
}

function richTextToHtml(text) {
  const html = parseRichText(text).map(richTextNodeToHtml).join("");
  return "<p>" + html.replace(/\n/g, "<br/>") + "</p>";
}

export default withTheme(function PostUpdate({ route, navigation }) {
  const prevPost = route.params?.prevPost;
  const isInternetReachable = useSelector(
    (s) => s.connection.isInternetReachable
  );

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [files, setFiles] = useState([]);
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
    if (!isInternetReachable) {
      showInfoSnackbar(
        "You are currently offline and you may not be able to submit your post."
      );
    }
  }, [isInternetReachable]);

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
      if (tags != []) {
        setTags(supersedingGuideline.tags);
      }
    }
  }

  useEffect(() => {
    if (prevPost) {
      setIsGuideline(true);
      setSupersedingGuideline(prevPost);
      setTitle(prevPost.title);
      setSummary(prevPost.summary);
      // TODO: Set content too ?
      if (prevPost.tags) {
        setTags(prevPost.tags);
      }
    }
  }, [prevPost]);

  function handleSupersedeChange(value) {
    if (value) {
      setGuidelinePicker(true);
      return;
    }
    setSupersedingGuideline(null);
  }

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
        content: richTextToHtml(content),
        is_guideline: isGuideline,
        updates: supersedingGuideline ? supersedingGuideline.id : undefined,
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

  const submitPost = useCallback(() => {
    if (!isInternetReachable) {
      showInfoSnackbar("A post cannot be submitted while offline!");
      return;
    }
    if (isGuideline && tags.length === 0) {
      showInfoSnackbar("A guideline must be assigned at least one tag!");
      return;
    }
    if (!title) {
      showInfoSnackbar("Please fill in a title!");
      return;
    }
    submitData(
      title,
      summary,
      content,
      isGuideline,
      supersedingGuideline,
      tags,
      files
    );
  }, [
    title,
    summary,
    content,
    isGuideline,
    supersedingGuideline,
    tags,
    files,
    progress,
    submitting,
    isInternetReachable,
  ]);

  if (submitting) {
    return (
      <View style={styles.flex}>
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
    <View style={styles.flex}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="New post" />
        </Appbar.Header>
      </TouchableWithoutFeedback>
      <View style={styles.flex}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={styles.flex}>
              <NormalTextInput
                label="Title"
                value={title}
                onChange={setTitle}
              />

              <NormalTextInput
                label="Summary"
                value={summary}
                onChange={setSummary}
              />

              <RichTextEditor
                label="Content"
                value={content}
                onChange={setContent}
              />

              <TagsView
                tags={tags}
                onUpdateTags={setTags}
                style={styles.view}
              />

              <FilesView
                files={files}
                onUpdateFiles={setFiles}
                style={styles.view}
              />

              <Divider style={styles.divider} />

              {/* Guideline switch */}
              <SwitchView
                text="Is this a guideline?"
                value={isGuideline}
                onChange={handleIsGuidelineChange}
                style={styles.view}
              />

              {/* New guideline switch */}
              {isGuideline && (
                <SwitchView
                  text="Does this supersede an old guideline?"
                  value={supersedingGuideline !== null}
                  onChange={handleSupersedeChange}
                  style={styles.view}
                />
              )}

              {/* Superseded guideline picker */}
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

              {/* Superseded guideline view */}
              {isGuideline && supersedingGuideline != null && (
                <SupersededGuideline
                  guideline={supersedingGuideline}
                  onRemoveGuideline={() => setSupersedingGuideline(null)}
                  style={styles.view}
                />
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
  button: {
    margin: 8,
    padding: 8,
  },
  view: {
    margin: 8,
  },
  center: {
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
  },
  flex: {
    flex: 1,
  },
  divider: {
    marginHorizontal: 12,
    marginVertical: 6,
  },
});
