import React from "react";
import { View, ScrollView } from "react-native";
import { Appbar } from "react-native-paper";
import Constants from "expo-constants";
import { DEFAULT_APPBAR_HEIGHT } from "../node_modules/react-native-paper/src/components/Appbar/Appbar.tsx";

import LatestUpdates from "../components/LatestUpdates.js";

export default function Question({ navigation }) {
  const viewPadding = 16;
  const topheight =
    Constants.statusBarHeight + DEFAULT_APPBAR_HEIGHT + viewPadding;

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="All Updates" />
      </Appbar.Header>
      <ScrollView
        style={{ padding: viewPadding }}
        contentContainerStyle={{ paddingBottom: topheight }}
      >
        <LatestUpdates />
      </ScrollView>
    </View>
  );
}
