import React, { useState } from "react";
import { View } from "react-native";
import { Chip, Portal, useTheme } from "react-native-paper";

import TagPickerDialog from "./TagPickerDialog";

export default function TagsView({ tags, onUpdateTags, style }) {
  const theme = useTheme();
  const [tagsDialogVisible, setTagsDialogVisible] = useState(false);
  return (
    <View style={{ flexWrap: "wrap", flexDirection: "row", ...style }}>
      {tags.map((tag) => (
        <Chip
          key={tag.id}
          mode="outlined"
          onClose={() => onUpdateTags(tags.filter((t) => t.id !== tag.id))}
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
              onUpdateTags([...tags, tag]);
            } else {
              onUpdateTags(tags.filter((t) => t.id !== tag.id));
            }
          }}
          style={{ maxHeight: "80%" }}
        />
      </Portal>
    </View>
  );
}
