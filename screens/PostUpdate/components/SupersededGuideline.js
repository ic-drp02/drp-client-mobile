import React from "react";
import { StyleSheet } from "react-native";

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
    alignSelf: "center",
    textAlign: "left",
    fontSize: 15,
    marginLeft: 4,
  },
});
