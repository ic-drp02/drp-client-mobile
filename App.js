import React, { useEffect, useState } from "react";

import { AppLoading } from "expo";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { StyleProvider, Drawer } from "native-base";
import commonColor from "./native-base-theme/variables/commonColor";
import getTheme from "./native-base-theme/components";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import SideBar from "./components/SideBar.js";
import AppNavigation from "./screens/AppNavigation";

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
        <DrawerNavigator.Navigator
          initialRouteName="AppNavigation"
          drawerContent={SideBar}
        >
          <DrawerNavigator.Screen
            name="AppNavigation"
            component={AppNavigation}
          />
        </DrawerNavigator.Navigator>
      </NavigationContainer>
    </StyleProvider>
  );
}
