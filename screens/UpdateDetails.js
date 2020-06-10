import React, { useCallback, useContext, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  Snackbar,
  Portal,
  Dialog,
  Paragraph,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import UpdateData from "../components/UpdateData.js";

import { deletePost, addRecentPost } from "../store";

export default function UpdateDetails({ route, navigation }) {
  const { postId } = route.params;
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    dispatch(addRecentPost(postId));
  }, []);

  const del = useCallback(() => {
    dispatch(deletePost(postId)).then(() => navigation.goBack());
  }, [postId]);

  function DeleteConfirmationDialog() {
    return (
      <Dialog visible={confirmDelete} onDismiss={() => setConfirmDelete(false)}>
        <Dialog.Title>Delete post</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Are you sure you want to delete this post?</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            color="red"
            onPress={() => {
              setConfirmDelete(false);
              del();
            }}
          >
            Delete
          </Button>
          <Button onPress={() => setConfirmDelete(false)}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Update details" />
      </Appbar.Header>
      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <UpdateData id={postId} />
        </View>
        {user.role === "admin" && (
          <View>
            <Button
              mode="contained"
              color="red"
              style={styles.button}
              onPress={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
            <Portal>
              <DeleteConfirmationDialog />
            </Portal>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    flex: 1,
  },
});
