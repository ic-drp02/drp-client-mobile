import React, { useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import {
  DefaultTheme,
  Provider as PaperProvider,
  Snackbar,
} from "react-native-paper";

import SideBar from "./components/SideBar.js";
import AppNavigation from "./screens/AppNavigation";

import SnackbarContext from "./SnackbarContext";

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
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: undefined,
    duration: undefined,
    action: undefined,
    show(message, duration, action) {
      setSnackbar({ ...snackbar, visible: true, message, duration, action });
    },
  });

  function hideSnackbar() {
    setSnackbar({ ...snackbar, visible: false });
  }

  function AppSnackbar() {
    let label = undefined;
    let onPress = undefined;

    if (!!snackbar.action) {
      label = snackbar.action.label;
      onPress = () =>
        snackbar.action.onPress && snackbar.action.onPress(hideSnackbar);
    }

    return (
      <Snackbar
        visible={snackbar.visible}
        duration={snackbar.duration}
        onDismiss={hideSnackbar}
        action={{ label, onPress }}
      >
        {snackbar.message}
      </Snackbar>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <SnackbarContext.Provider value={snackbar}>
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
        <AppSnackbar />
      </SnackbarContext.Provider>
    </PaperProvider>
  );
}
