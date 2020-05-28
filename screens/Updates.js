import React from "react";
import { StyleSheet, StatusBar } from "react-native";

import {
  Container,
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
        <Body>
          <Title>Updates</Title>
        </Body>
        <Right />
      </Header>
      <Content padder>
        <Text>[All updates]</Text>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({});
