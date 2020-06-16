import React, { useCallback, useState, useEffect } from "react";
import { StyleSheet, View, AsyncStorage } from "react-native";
import { Appbar, Button, ActivityIndicator, Portal } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import UpdateData from "../components/UpdateData.js";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";

import api from "../util/api";

import { deletePost, addRecentPost } from "../store";

export default function UpdateDetails({ route, navigation }) {
  const { postId, revisionId } = route.params;
  const [post, setPost] = useState(null);
  const [revisions, setRevisions] = useState(null);
  const [old, setOld] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const [pinned, setPinned] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function loadPost() {
    try {
      const reversed = true;
      const res = await api.getRevisions(postId, reversed);
      if (res.success) {
        let p;
        if (revisionId !== undefined) {
          const matching = res.data.filter((p) => p.revision_id === revisionId);
          if (matching.length === 0) {
            console.warn("The requested revision does not appear to exist");
          }
          if (matching[0] !== res.data[0]) {
            setOld(true);
          }
          p = matching[0];
        } else {
          p = res.data[0];
        }
        setPost(p);
        setRevisions(res.data);
        if (revisionId === undefined) {
          refreshSaved(postId, p.revision_id);
        }
      } else {
        console.warn("Failed to get post data with status " + res.status);
      }
    } catch (error) {
      console.warn(error);
    }
  }

  useEffect(() => {
    loadPost();
  }, []);

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem("PINNED_POSTS");
      const pinned = json ? JSON.parse(json) : [];
      setPinned(pinned.map((p) => p.postId).includes(postId));
    })();
  }, [postId]);

  async function pin() {
    let json = await AsyncStorage.getItem("PINNED_POSTS");
    let pinned = json ? JSON.parse(json) : [];
    pinned.push({ postId: postId, revisionId: post.revision_id });
    json = JSON.stringify(pinned);
    await AsyncStorage.setItem("PINNED_POSTS", json);
    setPinned(true);
  }

  async function unpin() {
    let json = await AsyncStorage.getItem("PINNED_POSTS");
    let pinned = json ? JSON.parse(json) : [];
    json = JSON.stringify(pinned.filter((p) => p.postId !== postId));
    await AsyncStorage.setItem("PINNED_POSTS", json);
    setPinned(false);
  }

  async function refreshSaved(postId, revisionId) {
    dispatch(addRecentPost(postId, revisionId));
    let json = await AsyncStorage.getItem("PINNED_POSTS");
    let pinned = json ? JSON.parse(json) : [];
    if (pinned.map((p) => p.postId).includes(postId)) {
      pinned = pinned.filter((p) => p.postId !== postId);
      pinned.push({ postId: postId, revisionId: revisionId });
      json = JSON.stringify(pinned);
      await AsyncStorage.setItem("PINNED_POSTS", json);
    }
  }

  const del = useCallback(() => {
    dispatch(deletePost(post.revision_id)).then(() => navigation.goBack());
  }, [post]);

  const hasMoreRevisions = revisions ? revisions.length > 1 : false;
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
        {post && hasMoreRevisions && (
          <Appbar.Action
            icon="history"
            onPress={() =>
              navigation.navigate("GuidelineHistory", { postId: postId })
            }
          />
        )}
        {post &&
          post.is_current &&
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
            <UpdateData post={post} old={old} />
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
              Delete{hasMoreRevisions ? " revision" : ""}
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
