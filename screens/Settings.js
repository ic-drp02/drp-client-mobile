import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as FileSystem from "expo-file-system";
import {
  Appbar,
  Text,
  TextInput,
  Title,
  Checkbox,
  Subheading,
  Button,
  Snackbar,
  Portal,
} from "react-native-paper";

import LabeledCheckbox from "../components/LabeledCheckbox.js";
import DangerConfirmationDialog from "../components/DangerConfirmationDialog.js";

import store, { updateSettings } from "../store";
import { SETTINGS_OPTIONS } from "../util/settings.js";
import {
  getHumanReadableFreeDiskStorage,
  getHumanReadableAppOccupiedStorage,
} from "../util/files.js";

export default function Settings({ navigation }) {
  const fullHeight = { flex: 1 };

  const dispatch = useDispatch();
  const settings = useSelector((s) => s.settings.settings);
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
  }, [storeFilesChecked]);

  function saveSettingsValue(key, value) {
    dispatch(updateSettings({ [key]: value }));
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
            onPress={() => {
              if (storeFavouriteChecked) {
                setConfirmOfflineFavourite(true);
                return;
              }
              saveSettingsValue(
                SETTINGS_OPTIONS.STORE_FAVOURITES_OFFLINE,
                true
              );
            }}
          />
          <View>
            <Portal>
              <DangerConfirmationDialog
                title="Disable storing favourites?"
                text={
                  "Are you sure you want to disable storing favourite posts on " +
                  "your device? This will delete saved posts that are stored within " +
                  "the ICON application and free the associated disk space."
                }
                dangerActionText="Disable"
                visible={confirmOfflineFavourite}
                onDangerConfirm={() => {
                  setConfirmOfflineFavourite(false);
                  saveSettingsValue(
                    SETTINGS_OPTIONS.STORE_FAVOURITES_OFFLINE,
                    false
                  );
                }}
                onCancel={() => setConfirmOfflineFavourite(false)}
              />
            </Portal>
          </View>

          <Subheading style={styles.subheading}>Files</Subheading>
          <LabeledCheckbox
            label="Store files attached to favourites"
            checked={storeFilesChecked}
            disabled={!storeFavouriteChecked}
            onPress={() => {
              if (storeFilesChecked) {
                setConfirmOfflineFiles(true);
                return;
              }
              saveSettingsValue(SETTINGS_OPTIONS.STORE_FILES, true);
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
                  saveSettingsValue(SETTINGS_OPTIONS.STORE_FILES, false);
                }}
                onCancel={() => setConfirmOfflineFiles(false)}
              />
            </Portal>
          </View>

          <LabeledCheckbox
            label="Download files on expensive connections"
            checked={downloadExpensiveChecked}
            disabled={!storeFavouriteChecked || !storeFilesChecked}
            onPress={() =>
              saveSettingsValue(
                SETTINGS_OPTIONS.DOWNLOAD_FILES_EXPENSIVE,
                !downloadExpensiveChecked
              )
            }
          />
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
});
