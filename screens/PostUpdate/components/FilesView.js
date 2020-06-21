import React, { useCallback, useState } from "react";
import * as DocumentPicker from "expo-document-picker";

import FileRenameDialog from "./FileRenameDialog";
import { Chip, Portal, useTheme } from "react-native-paper";
import { View } from "react-native";

function newFile(name, uri) {
  return {
    name,
    uri,
    type: "*/*",
  };
}

export default function FilesView({ files, onUpdateFiles, style }) {
  const theme = useTheme();

  const [renamedFile, setRenamedFile] = useState(-1);

  const addDocument = useCallback(() => {
    DocumentPicker.getDocumentAsync().then((selected) => {
      if (selected.type !== "success") {
        // User cancelled
        return;
      }

      const file = newFile(selected.name, selected.uri);
      onUpdateFiles([...files, file]);
    });
  }, [files, onUpdateFiles]);

  const onRenameFile = useCallback((newName) => {
    onUpdateFiles(
      files.map((f, i) => {
        return i !== renamedFile ? f : newFile(newName, files[renamedFile].uri);
      })
    );

    setRenamedFile(-1);
  });

  return (
    <View style={{ flexWrap: "wrap", flexDirection: "row", ...style }}>
      {files.map((file, index) => (
        <Chip
          key={index}
          icon="pen"
          mode="outlined"
          onClose={() => onUpdateFiles(files.filter((_, i) => i != index))}
          onPress={() => setRenamedFile(index)}
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
          visible={renamedFile > -1}
          renamedFile={renamedFile > -1 ? files[renamedFile].name : ""}
          onCancel={() => setRenameDialogVisible(false)}
          onRenameTo={onRenameFile}
          style={{ maxHeight: "80%" }}
        />
      </Portal>
    </View>
  );
}
