import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";

import {
  Button,
  Chip,
  Dialog,
  ProgressBar,
  TextInput,
} from "react-native-paper";

import api from "../../../util/api";

/**
 * Returns `tags` with the `selected` property set to true on each item if the
 * item is in `selected`.
 * @param {Object[]} tags - Array of tags.
 * @param {Object[]} selected - Array of tags that should be selected.
 */
function setSelectedTags(tags, selected) {
  return tags.map((t) => {
    if (selected.find((s) => s.id === t.id)) {
      return { ...t, selected: true };
    } else {
      return { ...t, selected: false };
    }
  });
}

function TagPickerDialogContent({ initialSelected, onSelectionChange }) {
  const [tags, setTags] = useState(null);
  const [matches, setMatches] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    api.getTags().then((res) => {
      const tags = setSelectedTags(res.data, initialSelected);
      setTags(tags);
      setMatches(tags);
    });
  }, []);

  if (tags === null) {
    return <ProgressBar indeterminate />;
  }

  function onSearchTextChange(e) {
    // Find all tags that contain the search text
    const matches = tags.filter((tag) =>
      tag.name.toLowerCase().includes(e.nativeEvent.text.toLowerCase())
    );

    setMatches(matches);
    setValue(e.nativeEvent.text);
  }

  function onCreateTagPress() {
    api.createTag(value).then((res) => {
      setTags([...tags, res.data]);
      setMatches([...matches, res.data]);
    });
  }

  function onTagPress(tag) {
    const target = { ...tag, selected: !tag.selected };

    if (!!onSelectionChange) {
      onSelectionChange(target);
    }

    // Update old tags with the target tag's selection toggled
    const newTags = tags.map((t) => (t === tag ? target : t));
    const newMatches = matches.map((t) => (t === tag ? target : t));

    setTags(newTags);
    setMatches(newMatches);
  }

  // Only show button if the user has entered some text that
  // is not an exact match of an existing tag.
  const shouldShowCreateTagButton =
    !!value &&
    !matches.map((t) => t.name.toLowerCase()).includes(value.toLowerCase());

  return (
    <>
      <Dialog.Content>
        <TextInput
          mode="outlined"
          label="Tag name"
          value={value}
          onChange={onSearchTextChange}
        />
        {shouldShowCreateTagButton && (
          <Button
            mode="outlined"
            icon="plus"
            style={styles.createTagButton}
            onPress={onCreateTagPress}
          >
            Create tag
          </Button>
        )}
      </Dialog.Content>
      <Dialog.ScrollArea>
        <ScrollView>
          <View style={styles.tagsContainer}>
            {matches.map((tag) => (
              <Chip
                key={tag.id}
                selected={tag.selected}
                onPress={() => onTagPress(tag)}
                style={styles.tagChip}
              >
                {tag.name}
              </Chip>
            ))}
          </View>
        </ScrollView>
      </Dialog.ScrollArea>
    </>
  );
}

export default function TagPickerDialog({
  visible,
  initialSelected,
  style,
  onDismiss,
  onTagSelectionChange,
}) {
  return (
    <Dialog visible={visible} onDismiss={onDismiss} style={style}>
      <Dialog.Title>Add tags</Dialog.Title>
      <TagPickerDialogContent
        initialSelected={initialSelected}
        onSelectionChange={onTagSelectionChange}
      />
      <Dialog.Actions>
        <Button onPress={onDismiss}>Done</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  tagsContainer: {
    marginVertical: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagChip: {
    margin: 4,
  },
  createTagButton: {
    marginVertical: 8,
  },
});
