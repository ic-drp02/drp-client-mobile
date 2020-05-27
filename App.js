import React, { useEffect, useState, Alert } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { AppLoading } from 'expo';
import{ StyleProvider, Container, Footer, FooterTab, Content, Header, Left, Body, Right, Button, Icon, Title, Text }from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import commonColor from './native-base-theme/variables/commonColor';
import getTheme from './native-base-theme/components';

export default function App(props) {
  
  // Variable indicating state of fonts loading
  const [fontsReady, setFontsReady] = useState(false);

  // Load Roboto fonts asynchronously
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
      });
      // Report that fonts are ready
      setFontsReady(true);
    }

    loadFonts();
  }, []);

  if (!fontsReady) {
    // Show just AppLoading if the fonts are not ready yet
    return (<AppLoading />);
  }

  return (
      <StyleProvider style={getTheme(commonColor)}>
        <Container>
          <Header searchBar>
            <Left>
              <Button transparent>
                <Icon name='menu' />
              </Button>
            </Left>
            <Body>
              <Title>ICON</Title>
            </Body>
            <Right>
              <Button transparent onPress={() => alert("Searching!")}>
                <Icon name='search' />
              </Button>
            </Right>
          </Header>
          <Content>
            <Button style={styles.logo}>
              <Text>Ask a question</Text>
            </Button>
            <Button>
              <Text>Post an update</Text>
            </Button>
          </Content>
          <Footer>
            <FooterTab>
              <Button full>
                <Text>Footer</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </StyleProvider>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 400,
    height: 150,
  },
});