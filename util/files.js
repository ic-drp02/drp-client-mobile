import Constants from "expo-constants";
import { Platform } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as WebBrowser from "expo-web-browser";

const DOWNLOAD_FOLDER =
  (Constants.manifest.env && Constants.manifest.env.DOWNLOAD_FOLDER) ||
  "Downloaded guidelines";

export function getExtension(filename) {
  if (!filename.includes(".", 1)) {
    return "";
  }
  let s = filename.split(".");
  return "." + s.pop();
}

export function getExtensionNoDot(filename) {
  const extension = getExtension(filename);
  if (extension.includes(".")) {
    return extension.substr(1);
  }
  return extension;
}

function appendToName(filename, append) {
  if (!filename.includes(".", 1)) {
    return filename + append;
  }
  let s = filename.split(".");
  extension = s.pop();
  return s.join(".") + " ID" + append + "." + extension;
}

async function download(url, saveUri, cacheOnly) {
  await FileSystem.downloadAsync(url, saveUri);

  if (!cacheOnly) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(saveUri);
      return await MediaLibrary.createAlbumAsync(DOWNLOAD_FOLDER, asset, false);
    }
    return false;
  }
  return true;
}

/**
 * Downloads file from the specified url
 */
export async function downloadFile(url, id, name, cacheOnly) {
  let saveName = appendToName(name, id);
  let cacheUri = FileSystem.cacheDirectory + saveName;

  return await download(url, cacheUri, cacheOnly);
}

export async function fileExists(uri) {
  const { exists } = await FileSystem.getInfoAsync(uri);
  return exists;
}

export async function openFile(url, id, name) {
  if (Platform.OS == "ios") {
    // TODO
    WebBrowser.openBrowserAsync(url);
  }

  let fileName = appendToName(name, id);
  let cacheUri = FileSystem.cacheDirectory + fileName;

  if (!(await fileExists(cacheUri))) {
    await download(url, cacheUri, true);
  }

  const uri = await FileSystem.getContentUriAsync(cacheUri);
  if (Platform.OS == "android") {
    IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      data: uri,
      flags: 1,
    });
  } else {
    // TODO
  }
}
