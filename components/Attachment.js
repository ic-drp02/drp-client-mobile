import React from "react";
import { StyleSheet } from "react-native";
import { List, Avatar, IconButton } from "react-native-paper";

import api from "../util/api";
import {
  getExtensionNoDot,
  downloadToMediaFolder,
  downloadAndOpenFile,
} from "../util/files.js";

export default function Attachment({ file, description }) {
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
          downloadToMediaFolder(
            api.baseUrl + "/api/rawfiles/download/" + file.id,
            file.id,
            file.name
          );
        }}
      />
    );
  }

  function open() {
    downloadAndOpenFile(
      api.baseUrl + "/api/rawfiles/view/" + file.id,
      file.id,
      file.name
    );
  }

  return (
    <List.Item
      key={file.id}
      title={file.name}
      description={description}
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
