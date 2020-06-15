import React, { useCallback, useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button, ActivityIndicator, Portal } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import GuidelineCard from "../components/GuidelineCard.js";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";
import { LABEL_TYPES } from "../components/Label";

import api from "../util/api";

import { deletePost } from "../store";

export default function UpdateDetails({ route, navigation }) {
  const { postId } = route.params;
  const dispatch = useDispatch();
  const [revisions, setRevisions] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const user = useSelector((s) => s.auth.user);

  async function loadRevisions() {
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
    loadRevisions();
  }, []);

  useEffect(() => {
    navigation.addListener("focus", () => {
      setRevisions(null);
      loadRevisions();
    });
  }, [revisions]);

  const del = useCallback(() => {
    dispatch(deletePost(postId, true)).then(() => navigation.pop(2));
  }, [postId]);

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
                onCardPress={() => {
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
                }}
                labelType={i === 0 ? LABEL_TYPES.NEW : LABEL_TYPES.OLD}
              />
            ))
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator indeterminate size="large" />
            </View>
          )}
        </ScrollView>
        {user.role === "admin" && (
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
              <DeleteConfirmationDialog
                title={"Delete revisions"}
                text={
                  "Are you sure you want to delete all revisions of this guideline?"
                }
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
