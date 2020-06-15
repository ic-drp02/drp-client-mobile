import React from "react";
import { Text, Card, Chip, Button } from "react-native-paper";

import { View, StyleSheet } from "react-native";

import { toDateAndTimeString } from "../util/date";

import Label from "./Label";

export default function GuidelineCard({
  guideline,
  onCardPress,
  showRemove,
  onRemove,
  labelType,
}) {
  return (
    <Card
      style={styles.guidelineCard}
      onPress={() => (onCardPress ? onCardPress() : {})}
    >
      <View style={styles.view}>
        <Text style={styles.title}>{guideline.title}</Text>
        {labelType && <Label style={{ marginLeft: 5 }} labelType={labelType} />}
      </View>

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
  view: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  label: {
    marginLeft: 10,
  },
  old: {
    color: "white",
    backgroundColor: "red",
  },
  new: {
    color: "white",
    backgroundColor: "green",
  },
});
