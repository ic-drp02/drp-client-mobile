import React, { useState, useEffect } from "react";

import { Spinner } from "native-base";

import PostSummary from "./PostSummary.js";

import { COLOR_PRIMARY } from "../util/colors.js";

export default function Home({ navigation }) {
  const [updates, setUpdates] = useState(undefined);

  const BACKEND_ENDPOINT = "http://178.62.116.172:8000/posts";

  async function updatePosts() {
    try {
      let response = await fetch(BACKEND_ENDPOINT, {
        method: "GET",
      });
      let json = await response.json();
      setUpdates(json);
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
