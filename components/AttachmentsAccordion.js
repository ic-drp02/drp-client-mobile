import React from "react";
import { View } from "react-native";
import { Card, List } from "react-native-paper";

import Attachment from "./Attachment.js";

export default function AttachmentsAccordion({ files }) {
  return (
    <View>
      {files.length > 0 && (
        <Card style={{ marginBottom: 20 }}>
          <List.Accordion
            title="Attached files"
            left={(props) => <List.Icon {...props} icon="file" />}
          >
            {files.map((file) => (
              <Attachment key={file.id} file={file} />
            ))}
          </List.Accordion>
        </Card>
      )}
    </View>
  );
}
