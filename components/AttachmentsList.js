import React from "react";
import { View } from "react-native";
import { Card, List } from "react-native-paper";

import Attachment from "./Attachment.js";

export default function attachmentsList({ files }) {
  return (
    <View>
      {files.length > 0 && (
        <Card style={{ marginBottom: 20 }}>
          <List.Section>
            {files.map((file) => (
              <Attachment key={file.id} file={file} />
            ))}
          </List.Section>
        </Card>
      )}
    </View>
  );
}
