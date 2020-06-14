import React from "react";
import { Button, Dialog, Paragraph } from "react-native-paper";

export default function DeleteConfirmationDialog({
  title,
  text,
  visible,
  onDelete,
  onCancel,
}) {
  return (
    <Dialog visible={visible} onDismiss={() => onCancel()}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Paragraph>{text}</Paragraph>
      </Dialog.Content>
      <Dialog.Actions>
        <Button color="red" onPress={() => onDelete()}>
          Delete
        </Button>
        <Button onPress={() => onCancel()}>Cancel</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
