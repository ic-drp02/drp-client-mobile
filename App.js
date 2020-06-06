import React, { useState, useEffect } from "react";
import { Platform, AppState } from "react-native";
import {
  Provider as ReduxProvider,
  useSelector,
  useDispatch,
} from "react-redux";
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

import api from "./util/api";
import store, { refreshPosts, hideSnackbar } from "./store";

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
    registerForPushNotifications();

    // Dismiss any current notifications when the app is opened.
    AppState.addEventListener("change", async (s) => {
      if (s === "active") {
        await Notifications.dismissAllNotificationsAsync();
      }
    });

    // Refresh posts if notification received when app is open.
    Notifications.addListener(async (n) => {
      if (AppState.currentState === "active") {
        await Notifications.dismissAllNotificationsAsync();
        store.dispatch(refreshPosts());
      }
    });
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

async function registerForPushNotifications() {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
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

function AppSnackbar() {
  const snackbar = useSelector((s) => s.snackbar);
  const dispatch = useDispatch();
  return (
    <Snackbar
      visible={snackbar.visible}
      duration={snackbar.duration}
      onDismiss={() => dispatch(hideSnackbar())}
      action={snackbar.action}
    >
      {snackbar.message}
    </Snackbar>
  );
}
