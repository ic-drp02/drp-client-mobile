import React from "react";
import { View, Image } from "react-native";
import { Button, Text, Headline } from "react-native-paper";

export default function Welcome({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        top: -50,
      }}
    >
      <View>
        <View style={{ height: 200, marginTop: 24, padding: 8 }}>
          <Image
            source={require("../assets/icon_full.png")}
            style={{
              width: undefined,
              height: undefined,
              flex: 1,
            }}
            resizeMode="contain"
          />
        </View>
        <Headline style={{ textAlign: "center", margin: 8 }}>
          Welcome to ICON, the Imperial Comms Network
        </Headline>
        <Text style={{ textAlign: "center", margin: 8 }}>
          A network designed to help you, as junior doctors, get your questions
          to senior management.
        </Text>
        <Button
          mode="contained"
          style={{ margin: 8 }}
          onPress={() => navigation.goBack()}
        >
          Start
        </Button>
      </View>
    </View>
  );
}
