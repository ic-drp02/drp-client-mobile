import React from "react";
import { View } from "react-native";

import { Chip } from "react-native-paper";

import { downloadAndOpenFile } from "../util/files.js";
import api from "../util/api";

export default function Attachments({ files }) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          flexWrap: "wrap",
        },
      ]}
    >
      {files.map((file, index) => (
        <Chip
          key={index}
          icon="file-outline"
          mode="outlined"
          onPress={() => {
            downloadAndOpenFile(
              api.baseUrl + "/api/rawfiles/view/" + file.id,
              file.id,
              file.name
            );
          }}
          style={{ margin: 4, width: "97%" }}
        >
          {file.name}
        </Chip>
      ))}
    </View>
  );
}
