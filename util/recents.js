import { AsyncStorage } from "react-native";

export async function getRecentPosts() {
  const json = await AsyncStorage.getItem("RECENT_POSTS");
  if (!json) {
    await saveRecents([]);
    return [];
  } else {
    return JSON.parse(json);
  }
}

export async function pushRecentPost(pId, rId) {
  let recents = await getRecentPosts();
  let recentPids = recents.map((p) => p.postId);

  const existing = recentPids.indexOf(pId);
  if (existing > -1) {
    recents.splice(existing, 1);
  }

  recents.unshift({ postId: pId, revisionId: rId });
  recents = recents.slice(0, Math.min(recents.length, 10));

  await saveRecents(recents);

  return recents;
}

export async function removeRecentPost(id) {
  const recents = await getRecentPosts();
  let recentPids = recents.map((p) => p.postId);
  const index = recents.indexOf(id);
  if (index > -1) {
    recents.splice(index, 1);
    await saveRecents(recents);
  }
  return recents;
}

async function saveRecents(recents) {
  const json = JSON.stringify(recents);
  await AsyncStorage.setItem("RECENT_POSTS", json);
}
