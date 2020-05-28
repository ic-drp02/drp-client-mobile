import React from "react";
import { Image } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";

export default function SideBar({ navigation }) {
  return (
    <Container>
      <Content>
        <Image
          source={require("./splash.jpg")}
          style={{
            resizeMode: "stretch",
            justifyContent: "center",
            margin: 5,
            alignItems: "center",
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
      </Content>
    </Container>
  );
}
