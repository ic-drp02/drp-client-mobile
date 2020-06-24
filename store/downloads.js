import { auditDownloads, downloadInternal } from "../util/internalDownloads";
import { SETTINGS_OPTIONS } from "../util/settingsOptions";
import DOWNLOAD_STATUS from "../util/downloadStatus";

const REFRESH_FILES_BEGIN = "REFRESH_FILES_BEGIN";
const REQUEST_AUDIT = "REQUEST_AUDIT";
const AUDIT_DONE = "AUDIT_DONE";
const REFRESH_FILES_ABORT = "REFRESH_FILES_ABORT";
const FILE_DOWNLOAD_PROGRESS = "FILE_DOWNLOAD_PROGRESS";
const FILE_DOWNLOAD_DONE = "FILE_DOWNLOAD_DONE";
const REFRESH_FILES_DONE = "REFRESH_FILES_DONE";

const initialState = {
  auditRequested: false,
  toDownload: [],
  currentDownloadProgress: 0,
  status: DOWNLOAD_STATUS.DONE,
};

function refreshFilesBegin() {
  return { type: REFRESH_FILES_BEGIN };
}

function requestAudit() {
  return { type: REQUEST_AUDIT };
}

function auditDone(toDownload) {
  return { type: AUDIT_DONE, toDownload };
}

export function refreshFilesAbort(status) {
  return { type: REFRESH_FILES_ABORT, status };
}

function fileDownloadProgress(progress) {
  return { type: FILE_DOWNLOAD_PROGRESS, progress };
}

function fileDownloadDone() {
  return { type: FILE_DOWNLOAD_DONE };
}

function refreshFilesDone() {
  return { type: REFRESH_FILES_DONE };
}

function getFilesFromFavourites(favourites) {
  return [].concat.apply(
    [],
    favourites.map((f) => f.files)
  );
}

/**
 * Refreshes the files downloaded on the disk
 */
export function refreshDownloads() {
  return async function (dispatch, getState) {
    console.warn("Starting refresh");
    if (getState().downloads.status == DOWNLOAD_STATUS.IN_PROGRESS) {
      // Download is in progress, raise audit request and exit
      console.warn("Requesting audit");
      dispatch(requestAudit());
      return;
    }

    dispatch(refreshFilesBegin());

    console.warn("Performing initial audit");
    // Perform the initial audit to determine the files to download
    let files = getFilesFromFavourites(getState().posts.favourites);
    let toDownload = await auditDownloads(files);
    dispatch(auditDone(toDownload));

    while (toDownload.length > 0) {
      if (!getState().settings.settings[SETTINGS_OPTIONS.STORE_FILES]) {
        // If storing files is disabled, abort further downloads
        dispatch(refreshFilesAbort(DOWNLOAD_STATUS.DONE));
        return;
      }

      if (!getState().connection.isInternetReachable) {
        // No internet connection
        dispatch(refreshFilesAbort(DOWNLOAD_STATUS.NO_CONNECTION));
        return;
      }

      if (
        !getState().settings.settings[
          SETTINGS_OPTIONS.DOWNLOAD_FILES_EXPENSIVE
        ] &&
        getState().connection.isExpensive
      ) {
        // Disallowed expensive internet connection
        dispatch(refreshFilesAbort(DOWNLOAD_STATUS.EXPENSIVE_CONNECTION));
        return;
      }

      // Perform the next download
      await downloadInternal(toDownload.pop(), (progress) => {
        dispatch(fileDownloadProgress(progress));
      });

      console.warn("Download done");

      dispatch(fileDownloadDone());

      if (getState().downloads.auditRequested) {
        // Audit downloads if an audit has been requested
        console.warn("Performing audit");
        files = getFilesFromFavourites(getState().posts.favourites);
        toDownload = await auditDownloads(files);

        dispatch(auditDone(toDownload));
      }
    }

    console.warn("Refresh done");
    dispatch(refreshFilesDone());
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REFRESH_FILES_BEGIN:
      return {
        ...state,
        status: DOWNLOAD_STATUS.IN_PROGRESS,
      };

    case REQUEST_AUDIT:
      return {
        ...state,
        auditRequested: true,
      };

    case AUDIT_DONE:
      return {
        ...state,
        auditRequested: false,
        toDownload: action.toDownload.slice(),
      };

    case REFRESH_FILES_ABORT:
      const toDownload =
        action.status == DOWNLOAD_STATUS.DONE ? [] : state.toDownload;
      return {
        ...state,
        toDownload: toDownload,
        currentDownloadProgress: 0,
        status: action.status,
      };

    case FILE_DOWNLOAD_PROGRESS:
      return {
        ...state,
        currentDownloadProgress: action.progress,
      };

    case FILE_DOWNLOAD_DONE:
      return {
        ...state,
        toDownload: state.toDownload.slice(0, -1),
        currentDownloadProgress: 0,
      };

    case REFRESH_FILES_DONE:
      return {
        ...state,
        status: DOWNLOAD_STATUS.DONE,
      };

    default:
      return state;
  }
}
