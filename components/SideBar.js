import React from "react";
import { View, Image } from "react-native";
import { Left, Icon, Body, Text, List, ListItem } from "native-base";

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
        <ListItem icon button onPress={() => navigation.navigate("Home")}>
          <Left>
            <Icon name="home"></Icon>
          </Left>
          <Body>
            <Text>Home</Text>
          </Body>
        </ListItem>
        <ListItem icon button onPress={() => navigation.navigate("Updates")}>
          <Left>
            <Icon name="notifications" type="MaterialIcons"></Icon>
          </Left>
          <Body>
            <Text>View all updates</Text>
          </Body>
        </ListItem>
        <ListItem icon button onPress={() => navigation.navigate("Question")}>
          <Left>
            <Icon name="question-answer" type="MaterialIcons"></Icon>
          </Left>
          <Body>
            <Text>Ask a question</Text>
          </Body>
        </ListItem>
        <ListItem icon button onPress={() => navigation.navigate("PostUpdate")}>
          <Left>
            <Icon name="edit" type="MaterialIcons"></Icon>
          </Left>
          <Body>
            <Text>Post an update</Text>
          </Body>
        </ListItem>
      </List>
    </View>
  );
}
