import React, { useRef, useEffect } from "react";
import { View } from "react-native";
import { Appbar, Searchbar } from "react-native-paper";

export default function Search({ navigation }) {
  const ref = useRef(null);

  useEffect(() => {
    return navigation.addListener("focus", () => {
      if (!!ref.current) {
        ref.current.focus();
      }
    });
  }, []);

  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <View style={{ flex: 1, marginLeft: 16, marginRight: 8 }}>
        <Searchbar placeholder="Search" style={{ height: 42 }} ref={ref} />
      </View>
    </Appbar.Header>
  );
}
