import React from "react";
import { StyleSheet, View } from "react-native";

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
  H3,
} from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import PostSummary from "../../components/PostSummary.js";

const StackNavigator = createStackNavigator();

export default function Home({ navigation }) {
  return (
    <Container>
      <Header>
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
        <H3 style={styles.margin}>Recently viewed</H3>
        <PostSummary
          title="Pre op assessment"
          summary="New guidelines on pre op assessment for elective surgery during COVID"
        />
        <PostSummary
          title="Minutes from ICON Q&A"
          summary="The official minutes from yesteray's ICON Q&A"
        />
        <H3 style={styles.margin}>Latest updates</H3>
        <PostSummary
          title="Antibody testing"
          summary="Antibody testing is available @ Imperial"
        />
        <PostSummary
          title="COVID patients referral"
          summary="How to refer vulnerable COVID patients to the LCW"
        />
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
    width: "45%",
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
  margin: {
    margin: 10,
  },
});
