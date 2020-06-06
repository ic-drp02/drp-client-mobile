import React from "react";

import PostSummary from "./PostSummary";

export default function PostsList({ posts, limit }) {
  return posts
    .slice(0, Math.min(posts.length, limit || posts.length))
    .map((post) => (
      <PostSummary
        key={post.id}
        id={post.id}
        title={post.title}
        summary={post.summary}
        files={post.files}
        date={new Date(post.created_at)}
      />
    ));
}
