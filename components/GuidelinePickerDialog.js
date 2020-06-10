import React, { useEffect, useState } from "react";
import {
  Dialog,
  Button,
  TextInput,
  Text,
  Card,
  ProgressBar,
} from "react-native-paper";

import { View, ScrollView, StyleSheet } from "react-native";

import { timeElapsedSince } from "../util/date.js";
import api from "../util/api";

export default function GuidelinePickerDialog({
  visible,
  onDismiss,
  onSelect,
}) {
  return (
    <Dialog
      visible={visible}
      onDismiss={onDismiss}
      style={{ maxHeight: "85%", flex: 1 }}
    >
      <Dialog.Title style={{ textAlign: "center" }}>
        Choose superseded guideline
      </Dialog.Title>
      <GuidelinePickerDialogContent
        onSelect={onSelect}
      ></GuidelinePickerDialogContent>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Cancel</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

function GuidelinePickerDialogContent({ onSelect }) {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    api.getPosts().then((res) => {
      setPosts(res.data);
      setFilteredPosts(res.data);
    });
  }, []);

  if (posts === null) {
    return <ProgressBar indeterminate />;
  }

  function onSearchTextChange(e) {
    const filteredPosts = posts.filter((p) =>
      p.title.toLowerCase().includes(e.nativeEvent.text.toLowerCase())
    );

    setFilteredPosts(filteredPosts);
    setValue(e.nativeEvent.value);
  }

  return (
    <Dialog.Content style={styles.fullHeight}>
      <TextInput
        label="Search guidelines"
        mode="outlined"
        value={value}
        onChange={onSearchTextChange}
        style={styles.search}
      ></TextInput>

      <Dialog.ScrollArea style={styles.noHorizontalPadding}>
        <View style={styles.fullHeight}>
          <ScrollView>
            {filteredPosts.map((p) => (
              <Card key={p.id} style={styles.post} onPress={() => onSelect(p)}>
                <Text style={styles.title}>{p.title}</Text>
                <Text>{timeElapsedSince(new Date(p.created_at))}</Text>
              </Card>
            ))}
          </ScrollView>
        </View>
      </Dialog.ScrollArea>
    </Dialog.Content>
  );
}

const styles = StyleSheet.create({
  noHorizontalPadding: {
    paddingHorizontal: 0,
  },
  search: {
    marginBottom: 10,
  },
  fullHeight: {
    flex: 1,
  },
  post: {
    marginVertical: 3,
    marginHorizontal: 1,
    padding: 6,
  },
  title: {
    fontWeight: "bold",
  },
});
