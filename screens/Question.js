import React from "react";
import { View } from "react-native";
import { Appbar, Title } from "react-native-paper";

export default function Question({ navigation }) {
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Ask a question" />
      </Appbar.Header>
      <View style={{ padding: 16 }}>
        <Title>Ask a question!</Title>
      </View>
    </View>
  );
}
