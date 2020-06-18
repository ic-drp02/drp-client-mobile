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

    const token = encodeURIComponent(
      await Notifications.getExpoPushTokenAsync()
    );

    await fetch(
      api.baseUrl +
        "/api/notifications/register?user=" +
        store.getState().auth.user.id +
        "&token=" +
        token,
      { method: "POST" }
    );
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

export function registerNotificationHandlers(onSelect) {
  // Dismiss any current notifications when the app is opened.
  AppState.addEventListener("change", async (s) => {
    if (s === "active") {
      await Notifications.dismissAllNotificationsAsync();
    }
  });

  // Refresh posts if notification received when app is open.
  Notifications.addListener(async (n) => {
    if (AppState.currentState === "active") {
      if (!n.data.resolves) {
        await Notifications.dismissNotificationAsync(n.notificationId);
      }
      store.dispatch(refreshPosts());
    }

    if (onSelect && n.origin === "selected") {
      onSelect(n.data.id);
    }
  });
}
