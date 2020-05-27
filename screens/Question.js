import React from "react";
import { StatusBar } from "react-native";

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
        <Left>
          <Button transparent onPress={() => navigation.openDrawer()}>
            <Icon name="menu" />
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
