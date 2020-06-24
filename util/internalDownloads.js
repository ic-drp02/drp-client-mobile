import { AsyncStorage } from "react-native";
import * as FileSystem from "expo-file-system";

import {
  canonicalFileName,
  fileExists,
  INTERNAL_DOWNLOAD_FOLDER,
} from "./fileUtils";
import api from "../util/api.js";

const SAVED_DOWNLOAD = "SAVED_DOWNLOAD";

/**
 * Creates a folder used for offline files storage
 */
export async function createInternalDownloadFolder() {
  if (!(await fileExists(INTERNAL_DOWNLOAD_FOLDER))) {
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
 * @returns {Promise} - Promise resolving to the array of files that need to be downloaded
 */
export async function auditDownloads(files) {
  if (!(await fileExists(INTERNAL_DOWNLOAD_FOLDER))) {
    console.warn("Attempting to audit nonexistent internal downloads folder!");
    await createInternalDownloadFolder();
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
 * @returns {Promise} - Promise resolving to saved download on success, null on error or if no download is saved.
 */
async function getInterruptedDownload() {
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
 * @param {Promise} saveUri - Promise resolving to the target URI of the download.
 */
async function saveStartedDownload(saveUri) {
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
async function eraseSavedDownload() {
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
      await FileSystem.deleteAsync(saveUri, { idempotent: true });
    } catch (error) {
      console.warn("Error cleaning up after unfinished download:");
      console.warn(error);
    }
  }
  // Download finished without the app being interrupted, erase the URI
  await eraseSavedDownload();
}
