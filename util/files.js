import { Platform } from "react-native";
import Constants from "expo-constants";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as WebBrowser from "expo-web-browser";
import * as Sharing from "expo-sharing";

import {
  canonicalFileName,
  fileExists,
  INTERNAL_DOWNLOAD_FOLDER,
} from "./fileUtils";
import { SETTINGS_OPTIONS } from "../util/settingsOptions";
import { showInfoSnackbar } from "../util/snackbar";
import store, { showSnackbar, hideSnackbar } from "../store";

const DOWNLOAD_FOLDER =
  (Constants.manifest.env && Constants.manifest.env.DOWNLOAD_FOLDER) ||
  "Downloaded guidelines";

/**
 * Downloads a file from the supplied URL to a media folder
 * @param {string} url - URL of the downloaded file
 * @param {number} id - ID of the downloaded file obtained from the API or otherwise
 * @param {string} name - Name of the downloaded file
 * @param {string} folderName - Name of the target folder inside the root media library
 * @returns {Promise} - Promise resolving to true on success, false on failure
 */
export async function downloadToMediaFolder(url, id, name, folderName) {
  let saveName = canonicalFileName(name, id);
  let cacheUri = FileSystem.cacheDirectory + saveName;

  try {
    await FileSystem.downloadAsync(url, cacheUri);
  } catch (error) {
    console.warn(`Error downloading from ${url}:`);
    console.warn(error);
    return false;
  }

  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status === "granted") {
    try {
      const asset = await MediaLibrary.createAssetAsync(cacheUri);
      const targetFolder = folderName ? folderName : DOWNLOAD_FOLDER;
      await MediaLibrary.createAlbumAsync(targetFolder, asset, false);
      return true;
    } catch (error) {
      console.warn(`Error saving file ${name} from ${url} to MediaLibrary:`);
      console.warn(error);
      return false;
    }
  }
  return false;
}

/**
 * Opens a file that might be only stored on a server
 * @param {string} url - URL the file is located at
 * @param {number} id - ID of the accessed file as supplied by the API
 * @param {Promise} name - Promise representing the name of the opened file
 */
export async function downloadAndOpenFile(url, id, name) {
  if (store.getState().connection.isInternetReachable && Platform.OS == "ios") {
    await WebBrowser.openBrowserAsync(url);
    return;
  }

  const filename = canonicalFileName(name, id);

  // Check if file isn't stored offline
  if (store.getState().settings.settings[SETTINGS_OPTIONS.STORE_FILES]) {
    const offlineUri = INTERNAL_DOWNLOAD_FOLDER + filename;
    if (await fileExists(offlineUri)) {
      openLocalFile(offlineUri);
      return;
    }
  }

  // Construct the cache path for the file
  let cacheUri = FileSystem.cacheDirectory + filename;

  if (!(await fileExists(cacheUri))) {
    if (!store.getState().connection.isInternetReachable) {
      showInfoSnackbar("This document cannot be accessed offline!");
      return;
    }
    showInfoSnackbar("Downloading...");

    // Download the file to cache if it does not exist already
    await FileSystem.downloadAsync(url, cacheUri);
  }

  openLocalFile(cacheUri);
}

/**
 * Opens a local file
 * @param {string} uri - The URI of the opened file
 */
export async function openLocalFile(uri) {
  if (Platform.OS == "android") {
    let contentUri;
    try {
      contentUri = await FileSystem.getContentUriAsync(uri);
    } catch (error) {
      console.warn(`Error getting content uri for ${uri}:`);
      console.warn(error);
    }
    IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      data: contentUri,
      flags: 1,
    });
  } else {
    let sharingPossible;
    try {
      sharingPossible = await Sharing.isAvailableAsync();
      if (!sharingPossible) {
        console.warn("Sharing is not possible on this device.");
        return;
      }
    } catch (error) {
      console.warn("Error determining whether sharing is possible:");
      console.warn(error);
      return;
    }
    try {
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.warn("Error sharing:");
      console.warn(error);
    }
  }
}
