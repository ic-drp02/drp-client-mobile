import React from "react";
import { View, Image } from "react-native";
import { Drawer, Divider } from "react-native-paper";

const DarkDivider = () => <Divider style={{ backgroundColor: "#bbb" }} />;

export default function SideBar({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 120, marginTop: 24, padding: 8 }}>
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
      <DarkDivider />
      <View style={{ flex: 1 }}>
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
          icon="magnify"
          label="Search"
          onPress={() => navigation.navigate("Search")}
        />
      </View>
      <DarkDivider />
      <View>
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
    </View>
  );
}
