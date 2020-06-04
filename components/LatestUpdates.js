import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { ProgressBar, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

import PostSummary from "./PostSummary.js";

import api from "../util/api";

export default function Home(props) {
  const limit = props.limit;
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

  updates.reverse();

  const shownUpdates = updates.slice(
    0,
    !limit ? updates.length : Math.min(updates.length, limit)
  );

  const postSummaries = shownUpdates.map((update) => (
    <PostSummary
      key={update.id}
      id={update.id}
      title={update.title}
      summary={update.summary}
      date={new Date(update.created_at)}
    />
  ));

  return <>{postSummaries}</>;
}
