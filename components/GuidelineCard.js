import React from "react";
import { Text, Card, Chip, Button } from "react-native-paper";

import { View, StyleSheet } from "react-native";

import { toDateAndTimeString } from "../util/date";

export default function GuidelineCard({
  guideline,
  onCardPress,
  showRemove,
  onRemove,
}) {
  return (
    <Card
      style={styles.guidelineCard}
      onPress={() => (onCardPress ? onCardPress() : {})}
    >
      <Text style={styles.title}>{guideline.title}</Text>
      {guideline.summary != "" && (
        <Text style={styles.summary}>{guideline.summary}</Text>
      )}
      <View style={styles.dateView}>
        <Chip icon="calendar-range">
          {toDateAndTimeString(new Date(guideline.created_at))}
        </Chip>
      </View>
      {showRemove && (
        <Button
          color="red"
          style={{ alignSelf: "flex-end" }}
          onPress={() => (onRemove ? onRemove() : {})}
        >
          Remove
        </Button>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  guidelineCard: {
    marginVertical: 3,
    marginHorizontal: 1,
    padding: 10,
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    marginVertical: 3,
  },
  summary: {
    color: "grey",
    marginVertical: 3,
  },
  dateView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 3,
  },
});
