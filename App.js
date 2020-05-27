import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { AppLoading } from 'expo';
import{ Container, Header, Left, Body, Right, Button, Icon, Title, Text }from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

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
    <View>
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Hello world!</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='menu' />
            </Button>
          </Right>
        </Header>
      </Container>
    </View>
  );
}
