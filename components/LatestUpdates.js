import React, { useState, useEffect } from "react";
import { Spinner } from "native-base";

import PostSummary from "./PostSummary.js";

import { COLOR_PRIMARY } from "../util/colors.js";

import * as api from "../api";

export default function Home({ navigation }) {
  const [updates, setUpdates] = useState(undefined);

  async function updatePosts() {
    try {
      setUpdates(await api.getPosts());
    } catch (error) {
      console.warn(error);
    }
  }

  // Update the shown posts every 15 seconds
  useEffect(() => {
    if (updates === undefined) {
      updatePosts();
    }
    const interval = setInterval(() => updatePosts(), 15000);
    return () => clearInterval(interval);
  }, [updates]);

  if (updates === undefined) {
    return <Spinner color={COLOR_PRIMARY} />;
  }

  const postSummaries = updates.map((update) => (
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
