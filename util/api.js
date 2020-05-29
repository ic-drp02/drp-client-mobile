import Constants from "expo-constants";

const API_SERVER_BASE =
  (Constants.manifest.env && Constants.manifest.EXPO_API_SERVER_BASE) ||
  "http://178.62.116.172/api";

export async function getPosts() {
  let response = await fetch(API_SERVER_BASE + "/posts");

  if (response.status != 200) {
    return { success: false, status: response.status };
  }

  return {
    success: true,
    data: await response.json(),
  };
}

export async function createPost({ title, summary, content }) {
  let response = await fetch(API_SERVER_BASE + "/posts", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      summary: summary,
      content: content,
    }),
  });

  if (response.status != 200) {
    return { success: false, status: response.status };
  }

  return {
    success: true,
    data: await response.json(),
  };
}

export async function getDetails(id) {
  let response = await fetch(API_SERVER_BASE + "/posts/" + id.toString());
  return await response.json();
}

export async function deletePost(id) {
  let response = await fetch(API_SERVER_BASE + "/posts/" + id.toString(), {
    method: "DELETE",
  });

  if (response.status != 204) {
    return { success: false, status: response.status };
  }

  return {
    success: true,
  };
}
