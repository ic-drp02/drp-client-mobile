import { AsyncStorage } from "react-native";

import { eraseOfflineFavourites } from "./favourites.js";
import {
  createInternalDownloadFolder,
  deleteInternalDownloadFolder,
} from "./files.js";

const SETTINGS = "SETTINGS";

export const SETTINGS_OPTIONS = Object.freeze({
  STORE_FAVOURITES_OFFLINE: "STORE_FAVOURITES_OFFLINE",
  STORE_FILES: "STORE_FILES",
  DOWNLOAD_FILES_EXPENSIVE: "DOWNLOAD_FILES_EXPENSIVE",
});

export const DEFAULT_VALUES = Object.freeze({
  STORE_FAVOURITES_OFFLINE: false,
  STORE_FILES: false,
  DOWNLOAD_FILES_EXPENSIVE: false,
});

export const ON_SETTINGS_CHANGE = Object.freeze({
  STORE_FAVOURITES_OFFLINE: onStoreFavouritesOfflineChange,
  STORE_FILES: onStoreFilesChange,
});

function onStoreFavouritesOfflineChange(newValue) {
  if (!newValue) {
    // Erase all offline favourites on disabling
    eraseOfflineFavourites();
  }
}

function onStoreFilesChange(newValue) {
  if (newValue) {
    // Create downloads folder on enabling
    createInternalDownloadFolder();
  } else {
    // Delete downloads folder on disabling
    deleteInternalDownloadFolder();
  }
}

/**
 * Initializes and returns all settings. Should be called before using the setting system.
 * @returns {Object|null} - The initialized settings on success, null on failure
 */
export async function initSettingsStorage() {
  const settings = await getSettingsStorage();
  if (!settings) {
    return null;
  }

  // Preload settings with the default values for unset options
  for (let [key, _] of Object.entries(SETTINGS_OPTIONS)) {
    if (settings[key] === undefined) {
      const value = DEFAULT_VALUES[key];
      // Option is unset, set it to default value
      if (value === undefined) {
        console.warn(
          `Default value for settings option ${key} is not specified!`
        );
      }
      settings[key] = value;
      const onChange = ON_SETTINGS_CHANGE[key];
      if (onChange) {
        onChange(value);
      }
    }
  }

  // Remove settings values that are no longer valid
  for (let [key, _] of Object.entries(settings)) {
    if (!SETTINGS_OPTIONS.hasOwnProperty(key)) {
      delete settings[key];
    }
  }

  return await saveSettingsStorage(settings);
}

/**
 * Retrieves the current settings.
 * @returns {Object|null} - The settings object on success, null on failure
 */
export async function getSettingsStorage() {
  let json;
  try {
    json = await AsyncStorage.getItem(SETTINGS);
  } catch (error) {
    console.warn(`Error while fetching settings ${error}`);
    return null;
  }
  return json ? JSON.parse(json) : {};
}

/**
 * Updates the settings of multiple settings options.
 * @param {Object} newSettings - The object mapping options to new settings.
 * @returns {(Object|null)} - The saved settings on success, null on failure
 */
export async function updateSettingsStorage(newSettings) {
  const settings = await getSettingsStorage();
  if (!settings) {
    return null;
  }

  for (let [key, _] of Object.entries(newSettings)) {
    if (!SETTINGS_OPTIONS.hasOwnProperty(key)) {
      console.warn(`Attempting to set invalid option ${option}.`);
      continue;
    }
    const value = newSettings[key];
    settings[key] = value;
    const onChange = ON_SETTINGS_CHANGE[key];
    if (onChange) {
      onChange(value);
    }
  }
  return await saveSettingsStorage(settings);
}

/**
 * Saves new settings.
 * @param {Object} settings - The object with all settings
 * @returns {(Object|null)} - The saved settings on success, null on failure
 */
async function saveSettingsStorage(settings) {
  const json = JSON.stringify(settings);
  try {
    await AsyncStorage.setItem(SETTINGS, json);
  } catch (error) {
    console.warn(`Error while saving settings: ${error}`);
    return null;
  }
  return settings;
}
