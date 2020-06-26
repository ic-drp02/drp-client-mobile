import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import GuidelineCard from "../../../components/GuidelineCard";

export default function SupersededGuideline({
  guideline,
  onRemoveGuideline,
  style,
}) {
  return (
    <View style={style}>
      <Text style={styles.guidelineText}>This guideline will supersede:</Text>
      <GuidelineCard
        guideline={guideline}
        showRemove={true}
        onRemove={onRemoveGuideline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  guidelineText: {
    textAlign: "left",
    fontSize: 15,
    marginLeft: 4,
    marginBottom: 6,
  },
});
