import React, { useCallback, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Button, ActivityIndicator, Portal } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import UpdateData from "../components/UpdateData.js";
import DangerConfirmationDialog from "../components/DangerConfirmationDialog";

import api from "../util/api";
import {
  addFavouriteId,
  removeFavouriteId,
  updateFavouriteId,
  isFavourite,
} from "../util/favourites";
import { showInfoSnackbar } from "../util/snackbar";

import { deletePost, refreshPosts } from "../store";

export default function UpdateDetails({ route, navigation }) {
  const dispatch = useDispatch();

  const user = useSelector((s) => s.auth.user);
  const latest = useSelector((s) => s.posts.latest);
  const favourites = useSelector((s) => s.posts.favourites);
  const isInternetReachable = useSelector(
    (s) => s.connection.isInternetReachable
  );
  const offlinePosts = favourites.concat(latest);

  const { postId, revisionId } = route.params;

  const [post, setPost] = useState(null);
  const [revisions, setRevisions] = useState(null);
  const [old, setOld] = useState(false);
  const [favourite, setFavourite] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function loadPost() {
    if (!isInternetReachable) {
      // Load from store if available there
      let matchingOffline = offlinePosts.filter(
        (f) =>
          f.id == postId &&
          (revisionId === undefined || f.revision_id == revisionId)
      );
      if (matchingOffline.length >= 1) {
        setPost(matchingOffline[0]);
        return;
      }
      showInfoSnackbar("This post is not available offline");
      navigation.goBack();
      return;
    }

    // Request revisions in order from newest to oldest
    const reversed = true;
    let res;
    try {
      res = await api.getRevisions(postId, reversed);
    } catch (error) {
      console.warn("Failed to load post:");
      console.warn(error);
    }
    if (res.success) {
      let p;
      if (revisionId !== undefined) {
        // A revision was specified
        const matching = res.data.filter((p) => p.revision_id === revisionId);
        if (matching.length === 0) {
          console.warn("The requested revision does not appear to exist");
          return;
        }
        if (matching[0] !== res.data[0]) {
          // The specified revision does not match the newest revision, mark as old
          setOld(true);
        }
        // The requested revision is the first element in the matching list
        p = matching[0];
      } else {
        // No revision was specified - show details for the most recent one
        p = res.data[0];
      }
      setPost(p);
      setRevisions(res.data);

      // Refresh viewed favourite post revision
      await updateFavouriteId(p.id, p.revision_id);
    } else {
      console.warn("Failed to get post data with status " + res.status);
    }
  }

  async function addFavourite() {
    await addFavouriteId(post.id, post.revision_id);
    dispatch(refreshPosts());
    setFavourite(true);
  }

  async function removeFavourite() {
    await removeFavouriteId(post.id);
    dispatch(refreshPosts());
    setFavourite(false);
  }

  useEffect(() => {
    loadPost();
  }, []);

  useEffect(() => {
    (async () => {
      setFavourite(await isFavourite(postId));
    })();
  }, [postId]);

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
            if (favourite === true) {
              return (
                <Appbar.Action
                  icon="star-off"
                  onPress={() => removeFavourite()}
                />
              );
            } else if (favourite === false) {
              return (
                <Appbar.Action
                  icon="star-outline"
                  onPress={() => addFavourite()}
                />
              );
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
        {post && user.role === "admin" && isInternetReachable && (
          <View style={styles.buttons}>
            <Button
              mode="contained"
              color="red"
              icon="delete"
              style={
                post.is_guideline && post.is_current
                  ? styles.button
                  : styles.singleButton
              }
              onPress={() => setConfirmDelete(true)}
            >
              Delete{hasMoreRevisions ? " revision" : ""}
            </Button>

            {post.is_guideline && post.is_current && (
              <Button
                mode="contained"
                icon="file-upload"
                style={styles.button}
                onPress={() =>
                  navigation.navigate("PostUpdate", { prevPost: post })
                }
              >
                Supersede
              </Button>
            )}

            <Portal>
              <DangerConfirmationDialog
                title={`Delete ${post.is_guideline ? "guideline" : "post"}`}
                text={confirmDeleteText}
                dangerActionText="Delete"
                visible={confirmDelete}
                onDangerConfirm={() => {
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
  buttons: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  button: {
    flex: 0.48,
  },
  singleButton: {
    width: "100%",
  },
});
