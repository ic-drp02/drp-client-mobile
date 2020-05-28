import React, { useState, useEffect } from "react";
import { StyleSheet, View, StatusBar } from "react-native";

import {
  Text,
} from "native-base";

import PostSummary from "./PostSummary.js";

export default function Home({ navigation }) {
  const [updates, setUpdates] = useState(undefined);

  const BACKEND_ENDPOINT = 'http://178.62.116.172:8000/posts';

  async function updatePosts() {
    try {
      let response = await fetch(BACKEND_ENDPOINT, {
        method: 'GET',
      });
      let json = await response.json();
      console.warn("Got JSON!");
      console.warn(json);
      setUpdates(json);
      console.log(updates);
    } catch (error) {
      console.warn(error);
    }
  }

  // Update the shown posts every 15 seconds
  useEffect(() => {
    if (updates === undefined) {
      updatePosts();
    }
    const interval = setInterval(() => {
      updatePosts();
    }, 15000);
    return () => clearInterval(interval);
  }, [updates]);

  if (updates === undefined) {
    return (
      <Text>Loading (or stuck)...</Text>
    )
  }

  const postSummaries = updates.map(update => (
        <PostSummary
          title={update.title}
          summary={update.summary}
          date={new Date(update.created_at)}
        />
      ))

  return (
    <>{postSummaries}</>
  );
}
