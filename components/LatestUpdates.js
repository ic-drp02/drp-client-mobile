import React, { useState, useEffect } from "react";
import { View } from "react-native";
import {
  ProgressBar,
  Text,
  List,
  Avatar,
  IconButton,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

import PostSummary from "./PostSummary.js";

import api from "../util/api";
import { getExtensionNoDot, downloadFile, openFile } from "../util/files.js";

export default function Home(props) {
  const limit = props.limit;
  const search = props.search ? props.search.toLowerCase() : "";
  const [updates, setUpdates] = useState(undefined);

  async function updatePosts() {
    try {
      const res = await api.getPosts();
      if (!res.success) {
        console.warn("An error occured, status code " + res.status + "!");
        setUpdates(null);
        return;
      }
      setUpdates(res.data);
    } catch (error) {
      console.warn(error);
    }
  }

  // Update the shown posts every 10 seconds
  useEffect(() => {
    if (updates === undefined) {
      updatePosts();
    }
    // TODO: Too short, change after demo
    const interval = setInterval(() => updatePosts(), 1000);
    return () => clearInterval(interval);
  }, [updates]);

  if (updates === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ProgressBar indeterminate />
      </View>
    );
  }

  if (updates === null) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={36} name="error-outline" color="red" />
        <Text>An error occured while fetching updates :-(</Text>
      </View>
    );
  }

  if (search === "") {
    updates.reverse();
  }

  let shownUpdates = updates.slice(
    0,
    !limit ? updates.length : Math.min(updates.length, limit)
  );

  if (search != "") {
    shownUpdates = shownUpdates.filter(
      (update) =>
        update.title.toLowerCase().includes(search) ||
        update.summary.toLowerCase().includes(search) ||
        update.content.toLowerCase().includes(search)
    );
  }

  const postSummaries = shownUpdates.map((update) => (
    <PostSummary
      key={update.id}
      id={update.id}
      title={update.title}
      summary={update.summary}
      date={new Date(update.created_at)}
    />
  ));

  const relatedFiles = [].concat.apply(
    [],
    shownUpdates.map((update) => update.files)
  );

  const relatedFilesView = relatedFiles.map((file) => (
    <List.Item
      key={file.id}
      title={file.name}
      left={() => (
        <Avatar.Text style={{ marginRight: 10 }} size={40} label="PDF" />
      )}
      left={(props) => {
        const extension = getExtensionNoDot(file.name).toUpperCase();
        if (getExtensionNoDot(file.name).length <= 3) {
          return (
            <Avatar.Text
              style={{ marginRight: 10 }}
              size={40}
              label={extension}
            />
          );
        }
        return (
          <Avatar.Icon style={{ marginRight: 10 }} size={40} icon="file" />
        );
      }}
      right={(props) => (
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
      )}
      onPress={() =>
        openFile(
          api.baseUrl + "/api/rawfiles/view/" + file.id,
          file.id,
          file.name
        )
      }
    />
  ));

  return (
    <>
      <View>
        {postSummaries}
        {search !== "" && relatedFilesView}
      </View>
    </>
  );
}
