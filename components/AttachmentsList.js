import React from "react";
import { View } from "react-native";
import { Card, List } from "react-native-paper";

import Attachment from "./Attachment.js";

export default function AttachmentsList({ filesWithPosts }) {
  return (
    <View>
      {filesWithPosts.length > 0 && (
        <Card style={{ marginBottom: 20 }}>
          <List.Section>
            {filesWithPosts.map((fileWithPost) => (
              <Attachment
                key={fileWithPost.file.id}
                file={fileWithPost.file}
                description={"From " + fileWithPost.post.title}
              />
            ))}
          </List.Section>
        </Card>
      )}
    </View>
  );
}
