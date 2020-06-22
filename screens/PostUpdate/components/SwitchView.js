import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Switch, useTheme } from "react-native-paper";

export default function SwitchView({ text, value, onChange, style }) {
  const theme = useTheme();
  return (
    <View style={[styles.root, style]}>
      <Text style={styles.guidelineText}>{text}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        color={theme.colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  guidelineText: {
    alignSelf: "center",
    textAlign: "left",
    fontSize: 15,
    marginLeft: 4,
  },
});
