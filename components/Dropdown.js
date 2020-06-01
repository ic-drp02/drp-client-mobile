import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { Picker } from "@react-native-community/picker";

export default function Dropdown({
  items,
  selected,
  onSelectionChange,
  style,
}) {
  const theme = useTheme();
  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: theme.roundness,
        borderColor: theme.colors.placeholder,
        padding: 4,
        ...style,
      }}
    >
      <Picker
        mode="dropdown"
        selectedValue={selected}
        onValueChange={onSelectionChange}
      >
        {items &&
          items.map(({ label, value }) => (
            <Picker.Item key={value} label={label} value={value} />
          ))}
      </Picker>
    </View>
  );
}
