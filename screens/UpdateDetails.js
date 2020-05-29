import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Button, Snackbar } from "react-native-paper";

import UpdateData from "../components/UpdateData.js";

import { deletePost } from "../util/api.js";

export default function UpdateDetails({ route, navigation }) {
  const [showAlert, setShowAlert] = useState(false);
  const { postId } = route.params;

  async function requestDeletion(postId) {
    try {
      const res = await deletePost(postId);

      if (!res.success) {
        console.warn("An error occured, status code " + res.status + "!");
      }

      setShowAlert(true);
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
      <Snackbar
        visible={showAlert}
        duration={Snackbar.DURATION_SHORT}
        onDismiss={() => setShowAlert(false)}
        action={{
          label: "hide",
          onPress: () => setShowAlert(false),
        }}
      >
        Deleted!
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    flex: 1,
  },
});
