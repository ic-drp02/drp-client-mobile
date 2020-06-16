import React from "react";

import PostSummary from "./PostSummary";

export default function PostsList({ posts, limit, showAttachments, markOld }) {
  return posts
    .slice(0, Math.min(posts.length, limit || posts.length))
    .map((post) => (
      <PostSummary
        key={post.id}
        post={post}
        showAttachments={showAttachments}
        markOld={markOld}
      />
    ));
}
