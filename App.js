import React, { useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";

import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import SideBar from "./components/SideBar.js";
import AppNavigation from "./screens/AppNavigation";
import AppSnackbar from "./components/AppSnackbar";

import store from "./store";
import * as notifications from "./util/notifications.js";

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
  useEffect(() => {
    notifications.registerForPushNotifications();
    notifications.registerNotificationHandlers();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <ReduxProvider store={store}>
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
      </ReduxProvider>
    </PaperProvider>
  );
}
