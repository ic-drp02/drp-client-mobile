import { AsyncStorage } from "react-native";

import { eraseOfflineFavourites, saveOfflineFavourites } from "./favourites.js";
import {
  createInternalDownloadFolder,
  deleteInternalDownloadFolder,
} from "./internalDownloads.js";
import { SETTINGS_OPTIONS, DEFAULT_VALUES } from "./settingsOptions.js";
import DOWNLOAD_STATUS from "../util/downloadStatus";
import { refreshDownloads, refreshFilesAbort } from "../store/downloads.js";

const SETTINGS = "SETTINGS";

/*
 * Object storing functions to be called when a particular
   settings option is changed
 * These functions may be called in an arbitrary order
   when multiple settings are changed at once
 * The functions are called after the updates to the store
   and to the AsyncStorage have been completed
 * Note that while these functions are running, all changes
   to settings are blocked, so they should return
   in a reasonably short time
 */
const ON_SETTINGS_CHANGE = Object.freeze({
  STORE_FAVOURITES_OFFLINE: onStoreFavouritesOfflineChange,
  STORE_FILES: onStoreFilesChange,
  DOWNLOAD_FILES_EXPENSIVE: onDownloadFilesExpensiveChange,
});

async function onStoreFavouritesOfflineChange(newValue, getState) {
  if (newValue) {
    // Save all favourite posts on enabling
    await saveOfflineFavourites(getState().posts.favourites);
  } else {
    // Erase all offline favourites on disabling
    await eraseOfflineFavourites();
  }
}

async function onStoreFilesChange(newValue, getState, dispatch) {
  if (newValue) {
    // Create downloads folder
    await createInternalDownloadFolder();

    // Refresh files
    dispatch(refreshDownloads());
  } else {
    // Delete downloads folder on disabling
    await deleteInternalDownloadFolder();

    dispatch(refreshFilesAbort(DOWNLOAD_STATUS.DONE));
  }
}

function onDownloadFilesExpensiveChange(newValue, getState, dispatch) {
  if (newValue) {
    // Refresh files
    dispatch(refreshDownloads());
  }
}

/**
 * Initializes and returns all settings. Should be called before using the setting system.
 * @returns {Promise} - Promise encapsulating settings on success, null on failure
 */
export async function initSettingsStorage() {
  const settings = await getSettingsStorage();
  if (!settings) {
    return null;
  }

  const changedSettings = {};

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
      changedSettings[key] = value;
    }
  }

  // Remove settings values that are no longer valid
  for (let [key, _] of Object.entries(settings)) {
    if (!SETTINGS_OPTIONS.hasOwnProperty(key)) {
      delete settings[key];
    }
  }

  return {
    settings: await saveSettingsStorage(settings),
    changedSettings: changedSettings,
  };
}

/**
 * Retrieves the current settings.
 * @returns {Promise} - Promise that resolves to the settings object on success, null on failure
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
 * @returns {Promise} - Promise that resolves to the saved settings on success, null on failure
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
  }
  return await saveSettingsStorage(settings);
}

/**
 * Saves new settings.
 * @param {Object} settings - The object with all settings
 * @returns {Promise} - Promise that resolves to saved settings on success, null on failure
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

/**
 * Calls all onChange functions relevant to the settings change
 * @param {Object} newSettings - The object mapping options to new settings
 * @param {function} getState - Function allowing access to Redux state
 * @param {function} dispatch - The Redux store dispatch
 */
export async function processCallbacks(newSettings, getState, dispatch) {
  for (let [key, value] of Object.entries(newSettings)) {
    const onChange = ON_SETTINGS_CHANGE[key];
    if (onChange) {
      await onChange(value, getState, dispatch);
    }
  }
}
