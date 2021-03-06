import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Appbar,
  Text,
  Title,
  Subheading,
  Portal,
  ProgressBar,
} from "react-native-paper";

import LabeledCheckbox from "../components/LabeledCheckbox.js";
import DangerConfirmationDialog from "../components/DangerConfirmationDialog.js";

import { updateSettings } from "../store";
import { SETTINGS_OPTIONS } from "../util/settingsOptions.js";
import DOWNLOAD_STATUS from "../util/downloadStatus";
import {
  getHumanReadableFreeDiskStorage,
  getHumanReadableAppOccupiedStorage,
} from "../util/fileUtils.js";

export default function Settings({ navigation }) {
  const fullHeight = { flex: 1 };

  const dispatch = useDispatch();
  const settings = useSelector((s) => s.settings.settings);
  const settingsLoading = useSelector((s) => s.settings.loading);
  const downloadStatus = useSelector((s) => s.downloads.status);
  const toDownload = useSelector((s) => s.downloads.toDownload).length;
  const currentDownloadProgress = useSelector(
    (s) => s.downloads.currentDownloadProgress
  );
  const storeFavouriteChecked =
    settings[SETTINGS_OPTIONS.STORE_FAVOURITES_OFFLINE];
  const storeFilesChecked = settings[SETTINGS_OPTIONS.STORE_FILES];
  const downloadExpensiveChecked =
    settings[SETTINGS_OPTIONS.DOWNLOAD_FILES_EXPENSIVE];

  const [confirmOfflineFavourite, setConfirmOfflineFavourite] = useState(false);
  const [confirmOfflineFiles, setConfirmOfflineFiles] = useState(false);
  const [freeDiskStorage, setFreeDiskStorage] = useState("???");
  const [appOccupiedStorage, setAppOccupiedStorage] = useState("???");

  async function checkDiskStorage() {
    setFreeDiskStorage(await getHumanReadableFreeDiskStorage());
    setAppOccupiedStorage(await getHumanReadableAppOccupiedStorage());
  }

  useEffect(() => {
    checkDiskStorage();
  }, [storeFilesChecked, toDownload]);

  function setStoreFavourite(value) {
    if (value) {
      dispatch(
        updateSettings({
          [SETTINGS_OPTIONS.STORE_FAVOURITES_OFFLINE]: true,
        })
      );
    } else {
      dispatch(
        updateSettings({
          [SETTINGS_OPTIONS.STORE_FAVOURITES_OFFLINE]: false,
          [SETTINGS_OPTIONS.STORE_FILES]: false,
          [SETTINGS_OPTIONS.DOWNLOAD_FILES_EXPENSIVE]: false,
        })
      );
    }
  }

  function setStoreFiles(value) {
    if (value) {
      dispatch(
        updateSettings({
          [SETTINGS_OPTIONS.STORE_FILES]: true,
        })
      );
    } else {
      dispatch(
        updateSettings({
          [SETTINGS_OPTIONS.STORE_FILES]: false,
          [SETTINGS_OPTIONS.DOWNLOAD_FILES_EXPENSIVE]: false,
        })
      );
    }
  }

  function setDownloadExpensive(value) {
    dispatch(
      updateSettings({
        [SETTINGS_OPTIONS.DOWNLOAD_FILES_EXPENSIVE]: value,
      })
    );
  }

  let downloadStatusMessage;
  let showProgress = false;
  const files = toDownload > 1 ? "files" : "file";
  switch (downloadStatus) {
    case DOWNLOAD_STATUS.IN_PROGRESS:
      if (toDownload > 0) {
        showProgress = true;
      }
      downloadStatusMessage =
        toDownload === 0
          ? "Finishing downloads..."
          : `Downloading ${toDownload} ${files}... You can continue to ` +
            "use your device normally.";
      break;

    case DOWNLOAD_STATUS.NO_CONNECTION:
      downloadStatusMessage =
        `No internet connection. The download  of ${toDownload} ${files} ` +
        "will resume after the connection is established.";
      break;

    case DOWNLOAD_STATUS.EXPENSIVE_CONNECTION:
      downloadStatusMessage =
        "Your device reported that it is using mobile or other expensive " +
        `internet connection. The download of ${toDownload} ${files} ` +
        "will resume after a cheaper connection is established.";
      break;

    case DOWNLOAD_STATUS.NO_FREE_SPACE:
      downloadStatusMessage =
        "It seems that your device is running out of storage space." +
        `The download of ${toDownload} ${files} will resume after more ` +
        "disk space is available.";
      break;

    case DOWNLOAD_STATUS.DONE:
      downloadStatusMessage = "Nothing to download";
      break;
  }

  return (
    <View style={fullHeight}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>
      <View style={fullHeight}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Title>Offline storage settings</Title>
          <Text>
            The ICON application document directory occupies{" "}
            {appOccupiedStorage}. The free space on your device is{" "}
            {freeDiskStorage}.
          </Text>

          <Subheading style={styles.subheading}>General</Subheading>
          <LabeledCheckbox
            label="Store favourites offline"
            checked={storeFavouriteChecked}
            disabled={settingsLoading}
            onPress={() => {
              if (storeFavouriteChecked) {
                setConfirmOfflineFavourite(true);
                return;
              }
              setStoreFavourite(true);
            }}
          />
          <View>
            <Portal>
              <DangerConfirmationDialog
                title="Disable storing favourites?"
                text={
                  "Are you sure you want to disable storing favourite posts on " +
                  "your device? This will delete saved posts and files that " +
                  "are stored within the ICON application and free the associated " +
                  "disk space."
                }
                dangerActionText="Disable"
                visible={confirmOfflineFavourite}
                onDangerConfirm={() => {
                  setConfirmOfflineFavourite(false);
                  setStoreFavourite(false);
                }}
                onCancel={() => setConfirmOfflineFavourite(false)}
              />
            </Portal>
          </View>

          <Subheading style={styles.subheading}>Files</Subheading>
          <LabeledCheckbox
            label="Store files attached to favourites"
            checked={storeFilesChecked}
            disabled={settingsLoading || !storeFavouriteChecked}
            onPress={() => {
              if (storeFilesChecked) {
                setConfirmOfflineFiles(true);
                return;
              }
              setStoreFiles(true);
            }}
          />
          <View>
            <Portal>
              <DangerConfirmationDialog
                title="Disable storing files?"
                text={
                  "Are you sure you want to disable storing files from your favourite " +
                  "posts on your device? This will delete saved files that are stored within " +
                  "the ICON application and free the associated disk space."
                }
                dangerActionText="Disable"
                visible={confirmOfflineFiles}
                onDangerConfirm={() => {
                  setConfirmOfflineFiles(false);
                  setStoreFiles(false);
                }}
                onCancel={() => setConfirmOfflineFiles(false)}
              />
            </Portal>
          </View>
          <LabeledCheckbox
            label="Allow downloading on mobile data"
            checked={downloadExpensiveChecked}
            disabled={settingsLoading || !storeFilesChecked}
            onPress={() => setDownloadExpensive(!downloadExpensiveChecked)}
          />

          <Subheading style={styles.subheading}>Status</Subheading>
          <Text style={{ marginBottom: 10 }}>{downloadStatusMessage}</Text>
          {showProgress && <ProgressBar progress={currentDownloadProgress} />}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 8,
    marginBottom: 4,
  },
  button: {
    marginVertical: 16,
  },
  viewWithSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  largerText: {
    fontSize: 15,
  },
  optionText: {
    alignSelf: "center",
    textAlign: "left",
  },
  subheading: {
    marginTop: 10,
  },
  downloadInfo: {
    flexDirection: "row",
    alignContent: "center",
    marginBottom: 10,
  },
});
