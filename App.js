import React, { useEffect, useState } from "react";

import { AppLoading } from "expo";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { StyleProvider, Drawer } from "native-base";
import commonColor from "./native-base-theme/variables/commonColor";
import getTheme from "./native-base-theme/components";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import HomeNavigation from "./screens/Home/HomeNavigation.js";
import Question from "./screens/Question.js";
import PostUpdate from "./screens/PostUpdate.js";

const DrawerNavigator = createDrawerNavigator();

export default function App(props) {
  // Variable indicating state of fonts loading
  const [fontsReady, setFontsReady] = useState(false);

  // Load Roboto fonts asynchronously
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Roboto: require("native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
        ...Ionicons.font,
      });
      // Report that fonts are ready
      setFontsReady(true);
    };

    loadFonts();
  }, []);

  if (!fontsReady) {
    // Show just AppLoading if the fonts are not ready yet
    return <AppLoading />;
  }

  return (
    <StyleProvider style={getTheme(commonColor)}>
      <NavigationContainer>
        <DrawerNavigator.Navigator initialRouteName="Home">
          <DrawerNavigator.Screen name="Home" component={HomeNavigation} />
          <DrawerNavigator.Screen name="Ask a question" component={Question} />
          <DrawerNavigator.Screen
            name="Post an update"
            component={PostUpdate}
          />
        </DrawerNavigator.Navigator>
      </NavigationContainer>
    </StyleProvider>
  );
}
