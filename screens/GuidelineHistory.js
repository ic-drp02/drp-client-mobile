import React, { useCallback, useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button, ActivityIndicator, Portal } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import GuidelineCard from "../components/GuidelineCard.js";
import DangerConfirmationDialog from "../components/DangerConfirmationDialog";
import { LABEL_TYPES } from "../components/Label";

import { showInfoSnackbar } from "../util/snackbar";
import api from "../util/api";

import { deletePost } from "../store";

export default function UpdateDetails({ route, navigation }) {
  const { postId } = route.params;

  const isInternetReachable = useSelector(
    (s) => s.connection.isInternetReachable
  );

  const dispatch = useDispatch();
  const [revisions, setRevisions] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState(null);
  const user = useSelector((s) => s.auth.user);

  async function loadRevisions() {
    if (!isInternetReachable) {
      showInfoSnackbar("Cannot load revision history while offline!");
      navigation.goBack();
      return;
    }

    try {
      const reverse = true;
      const res = await api.getRevisions(postId, reverse);
      if (res.success) {
        setRevisions(res.data);
      } else {
        console.warn(
          "Failed to get guideline revisions with status " + res.status
        );
      }
    } catch (error) {
      console.warn(error);
    }
  }

  useEffect(() => {
    navigation.addListener("focus", () => {
      setRevisions(null);
      loadRevisions();
    });
  }, [isInternetReachable]);

  const del = useCallback(() => {
    dispatch(deletePost(postId, true)).then(() => navigation.pop(2));
  }, [postId]);

  function onPressGuideline(g, i) {
    if (i === 0) {
      navigation.navigate("UpdateDetails", {
        postId: g.id,
      });
    } else {
      navigation.push("UpdateDetails", {
        postId: g.id,
        revisionId: g.revision_id,
      });
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Guideline history" />
      </Appbar.Header>
      <View style={styles.content}>
        <ScrollView style={{ marginBottom: 10 }}>
          {revisions ? (
            revisions.map((g, i) => (
              <GuidelineCard
                key={g.revision_id}
                guideline={g}
                onCardPress={() => onPressGuideline(g, i)}
                labelType={i === 0 ? LABEL_TYPES.CURRENT : LABEL_TYPES.OLD}
              />
            ))
          ) : (
            <View style={styles.loadingView}>
              <ActivityIndicator indeterminate size="large" />
            </View>
          )}
        </ScrollView>
        {user.role === "admin" && isInternetReachable && (
          <View>
            <Button
              mode="contained"
              color="red"
              onPress={() => {
                setConfirmDelete(true);
              }}
            >
              Delete all
            </Button>
            <Portal>
              <DangerConfirmationDialog
                title={"Delete revisions"}
                text={
                  "Are you sure you want to delete all revisions of this guideline?"
                }
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
  loadingView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
