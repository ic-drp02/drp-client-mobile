import React from "react";
import { Button, Dialog, Paragraph } from "react-native-paper";

export default function DangerConfirmationDialog({
  title,
  text,
  dangerActionText,
  visible,
  onDangerConfirm,
  onCancel,
}) {
  return (
    <Dialog visible={visible} onDismiss={() => onCancel()}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Paragraph>{text}</Paragraph>
      </Dialog.Content>
      <Dialog.Actions>
        <Button color="red" onPress={() => onDangerConfirm()}>
          {dangerActionText}
        </Button>
        <Button onPress={() => onCancel()}>Cancel</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
