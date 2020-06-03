import React from "react";
import { View, ScrollView } from "react-native";
import { Appbar } from "react-native-paper";

import LatestUpdates from "../components/LatestUpdates.js";

export default function Question({ navigation }) {
  const fullHeight = { flex: 1 };

  return (
    <View style={fullHeight}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="All Updates" />
      </Appbar.Header>
      <View style={fullHeight}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <LatestUpdates />
        </ScrollView>
      </View>
    </View>
  );
}
