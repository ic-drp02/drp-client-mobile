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

export async function pushRecentPost(id) {
  let recents = await getRecentPosts();

  const existing = recents.indexOf(id);
  if (existing > -1) {
    recents.splice(existing, 1);
  }

  recents.unshift(id);
  recents = recents.slice(0, Math.min(recents.length, 10));

  await saveRecents(recents);

  return recents;
}

export async function removeRecentPost(id) {
  const recents = await getRecentPosts();
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
