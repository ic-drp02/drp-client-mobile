import { AsyncStorage } from "react-native";

const FAVOURITE_IDS = "FAVOURITE_IDS";
const OFFLINE_FAVOURITE_POSTS = "OFFLINE_FAVOURITE_POSTS";

/**
 * Returns a map mapping post IDs of favourite posts to revision IDs of last viewed revisions.
 * @param {Object[]} ids - List of objects with IDs of favourite posts.
 * @param {number} ids[].postId - The post ID of a favourite post.
 * @param {number} ids[].revisionId - The ID of the last revision of a post viewed by the user.
 */
export function buildPostIdToRevIdMap(ids) {
  const postIdToRevId = {};
  ids.forEach(
    ({ postId, revisionId }) => (postIdToRevId[postId.toString()] = revisionId)
  );
  return postIdToRevId;
}

/**
 *
 * @param {Object[]} ids - List of objects with IDs of favourite posts.
 * @param {number} postId - Post ID of the post whose most recently viewed revision is to be looked up.
 */
export function lookupRevIdByPostId(ids, postId) {
  const map = buildPostIdToRevIdMap(ids);
  return map[postId];
}

/**
 * Returns an array of post IDs of the favourite posts.
 * @param {Object[]} ids - List of objects with IDs of favourite posts.
 * @param {number} ids[].postId - The post ID of a favourite post.
 */
export function getPids(ids) {
  return ids.map((p) => p.postId);
}

/**
 * Returns true if a post with supplied ID is favourite, false otherwise
 * @param {number} id - Post ID of the checked post
 */
export async function isFavourite(id) {
  const favouriteIds = await getFavouriteIds();
  return getPids(favouriteIds).includes(id);
}

/**
 * Retrieves the list of favourites.
 */
export async function getFavouriteIds() {
  let json;
  try {
    json = await AsyncStorage.getItem(FAVOURITE_IDS);
  } catch (error) {
    console.warn(`Error retrieving favourite posts IDs ${error}`);
    return [];
  }
  return json ? JSON.parse(json) : [];
}

/**
 * Saves the list of favourites.
 * @param {Object[]} favourites - The list of the saved favourite posts.
 * @param {number} favourites[].postId - The post ID of a favourite post.
 * @param {number} favourites[].revisionId - The revision ID of a favourite post.
 */
export async function saveFavouriteIds(favourites) {
  const json = JSON.stringify(favourites);
  try {
    await AsyncStorage.setItem(FAVOURITE_IDS, json);
  } catch (error) {
    console.warn(`Error saving favourite posts IDs ${error}`);
  }
}

/**
 * Saves the post with the supplied IDs to the favourite posts.
 * @param {number} postId - The post ID of the added post.
 * @param {number} revisionId - The revision ID of the added post.
 */
export async function addFavouriteId(postId, revisionId) {
  const favourites = await getFavouriteIds();
  favourites.push({ postId: postId, revisionId: revisionId });
  await saveFavouriteIds(favourites);
}

/**
 * Removes the post with the supplied ID from the favourite posts.
 * @param {number} postId - The post ID of the removed post.
 */
export async function removeFavouriteId(postId) {
  let favourites = await getFavouriteIds();
  favourites = favourites.filter((p) => p.postId !== postId);
  await saveFavouriteIds(favourites);
}

/**
 * Records newly viewed revision of a favourite post. Does nothing if the post is not favourite or if the revision ID is old.
 * @param {number} postId - The post ID of the added post.
 * @param {number} revisionId - The ID of the revision that was last viewed by the user.
 */
export async function updateFavouriteId(postId, revisionId) {
  let favourites = await getFavouriteIds();
  if (
    getPids(favourites).includes(postId) &&
    lookupRevIdByPostId(favourites, postId) < revisionId
  ) {
    favourites = favourites.filter((p) => p.postId !== postId);
    favourites.push({ postId: postId, revisionId: revisionId });
    await saveFavouriteIds(favourites);
  }
}

/**
 * Saves the list of favourite posts to AsyncStorage for offline usage.
 * @param {[Object]} favourites - List of favourites
 */
export async function saveOfflineFavourites(favourites) {
  const json = JSON.stringify(favourites);
  try {
    await AsyncStorage.setItem(OFFLINE_FAVOURITE_POSTS, json);
  } catch (error) {
    console.warn(`Error saving favourite posts ${error}`);
  }
}

/**
 * Retrieves the list of posts saved in AsyncStorage for offline usage.
 */
export async function getOfflineFavourites() {
  let json;
  try {
    json = await AsyncStorage.getItem(OFFLINE_FAVOURITE_POSTS);
  } catch (error) {
    console.warn(`Error retrieveing favourite posts ${error}`);
    return null;
  }
  return json ? JSON.parse(json) : null;
}

/**
 * Erases all favourite posts saved for offline usage.
 */
export async function eraseOfflineFavourites() {
  try {
    AsyncStorage.removeItem(OFFLINE_FAVOURITE_POSTS);
  } catch (error) {
    console.warn(`Error erasing favourite posts ${error}`);
  }
}
