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
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body style={styles.center}>
          <Title>Ask a question</Title>
        </Body>
        <Right />
      </Header>
      <Content padder>
        <Text>Ask a question!</Text>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 2,
  },
});
