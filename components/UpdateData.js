import React, { useRef } from "react";
import { View, Linking, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

import { Headline, Divider, Chip, Text } from "react-native-paper";

import AttachmentCards from "./AttachmentCards.js";
import Label, { LABEL_TYPES } from "./Label";

import { toDateAndTimeString } from "../util/date";

export default function UpdateData(props) {
  const post = props.post;
  const old = props.old;

  return (
    <>
      <View style={styles.fullHeight}>
        <MainContent
          title={post.title}
          summary={post.summary}
          content={createHtmlDocument(post.title, post.content)}
          files={post.files}
          date={post.created_at}
          old={old}
        />
        <View style={{ marginBottom: 10 }}>
          <TagsView tags={post.tags} />
        </View>
      </View>
    </>
  );
}

function MainContent({ title, summary, content, date, old, files }) {
  const ref = useRef(null);
  return (
    <View style={styles.fullHeight}>
      <View style={styles.view}>
        <Headline>{title}</Headline>
        {old && (
          <Label labelType={LABEL_TYPES.OLD} style={{ marginLeft: 10 }} />
        )}
      </View>
      {summary ? <Text style={styles.summary}>{summary}</Text> : <></>}
      <View style={styles.dateView}>
        <Chip icon="calendar-range">
          {"Posted on " + toDateAndTimeString(new Date(date))}
        </Chip>
      </View>
      <Divider />
      <View>
        <AttachmentCards files={files} />
      </View>

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
    <View style={styles.tagsView}>
      {tags && tags.length > 0 ? (
        tags.map((tag) => (
          <Chip key={tag.id} mode="outlined" style={styles.tag}>
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
    flexWrap: "wrap",
  },
  tag: {
    margin: 4,
  },
  fullHeight: {
    flex: 1,
  },
  summary: {
    color: "grey",
    fontSize: 16,
  },
  dateView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 5,
    marginBottom: 8,
  },
  fileIcon: {
    marginRight: 10,
  },
  view: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
});
