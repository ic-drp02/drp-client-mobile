import * as FileSystem from "expo-file-system";

export const INTERNAL_DOWNLOAD_FOLDER =
  FileSystem.documentDirectory + "Downloads/";

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
export function canonicalFileName(name, id) {
  if (!name.includes(".", 1)) {
    return name + id;
  }
  let s = name.split(".");
  let extension = s.pop();
  let filename = s.join(".") + " ID" + id + "." + extension;

  // Replace all spaces in filename by underscores so that iOS doesn't complain
  return filename.replace(/ /g, "_");
}

/**
 * Checks for the existence of a file
 * @param {string} uri - The URI of the file
 * @returns {Promise} - Promise resolving to boolean value indicating whether the file exists
 */
export async function fileExists(uri) {
  let exists = null;
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info) {
      exists = info.exists;
    } else {
      console.warn(`Error checking existence of ${uri}, info is:`);
      console.warn(info);
    }
  } catch (error) {
    console.warn(`Error checking existence of ${uri}:`);
    console.warn(error);
  }
  return exists;
}

/**
 * Computes the cummulative size of the directory at the given uri
 * @param {string} uri - The URI of the examined directory
 * @returns {Promise} - Promise representing the size of the directory and its contents in bytes
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
 * Reports space occupied by the document directory in a human-readable format
 * @returns {Promise} - Promise representing space occupied by the document directory
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
 * Reports free space on the disk in a human-readable format
 * @returns {Promise} - Promise representing the free space on the disk
 */
export async function getHumanReadableFreeDiskStorage() {
  const capacity = await FileSystem.getFreeDiskStorageAsync();

  return toHumanReadableInformationUnits(capacity);
}
