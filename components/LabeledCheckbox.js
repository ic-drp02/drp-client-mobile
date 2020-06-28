import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, Checkbox } from "react-native-paper";

import { COLOR_PRIMARY, COLOR_TEXT_SECONDARY } from "../util/colors.js";

export default function LabeledCheckbox({ label, checked, disabled, onPress }) {
  const labelDisabled = disabled ? { color: COLOR_TEXT_SECONDARY } : undefined;
  const boxChecked =
    checked === undefined ? "indeterminate" : checked ? "checked" : "unchecked";

  return (
    <TouchableOpacity
      style={styles.opacityWithSpace}
      onPress={() => {
        if (onPress && !disabled) {
          onPress();
        }
      }}
    >
      <Text style={[styles.optionText, styles.largerText, labelDisabled]}>
        {label}
      </Text>
      <Checkbox status={boxChecked} disabled={disabled} color={COLOR_PRIMARY} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  opacityWithSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  largerText: {
    fontSize: 15,
  },
  optionText: {
    alignSelf: "center",
    textAlign: "left",
  },
});
