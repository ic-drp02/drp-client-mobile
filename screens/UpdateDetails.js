import React, { useCallback, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Button, Snackbar } from "react-native-paper";
import { useDispatch } from "react-redux";

import UpdateData from "../components/UpdateData.js";

import { deletePost } from "../store";

export default function UpdateDetails({ route, navigation }) {
  const { postId } = route.params;
  const dispatch = useDispatch();

  const del = useCallback(() => {
    dispatch(deletePost(postId).then(() => navigation.goBack()));
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
