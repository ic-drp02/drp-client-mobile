import {
  initSettingsStorage,
  updateSettingsStorage,
  processCallbacks,
} from "../util/settings.js";
import { DEFAULT_VALUES } from "../util/settingsOptions.js";

import { showSnackbar, hideSnackbar } from "./snackbar";

const INIT_SETTINGS_BEGIN = "INIT_SETTINGS_BEGIN";
const INIT_SETTINGS_COMMIT = "INIT_SETTINGS_COMMIT";
const INIT_SETTINGS_DONE = "INIT_SETTINGS_DONE";
const UPDATE_SETTINGS_BEGIN = "UPDATE_SETTINGS_BEGIN";
const UPDATE_SETTINGS_COMMIT = "UPDATE_SETTINGS_COMMIT";
const UPDATE_SETTINGS_DONE = "UPDATE_SETTINGS_DONE";

const initialState = {
  settings: null,
  loading: true,
  initialized: false,
};

function initSettingsBegin() {
  return { type: INIT_SETTINGS_BEGIN };
}

function initSettingsCommit(settings) {
  return { type: INIT_SETTINGS_COMMIT, settings };
}

function initSettingsDone() {
  return { type: INIT_SETTINGS_DONE };
}

/**
 * Initializes the settings storage.
 */
export function initSettings() {
  return async function (dispatch, getState) {
    dispatch(initSettingsBegin());
    const initializedSettings = await initSettingsStorage();
    if (!initializedSettings) {
      dispatch(
        showSnackbar(
          "Failed to initialize settings, default values will be applied!",
          5000,
          {
            label: "hide",
            onPress: () => dispatch(hideSnackbar()),
          }
        )
      );
      dispatch(initSettingsCommit(DEFAULT_VALUES));
      return;
    }

    dispatch(initSettingsCommit(initializedSettings.settings));

    // Process settings callbacks
    await processCallbacks(
      initializedSettings.changedSettings,
      getState,
      dispatch
    );

    dispatch(initSettingsDone());
  };
}

function updateSettingsBegin() {
  return { type: UPDATE_SETTINGS_BEGIN };
}

function updateSettingsCommit(settings) {
  return { type: UPDATE_SETTINGS_COMMIT, settings };
}

function updateSettingsDone() {
  return { type: UPDATE_SETTINGS_DONE };
}

/**
 * Updates the settings of multiple settings options.
 * @param {Object} newSettings - The object mapping options to new settings.
 */
export function updateSettings(settings) {
  return async function (dispatch, getState) {
    if (getState().settings.loading) {
      console.warn(
        "A potential race condition on updating settings was detected and " +
          "the offending update request was blocked. Please fix " +
          "the code so that it does not attempt to perform further " +
          "settings updates while the previous update is pending. " +
          "The loading flag from the store may be helpful."
      );
      return;
    }
    dispatch(updateSettingsBegin());

    const newSettings = await updateSettingsStorage(settings);

    if (!newSettings) {
      dispatch(
        showSnackbar("Failed to save settings, no changes applied!", 5000, {
          label: "hide",
          onPress: () => dispatch(hideSnackbar()),
        })
      );
      dispatch(updateSettingsDone());
      return;
    }

    dispatch(updateSettingsCommit(newSettings));

    // Process settings callbacks
    await processCallbacks(settings, getState, dispatch);

    dispatch(updateSettingsDone());
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INIT_SETTINGS_BEGIN:
    case UPDATE_SETTINGS_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case INIT_SETTINGS_COMMIT:
    case UPDATE_SETTINGS_COMMIT:
      return {
        ...state,
        settings: action.settings,
      };

    case INIT_SETTINGS_DONE:
    case UPDATE_SETTINGS_DONE:
      return {
        ...state,
        loading: false,
        initialized: true,
      };

    default:
      return state;
  }
}
