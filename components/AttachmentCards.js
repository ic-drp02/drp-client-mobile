import React from "react";
import { View, StyleSheet } from "react-native";

import { Card, Text, IconButton, useTheme } from "react-native-paper";

import { openFile } from "../util/files.js";
import api from "../util/api";

export default function AttachmentCards({ files }) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    fileName: {
      color: "white",
      alignSelf: "center",
      flex: 1,
    },
    fileIcon: {
      margin: 0,
      alignSelf: "center",
    },
    card: {
      padding: 10,
      backgroundColor: theme.colors.primary,
      marginBottom: 8,
    },
  });

  return (
    <View>
      {files.map((file, index) => (
        <Card
          key={index}
          mode="outlined"
          onPress={() => {
            openFile(
              api.baseUrl + "/api/rawfiles/view/" + file.id,
              file.id,
              file.name
            );
          }}
          style={styles.card}
        >
          <View style={{ flexDirection: "row" }}>
            <IconButton
              icon="file"
              color="white"
              style={styles.fileIcon}
            ></IconButton>
            <Text style={styles.fileName}>{file.name}</Text>
          </View>
        </Card>
      ))}
    </View>
  );
}
