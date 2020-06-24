import { AsyncStorage, Platform } from "react-native";
import Constants from "expo-constants";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as WebBrowser from "expo-web-browser";

import api from "../util/api.js";
import { deleteAsync } from "expo-file-system";

const SAVED_DOWNLOAD = "SAVED_DOWNLOAD";
const DOWNLOAD_FOLDER =
  (Constants.manifest.env && Constants.manifest.env.DOWNLOAD_FOLDER) ||
  "Downloaded guidelines";
const INTERNAL_DOWNLOAD_FOLDER = FileSystem.documentDirectory + "Downloads/";

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

/**
 * Returns a canonical name for a file
 * @param {string} name - The name of the file
 * @param {number} id - The ID of the file obtained from the API or otherwise
 */
function canonicalFileName(name, id) {
  if (!name.includes(".", 1)) {
    return name + id;
  }
  let s = name.split(".");
  let extension = s.pop();
  return s.join(".") + " ID" + id + "." + extension;
}

/**
 * Downloads a file from the supplied URL to a media folder
 * @param {string} url - URL of the downloaded file
 * @param {number} id - ID of the downloaded file obtained from the API or otherwise
 * @param {string} name - Name of the downloaded file
 * @param {string} folderName - Name of the target folder inside the root media library
 * @returns {boolean} - True on success, false on failure
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
 * Checks for the existence of a file
 * @param {string} uri - The URI of the file
 * @returns {boolean} - The boolean value indicating whether the file exists
 */
export async function fileExists(uri) {
  const { exists } = await FileSystem.getInfoAsync(uri);
  return exists;
}

/**
 * Opens a file that might be only stored on a server
 * @param {string} url - URL the file is located at
 * @param {number} id - ID of the accessed file as supplied by the API
 * @param {string} name - Name of the opened file
 */
export async function downloadAndOpenFile(url, id, name) {
  if (Platform.OS == "ios") {
    // TODO
    await WebBrowser.openBrowserAsync(url);
    return;
  }

  // Construct the cache path for the file
  let fileName = canonicalFileName(name, id);
  let cacheUri = FileSystem.cacheDirectory + fileName;

  if (!(await fileExists(cacheUri))) {
    // Download the file to cache if it does not exist already
    await FileSystem.downloadAsync(url, cacheUri);
  }

  openLocalFile(uri);
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
    // TODO
    console.warn("Opening local files not (yet) implemented for iOS");
  }
}

/**
 * Computes the cummulative size of the directory at the given uri
 * @param {string} uri - The URI of the examined directory
 * @returns {number} - The size of the directory and its contents in bytes
 */
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

/**
 * Converts value in bytes to string with appropriate units
 * @param {number} bytes - The converted quantity of bytes
 * @returns {string} - The human-readable value with units
 */
function toHumanReadableInformationUnits(bytes) {
  const units = ["B", "kB", "MB", "GB", "TB"];
  let currentUnit;
  let currentBytesPerUnit = 1;

  // Test which unit fits best
  for (let unit of units) {
    currentUnit = unit;
    const newBytesPerUnit = currentBytesPerUnit * 1000;
    if (bytes < newBytesPerUnit) {
      // Using bigger unit would result in result less then 1, break
      break;
    }
    currentBytesPerUnit = newBytesPerUnit;
  }

  let result = bytes / currentBytesPerUnit;

  // Only take two decimal places
  result = +result.toFixed(2);

  // Separate value and units by a non-breaking space
  return `${result}\u00a0${currentUnit}`;
}

/**
 * Reports free space on the disk in a human-readable format
 * @returns {string} - The free space on the disk
 */
export async function getHumanReadableFreeDiskStorage() {
  const capacity = await FileSystem.getFreeDiskStorageAsync();

  return toHumanReadableInformationUnits(capacity);
}

/**
 * Reports space occupied by the document directory in a human-readable format
 * @returns {string} - The space occupied by the document directory
 */
export async function getHumanReadableAppOccupiedStorage() {
  const documentDirectory = FileSystem.documentDirectory;
  const size = await getCummulativeDirectorySize(FileSystem.documentDirectory);
  if (size === null) {
    return "???";
  }

  return toHumanReadableInformationUnits(size);
}

/**
 * Creates a folder used for offline files storage
 */
export async function createInternalDownloadFolder() {
  const info = await FileSystem.getInfoAsync(INTERNAL_DOWNLOAD_FOLDER);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(INTERNAL_DOWNLOAD_FOLDER);
  }
}

/**
 * Deletes a folder used for offline files storage
 */
export async function deleteInternalDownloadFolder() {
  await FileSystem.deleteAsync(INTERNAL_DOWNLOAD_FOLDER, { idempotent: true });
}

/**
 * Audits the files stored in the internal download folder
 * Deletes invalid files
 * Returns a list of files to download
 * @param {[Object]} files - The array of files that should be saved on the disk
 * @returns {[Object]} - The array of files that need to be downloaded
 */
export async function auditDownloads(files) {
  if (!fileExists(INTERNAL_DOWNLOAD_FOLDER)) {
    console.warn("Attempting to audit nonexistent internal downloads folder!");
    return [];
  }

  const previousDownloadUri = await getInterruptedDownload();
  if (previousDownloadUri) {
    // Erase corrupted file from a previous download
    try {
      await FileSystem.deleteAsync(previousDownloadUri, { idempotent: true });
    } catch (error) {
      console.warn("Failed to clear file from interrupted download:");
      console.warn(error);
    }
    await eraseSavedDownload();
  }

  // Get a array of files stored in the internal downloads directory
  let localFiles;
  try {
    localFiles = await FileSystem.readDirectoryAsync(INTERNAL_DOWNLOAD_FOLDER);
  } catch (error) {
    console.warn("Failed to enumerate internal download directory:");
    console.warn(error);
    // Cannot proceed if the contents of the directory are unknown
    return [];
  }
  const expectedFiles = files.map((f) => canonicalFileName(f.name, f.id));

  // Check which files are not expected to be stored
  const filesToDelete = localFiles.filter((fn) => !expectedFiles.includes(fn));

  // Delete them
  for (let deleteFilename of filesToDelete) {
    const uri = INTERNAL_DOWNLOAD_FOLDER + deleteFilename;
    try {
      await FileSystem.deleteAsync(uri);
    } catch (error) {
      console.warn(`Failed to delete file ${deleteFilename}:`);
      console.warn(error);
      // No need to return, can just carry on
    }
  }

  // Return the array of files that need to be downloaded
  return files.filter(
    (f) => !localFiles.includes(canonicalFileName(f.name, f.id))
  );
}

/**
 * Retrieves the saved download that was unexpectedly interrupted.
 * @returns {Object|null} - The saved download on success, null on error or if no download is saved.
 */
export async function getInterruptedDownload() {
  let json;
  try {
    json = await AsyncStorage.getItem(SAVED_DOWNLOAD);
  } catch (error) {
    console.warn(`Error while fetching saved download ${error}`);
    return null;
  }
  return json ? JSON.parse(json) : null;
}

/**
 * Saves the target URI of a started download.
 * @param {string} saveUri - Target URI of the download.
 */
export async function saveStartedDownload(saveUri) {
  const json = JSON.stringify(saveUri);
  try {
    await AsyncStorage.setItem(SAVED_DOWNLOAD, json);
  } catch (error) {
    console.warn(`Error saving download ${error}`);
  }
}

/**
 * Erases the saved download.
 */
export async function eraseSavedDownload() {
  try {
    AsyncStorage.removeItem(SAVED_DOWNLOAD);
  } catch (error) {
    console.warn(`Error erasing saved download ${error}`);
  }
}

/**
 * Downloads a file to the internal dowloads folder
 * @param {Object} file - Object describing file to be downloaded
 * @param {number} file.id - The ID of the file
 * @param {string} file.name - The name of the file
 * @param {function} onProgress - Callback for download progress tracking
 */
export async function downloadInternal(file, onProgress) {
  console.warn(`Downloading ${file.name}`);
  const saveUri =
    INTERNAL_DOWNLOAD_FOLDER + canonicalFileName(file.name, file.id);
  // TODO: Consider moving file url construction to the API library
  const url = api.baseUrl + "/api/rawfiles/download/" + file.id;
  const download = FileSystem.createDownloadResumable(
    url,
    saveUri,
    {},
    (downloadProgress) => {
      onProgress(
        downloadProgress.totalBytesWritten /
          downloadProgress.totalBytesExpectedToWrite
      );
    }
  );
  /* Save target URI of the started download so that after failure,
     the corrupted file can be deleted even after application restart. */
  await saveStartedDownload(saveUri);
  try {
    await download.downloadAsync();
  } catch (error) {
    console.warn(`Error downloading file from ${url} to internal downloads:`);
    console.warn(error);

    // Clean up after unfinished download
    try {
      await deleteAsync(saveUri, { idempotent: true });
    } catch (error) {
      console.warn("Error cleaning up after unfinished download:");
      console.warn(error);
    }
  }
  // Download finished without the app being interrupted, erase the URI
  await eraseSavedDownload();
}
