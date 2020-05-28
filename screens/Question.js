import React from "react";
import { StyleSheet, StatusBar } from "react-native";

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

export default function Question({ navigation }) {
  return (
    <Container>
      <Header>
        <StatusBar barStyle="light-content" />
        <Left style={styles.left}>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon style={styles.navicon} name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Ask a question</Title>
        </Body>
      </Header>
      <Content padder>
        <Text>Ask a question!</Text>
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
  left: {
    flex: 0.15,
  },
  navicon: {
    color: "#FFF",
  },
});
