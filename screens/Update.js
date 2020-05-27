import React from "react";

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
import { StatusBar } from "react-native";

export default function Update({ navigation }) {
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
          <Title>Post an update</Title>
        </Body>
      </Header>
      <Content padder>
        <Text>Post an update!</Text>
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
