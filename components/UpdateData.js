import React, { useState, useEffect, useRef } from "react";
import { View, Linking, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

import {
  Headline,
  ActivityIndicator,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Card,
  List,
} from "react-native-paper";

import api from "../util/api.js";
import { getExtensionNoDot, downloadFile, openFile } from "../util/files.js";

export default function UpdateData(props) {
  const [data, setData] = useState(undefined);
  const id = props.id;

  async function loadPost() {
    try {
      const res = await api.getPost(id);
      if (res.success) {
        setData(res.data);
      } else {
        console.warn("Failed to get post data with status " + res.status);
      }
    } catch (error) {
      console.warn(error);
    }
  }

  useEffect(() => {
    if (data === undefined) {
      loadPost();
    }
  }, [data]);

  if (data === undefined) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator indeterminate size="large" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.fullHeight}>
        <MainContent
          title={data.title}
          content={createHtmlDocument(data.title, data.content)}
        />
        <View style={{ marginVertical: 16 }}>
          <TagsView tags={data.tags} />
        </View>
        <AttachmentsView files={data.files} />
      </View>
    </>
  );
}

function MainContent({ title, content }) {
  const ref = useRef(null);
  return (
    <View style={styles.fullHeight}>
      <Headline style={styles.title}>{title}</Headline>
      <Divider />
      <WebView
        ref={ref}
        originWhitelist={["*"]}
        style={{ backgroundColor: "transparent" }}
        source={{ html: content }}
        javaScriptEnabled={false}
        onNavigationStateChange={(event) => {
          if (event.url !== "about:blank") {
            ref.current.stopLoading();
            Linking.openURL(event.url);
          }
        }}
      />
    </View>
  );
}

function TagsView({ tags }) {
  return (
    <View style={{ flexDirection: "row" }}>
      {tags && tags.length > 0 ? (
        tags.map((tag) => (
          <Chip key={tag.id} mode="outlined" style={styles.tagsView}>
            {tag.name}
          </Chip>
        ))
      ) : (
        <Chip mode="outlined" icon="tag-remove" style={styles.tag}>
          No tags
        </Chip>
      )}
    </View>
  );
}

function AttachmentsView({ files }) {
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

function Attachment({ file }) {
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

function createHtmlDocument(title, content) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
      <style>
        html, body {
          margin: 0;
        }

        * {
          font-family: sans-serif;
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
  </html>
`;
}

const styles = StyleSheet.create({
  tagsView: {
    flexDirection: "row",
  },
  tag: {
    margin: 4,
  },
  fullHeight: {
    flex: 1,
  },
  title: {
    marginVertical: 8,
  },
  fileIcon: {
    marginRight: 10,
  },
});
