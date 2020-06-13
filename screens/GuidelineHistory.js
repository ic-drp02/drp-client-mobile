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

import GuidelineCard from "../components/GuidelineCard.js";

import api from "../util/api";

import { deletePost, addRecentPost } from "../store";

export default function UpdateDetails({ route, navigation }) {
  const { postId } = route.params;
  const [revisions, setRevisions] = useState(null);

  async function loadRevisions() {
    try {
      const reverse = true;
      const res = await api.getGuidelineRevisions(postId, reverse);
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

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Guideline history" />
      </Appbar.Header>
      <View style={styles.content}>
        {revisions ? (
          revisions.map((g) => (
            <GuidelineCard
              key={g.id}
              guideline={g}
              onCardPress={() =>
                navigation.push("UpdateDetails", { postId: g.id })
              }
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
