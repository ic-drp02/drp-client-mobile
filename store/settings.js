import {
  initSettingsStorage,
  updateSettingsStorage,
  DEFAULT_VALUES,
} from "../util/settings.js";

import { showSnackbar, hideSnackbar } from "./snackbar";

const INIT_SETTINGS_DONE = "INIT_SETTINGS_DONE";
const UPDATE_SETTINGS_BEGIN = "UPDATE_SETTINGS_BEGIN";
const UPDATE_SETTINGS_FAILURE = "UPDATE_SETTINGS_FAILURE";
const UPDATE_SETTINGS_SUCCESS = "UPDATE_SETTINGS_SUCCESS";

const initialState = {
  settings: null,
  loading: true,
};

function initSettingsDone(settings) {
  return { type: INIT_SETTINGS_DONE, settings };
}

/**
 * Initializes the settings storage.
 */
export function initSettings() {
  return async function (dispatch) {
    const settings = await initSettingsStorage();
    if (!settings) {
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
      dispatch(initSettingsDone(DEFAULT_VALUES));
      return;
    }

    dispatch(initSettingsDone(settings));
  };
}

function updateSettingsBegin(settings) {
  return { type: UPDATE_SETTINGS_BEGIN, settings };
}

function updateSettingsFailure() {
  return { type: UPDATE_SETTINGS_FAILURE };
}

function updateSettingsSuccess(settings) {
  return { type: UPDATE_SETTINGS_SUCCESS, settings };
}

/**
 * Updates the settings of multiple settings options.
 * @param {Object} newSettings - The object mapping options to new settings.
 */
export function updateSettings(settings) {
  return async function (dispatch) {
    dispatch(updateSettingsBegin(settings));

    const newSettings = await updateSettingsStorage(settings);

    if (!newSettings) {
      dispatch(
        showSnackbar("Failed to save settings, no changes applied!", 5000, {
          label: "hide",
          onPress: () => dispatch(hideSnackbar()),
        })
      );
      dispatch(updateSettingsFailure());
      return;
    }

    dispatch(updateSettingsSuccess(newSettings));
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INIT_SETTINGS_DONE:
      return {
        settings: action.settings,
        loading: false,
      };

    case UPDATE_SETTINGS_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_SETTINGS_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case UPDATE_SETTINGS_SUCCESS:
      return {
        settings: action.settings,
        loading: false,
      };

    default:
      return state;
  }
}
