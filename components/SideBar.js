import React from "react";
import { View, Image } from "react-native";
import { Drawer } from "react-native-paper";

export default function SideBar({ navigation }) {
  return (
    <View style={{ width: "100%" }}>
      <View style={{ height: 120, marginTop: 32 }}>
        <Image
          source={require("../assets/logo.jpg")}
          style={{
            width: undefined,
            height: undefined,
            flex: 1,
          }}
          resizeMode="contain"
        />
      </View>
      <Drawer.Item
        icon="home-variant-outline"
        label="Home"
        onPress={() => navigation.navigate("Home")}
      />
      <Drawer.Item
        icon="bell-outline"
        label="Updates"
        onPress={() => navigation.navigate("Updates")}
      />
      <Drawer.Item
        icon="help-circle-outline"
        label="Ask a question"
        onPress={() => navigation.navigate("Question")}
      />
      <Drawer.Item
        icon="pencil-outline"
        label="Post an update"
        onPress={() => navigation.navigate("PostUpdate")}
      />
    </View>
  );
}
