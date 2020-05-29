import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import SideBar from "./components/SideBar.js";
import AppNavigation from "./screens/AppNavigation";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#2f80ed",
    accent: "#f1c40f",
  },
};

const DrawerNavigator = createDrawerNavigator();

export default function App() {
  // Variable indicating state of fonts loading
  return (
    <PaperProvider theme={theme}>
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
    </PaperProvider>
  );
}
