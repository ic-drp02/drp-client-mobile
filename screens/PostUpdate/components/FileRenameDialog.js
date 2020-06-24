import React, { useState } from "react";
import { Text } from "react-native";

import { Button, Dialog, TextInput } from "react-native-paper";

import { getExtension } from "../../../util/fileUtils.js";

export default function FileRenameDialog({
  visible,
  renamedFile,
  style,
  onCancel,
  onRenameTo,
}) {
  const [newName, setNewName] = useState(renamedFile);
  const [confirmShown, setConfirmShown] = useState(false);

  if (confirmShown) {
    return (
      <Dialog visible={visible} onDismiss={onCancel} style={style}>
        <Dialog.Title>Are you sure?</Dialog.Title>
        <Dialog.Content>
          <Text>
            It seems that you have changed the file extension of the attached
            file from '{getExtension(renamedFile)}' to '{getExtension(newName)}
            '? This may make the renamed file unusable. Are you sure you want to
            proceed?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setConfirmShown(false)}>Cancel</Button>
          <Button
            onPress={() => {
              setConfirmShown(false);
              onRenameTo(newName);
            }}
          >
            Rename
          </Button>
        </Dialog.Actions>
      </Dialog>
    );
  }

  return (
    <Dialog visible={visible} onDismiss={onCancel} style={style}>
      <Dialog.Title>Rename file {renamedFile}</Dialog.Title>
      <Dialog.Content>
        <TextInput
          mode="outlined"
          label="New name"
          onChangeText={(n) => setNewName(n)}
        />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onCancel}>Cancel</Button>
        <Button
          onPress={() => {
            if (getExtension(renamedFile) !== getExtension(newName)) {
              setConfirmShown(true);
            } else {
              onRenameTo(newName);
            }
          }}
        >
          Rename
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
