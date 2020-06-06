import React, { useState, useEffect } from "react";
import { Platform, AppState } from "react-native";
import { Notifications } from "expo";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

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
import api from "./util/api.js";

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

  async function registerForPushNotifications() {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.warn("Failed to get token for push notifications!");
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync();
      api.registerForNotifications(token);
    } else {
      console.log("Must use physical device for push notifications");
    }

    if (Platform.OS == "android") {
      Notifications.createChannelAndroidAsync("default", {
        name: "default",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  }

  useEffect(() => {
    registerForPushNotifications();

    // Dismiss any current notifications when the app is opened.
    AppState.addEventListener("change", async (s) => {
      if (s === "active") {
        await Notifications.dismissAllNotificationsAsync();
      }
    });

    // Ignore notifications when app is open.
    Notifications.addListener(async (n) => {
      if (AppState.currentState === "active") {
        await Notifications.dismissNotificationAsync(n.notificationId);
      }
    });
  }, []);

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
