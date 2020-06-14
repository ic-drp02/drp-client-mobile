import React, { useCallback, useContext, useState, useEffect } from "react";
import { StyleSheet, View, AsyncStorage } from "react-native";
import {
  Appbar,
  Button,
  ActivityIndicator,
  Portal,
  Dialog,
  Paragraph,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import UpdateData from "../components/UpdateData.js";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";

import api from "../util/api";

import { deletePost, addRecentPost } from "../store";

export default function UpdateDetails({ route, navigation }) {
  const { postId, onDelete } = route.params;
  const [post, setPost] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const [pinned, setPinned] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function loadPost() {
    try {
      const res = await api.getPost(postId);
      if (res.success) {
        setPost(res.data);
      } else {
        console.warn("Failed to get post data with status " + res.status);
      }
    } catch (error) {
      console.warn(error);
    }
  }

  useEffect(() => {
    dispatch(addRecentPost(postId));
  }, []);

  useEffect(() => {
    loadPost();
  }, []);

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem("PINNED_POSTS");
      const pinned = json ? JSON.parse(json) : [];
      setPinned(pinned.includes(postId));
    })();
  }, [postId]);

  async function pin() {
    let json = await AsyncStorage.getItem("PINNED_POSTS");
    let pinned = json ? JSON.parse(json) : [];
    pinned.push(postId);
    json = JSON.stringify(pinned);
    await AsyncStorage.setItem("PINNED_POSTS", json);
    setPinned(true);
  }

  async function unpin() {
    let json = await AsyncStorage.getItem("PINNED_POSTS");
    let pinned = json ? JSON.parse(json) : [];
    json = JSON.stringify(pinned.filter((p) => p !== postId));
    await AsyncStorage.setItem("PINNED_POSTS", json);
    setPinned(false);
  }

  const del = useCallback(() => {
    dispatch(deletePost(postId)).then(() => navigation.goBack());
  }, [postId]);

  const hasMoreRevisions = post?.superseded_by || post?.superseding;
  const confirmDeleteText = `Are you sure you want to delete this ${
    post?.is_guideline ? "guideline" : "post"
  }${hasMoreRevisions ? " revision" : ""}?${
    hasMoreRevisions
      ? " If you want to delete all revisions of this guideline, you can do so from the history page."
      : ""
  }`;

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Update details" />
        {post && (post.superseded_by || post.superseding) && (
          <Appbar.Action
            icon="history"
            onPress={() =>
              navigation.navigate("GuidelineHistory", { postId: postId })
            }
          />
        )}
        {post &&
          !post.superseded_by &&
          (() => {
            if (pinned === true) {
              return <Appbar.Action icon="pin-off" onPress={() => unpin()} />;
            } else if (pinned === false) {
              return <Appbar.Action icon="pin" onPress={() => pin()} />;
            }
          })()}
      </Appbar.Header>
      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          {post === null ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator indeterminate size="large" />
            </View>
          ) : (
            <UpdateData post={post} />
          )}
        </View>
        {post && user.role === "admin" && (
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
              <DeleteConfirmationDialog
                title={`Delete ${post.is_guideline ? "guideline" : "post"}`}
                text={confirmDeleteText}
                visible={confirmDelete}
                onDelete={() => {
                  setConfirmDelete(false);
                  del();
                }}
                onCancel={() => setConfirmDelete(false)}
              />
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
