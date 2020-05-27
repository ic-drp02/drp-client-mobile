import React, { useEffect, useState } from 'react';

import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { StyleProvider }from 'native-base';
import commonColor from './native-base-theme/variables/commonColor';
import getTheme from './native-base-theme/components';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './screens/Home.js'
import Search from './screens/Search.js'

const Stack = createStackNavigator();

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
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Search" component={Search} />
        </Stack.Navigator>
      </NavigationContainer>
    </StyleProvider>
  );
}