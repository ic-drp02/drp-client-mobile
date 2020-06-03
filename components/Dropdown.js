import React, { useState, useCallback } from "react";
import { View } from "react-native";
import { useTheme, Text, TouchableRipple, Menu } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Dropdown({
  items,
  selected,
  onSelectionChange,
  style,
}) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const openMenu = useCallback(() => setVisible(true));
  const closeMenu = useCallback(() => setVisible(false));

  return (
    <View style={style}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <TouchableRipple onPress={openMenu}>
            <View
              style={{
                borderColor: theme.colors.placeholder,
                borderWidth: 1,
                borderRadius: theme.roundness,
                padding: 16,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: theme.colors.placeholder,
                }}
              >
                {(selected && selected.label) || "Select"}
              </Text>
              <Icon name="chevron-down" size={16} />
            </View>
          </TouchableRipple>
        }
      >
        {items &&
          items.map((item) => (
            <Menu.Item
              key={item.value}
              title={item.label}
              onPress={() => {
                onSelectionChange(item);
                closeMenu();
              }}
            />
          ))}
      </Menu>
    </View>
  );
}
