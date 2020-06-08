import React from "react";
import { StyleSheet } from "react-native";
import { List, Avatar, IconButton } from "react-native-paper";

import api from "../util/api";
import { getExtensionNoDot, downloadFile, openFile } from "../util/files.js";

export default function Attachment({ file }) {
  const extension = getExtensionNoDot(file.name).toUpperCase();

  function FileIcon() {
    if (getExtensionNoDot(file.name).length <= 3) {
      return (
        <Avatar.Text style={styles.fileIcon} size={40} label={extension} />
      );
    } else {
      return <Avatar.Icon style={styles.fileIcon} size={40} icon="file" />;
    }
  }

  function DownloadButton(props) {
    return (
      <IconButton
        {...props}
        icon="arrow-down"
        onPress={() => {
          downloadFile(
            api.baseUrl + "/api/rawfiles/download/" + file.id,
            file.id,
            file.name
          );
        }}
      />
    );
  }

  function open() {
    openFile(api.baseUrl + "/api/rawfiles/view/" + file.id, file.id, file.name);
  }

  return (
    <List.Item
      key={file.id}
      title={file.name}
      left={FileIcon}
      right={DownloadButton}
      onPress={open}
    />
  );
}

const styles = StyleSheet.create({
  fileIcon: {
    marginRight: 10,
  },
});
