import React from "react";
import { StyleSheet, View, StatusBar } from "react-native";

import {
  Container,
  Footer,
  FooterTab,
  Content,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Text,
} from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const StackNavigator = createStackNavigator();

export default function Home({ navigation }) {
  return (
    <Container>
      <Header>
        <StatusBar barStyle="light-content" />
        <Left>
          <Button transparent onPress={() => navigation.openDrawer()}>
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
          <Title>ICON</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => navigation.navigate("Search")}>
            <Icon name="search" />
          </Button>
        </Right>
      </Header>
      <Content padder>
        <View style={styles.row}>
          <Button
            style={styles.button}
            onPress={() => navigation.navigate("Ask a question")}
          >
            <Text>Ask a question</Text>
          </Button>
          <Button
            style={styles.button}
            onPress={() => navigation.navigate("Post an update")}
          >
            <Text>Post an update</Text>
          </Button>
        </View>
      </Content>
      <Footer>
        <FooterTab>
          <Button full>
            <Text>Footer</Text>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "40%",
    margin: 10,
    justifyContent: "center",
  },
  left: {
    flex: 0.15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  center: {
    alignItems: "center",
  },
});
