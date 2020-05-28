import React from "react";
import { View, Image } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";

export default function SideBar({ navigation }) {
  return (
    <View style={{ width: "100%" }}>
      <Image
        source={require("../assets/logo.jpg")}
        style={{
          width: "100%",
          height: 120,
          resizeMode: "contain",
        }}
      />
      <List>
        <ListItem button onPress={() => navigation.navigate("Home")}>
          <Text>Home button</Text>
        </ListItem>
        <ListItem button onPress={() => navigation.navigate("Question")}>
          <Text>Ask a question</Text>
        </ListItem>
        <ListItem button onPress={() => navigation.navigate("PostUpdate")}>
          <Text>Post an update</Text>
        </ListItem>
      </List>
    </View>
  );
}
