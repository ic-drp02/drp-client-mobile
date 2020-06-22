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
const INTERNAL_DOWNLOAD_FOLDER = FileSystem.documentDirectory + "Downloads";

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
  let extension = s.pop();
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
    await WebBrowser.openBrowserAsync(url);
    return;
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

export async function getCummulativeDirectorySize(uri) {
  let size = 0;
  let info = await FileSystem.getInfoAsync(uri, { size: true });
  if (!info) {
    console.warn("Error computing cummulative dir size");
    return null;
  }
  size += info.size;
  let contents = await FileSystem.readDirectoryAsync(uri);

  for (let entry of contents) {
    let info = await FileSystem.getInfoAsync(uri + entry, { size: true });
    if (!info) {
      console.warn("Error computing cummmulative dir size");
      return null;
    }
    if (info.isDirectory) {
      size += await getCummulativeDirectorySize(uri + entry + "/");
    } else {
      size += info.size;
    }
  }

  return size;
}

function toHumanReadableInformationUnits(bytes) {
  const units = ["B", "kB", "MB", "GB", "TB"];
  let currentUnit;
  let currentBytesPerUnit = 1;

  for (let unit of units) {
    currentUnit = unit;
    const newBytesPerUnit = currentBytesPerUnit * 1000;
    if (bytes < newBytesPerUnit) {
      break;
    }
    currentBytesPerUnit = newBytesPerUnit;
  }

  let result = bytes / currentBytesPerUnit;
  // Only take two decimal places
  result = +result.toFixed(2);

  return `${result}\u00a0${currentUnit}`;
}

export async function getHumanReadableFreeDiskStorage() {
  const capacity = await FileSystem.getFreeDiskStorageAsync();

  return toHumanReadableInformationUnits(capacity);
}

export async function getHumanReadableAppOccupiedStorage() {
  const documentDirectory = FileSystem.documentDirectory;
  const size = await getCummulativeDirectorySize(FileSystem.documentDirectory);
  if (size === null) {
    return "???";
  }

  return toHumanReadableInformationUnits(size);
}

export async function createInternalDownloadFolder() {
  const info = await FileSystem.getInfoAsync(INTERNAL_DOWNLOAD_FOLDER);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(INTERNAL_DOWNLOAD_FOLDER);
  }
}

export async function deleteInternalDownloadFolder() {
  await FileSystem.deleteAsync(INTERNAL_DOWNLOAD_FOLDER, { idempotent: true });
}
