import React from "react";
import { StyleSheet, StatusBar, View } from "react-native";
import { Appbar } from "react-native-paper";

import LatestUpdates from "../components/LatestUpdates.js";

export default function Question({ navigation }) {
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="All Updates" />
      </Appbar.Header>
      <View style={{ padding: 16 }}>
        <LatestUpdates />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
