import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Spinner, Text, Icon } from "native-base";

import PostSummary from "./PostSummary.js";

import { COLOR_PRIMARY } from "../util/colors.js";

import * as api from "../util/api";

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
    const interval = setInterval(() => updatePosts(), 10000);
    return () => clearInterval(interval);
  }, [updates]);

  if (updates === undefined) {
    return <Spinner color={COLOR_PRIMARY} />;
  }

  if (updates === null) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          name="error"
          type="MaterialIcons"
          style={{ color: "red", marginRight: 10 }}
        />
        <Text>An error occured while fetching updates :-(.</Text>
      </View>
    );
  }

  updates.reverse();
  const shownUpdates = updates.slice(
    0,
    !limit ? updates.length : Math.min(updates.length, limit + 1)
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
