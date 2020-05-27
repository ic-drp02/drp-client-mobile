import React from "react";
import { StyleSheet } from "react-native";

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

export default function PostUpdate({ navigation }) {
  return (
    <Container>
      <Header>
        <Left style={styles.left}>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
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

const styles = StyleSheet.create({
  left: {
    flex: 0.15,
  },
});
