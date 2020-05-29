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

import LatestUpdates from "../components/LatestUpdates.js";

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
          <Title>All Updates</Title>
        </Body>
        <Right />
      </Header>
      <Content padder>
        <LatestUpdates />
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({});
