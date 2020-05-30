import React, { useCallback, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Button, Snackbar } from "react-native-paper";

import UpdateData from "../components/UpdateData.js";

import { deletePost } from "../util/api.js";
import SnackbarContext from "../SnackbarContext.js";

export default function UpdateDetails({ route, navigation }) {
  const snackbar = useContext(SnackbarContext);
  const { postId } = route.params;

  async function requestDeletion(postId) {
    try {
      const res = await deletePost(postId);

      if (!res.success) {
        console.warn("An error occured, status code " + res.status + "!");
      }

      snackbar.show("Deleted!", Snackbar.DURATION_SHORT, {
        label: "hide",
        onPress(hide) {
          hide();
        },
      });

      navigation.goBack();
    } catch (error) {
      console.warn(error);
    }
  }

  const del = useCallback(() => {
    requestDeletion(postId);
  }, [postId]);

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
        <View>
          <Button
            mode="contained"
            color="red"
            style={styles.button}
            onPress={() => del(postId)}
          >
            Delete
          </Button>
        </View>
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
