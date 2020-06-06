import { AppState, Platform } from "react-native";
import { Notifications } from "expo";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

import api from "./api";
import store, { refreshPosts } from "../store";

export async function registerForPushNotifications() {
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

export function registerNotificationHandlers() {
  // Dismiss any current notifications when the app is opened.
  AppState.addEventListener("change", async (s) => {
    if (s === "active") {
      await Notifications.dismissAllNotificationsAsync();
    }
  });

  // Refresh posts if notification received when app is open.
  Notifications.addListener(async () => {
    if (AppState.currentState === "active") {
      await Notifications.dismissAllNotificationsAsync();
      store.dispatch(refreshPosts());
    }
  });
}