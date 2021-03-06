import React, { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import { Appbar, Text, useTheme, Banner } from "react-native-paper";
import { TabView, TabBar } from "react-native-tab-view";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as FileSystem from "expo-file-system";

import Main from "./components/Main";
import Favourites from "./components/Favourites";
import { SETTINGS_OPTIONS } from "../../util/settingsOptions";
import { FREE_SPACE_THRESHOLD } from "../../util/downloadStatus";

import { refreshPosts } from "../../store";

const routes = [
  { key: "home", title: "Home" },
  { key: "favourites", title: "Favourites" },
];

function renderScene({ route }) {
  switch (route.key) {
    case "home":
      return <Main />;

    case "favourites":
      return <Favourites />;
  }
}

function countUpdates(favourites) {
  return favourites.reduce((n, v) => (v.updated ? n + 1 : n), 0);
}

export default function Home({ navigation }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isInternetReachable = useSelector(
    (s) => s.connection.isInternetReachable
  );
  const settings = useSelector((s) => s.settings.settings);
  const favourites = useSelector((s) => s.posts.favourites);
  const updatedFavourites = countUpdates(favourites);

  const [freeSpace, setFreeSpace] = useState(null);
  const [index, setIndex] = useState(0);
  const [connectionDismissed, setConnectionDismissed] = useState(false);
  const [storageDismissed, setStorageDismissed] = useState(false);

  async function updateFreeSpace() {
    setFreeSpace(await FileSystem.getFreeDiskStorageAsync());
  }

  useEffect(
    // Refresh posts when home screen is focused
    () =>
      navigation.addListener("focus", () => {
        updateFreeSpace();
        dispatch(refreshPosts());
      }),
    [navigation]
  );

  function TabLabel({ route, color }) {
    let text = route.title.toUpperCase();
    if (route.title === "Favourites" && updatedFavourites > 0) {
      text += ` (${updatedFavourites})`;
    }
    return <Text style={{ color }}>{text}</Text>;
  }

  function renderTabBar(props) {
    return (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: theme.colors.accent }}
        style={{ backgroundColor: theme.colors.primary }}
        renderLabel={({ route, focused, color }) => (
          <Text style={{ color }}>
            <TabLabel route={route} focused={focused} color={color} />
          </Text>
        )}
      />
    );
  }

  return (
    <>
      <Appbar.Header style={{ elevation: 0 }}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="ICON" />
        <Appbar.Action
          icon="magnify"
          onPress={() => navigation.navigate("Search")}
        />
      </Appbar.Header>
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        initialLayout={{ width: Dimensions.get("window").width }}
        onIndexChange={setIndex}
      />
      <Banner
        visible={!isInternetReachable && !connectionDismissed}
        actions={[
          {
            label: "Dismiss",
            onPress: () => setConnectionDismissed(true),
          },
        ]}
        icon={({ size }) => <Icon name="signal-wifi-off" size={size} />}
      >
        You are offline, some features of the app may not be available.{" "}
        {settings &&
          (settings[SETTINGS_OPTIONS.STORE_FAVOURITES_OFFLINE]
            ? "Offline favourites storage is enabled in the settings, so you will be able to access your favourite posts."
            : "The offline favourites storage is disabled in the settings, so only cached posts will be available.")}
      </Banner>
      <Banner
        visible={
          settings[SETTINGS_OPTIONS.STORE_FILES] &&
          freeSpace !== null &&
          freeSpace < FREE_SPACE_THRESHOLD &&
          !storageDismissed
        }
        actions={[
          {
            label: "Dismiss",
            onPress: () => setStorageDismissed(true),
          },
        ]}
        icon={({ size }) => <Icon name="disc-full" size={size} />}
      >
        It seems that your device is running out of storage space. Disabling
        storing files from favourite posts in the app settings or removing some
        of your favourite posts may free up some space on the disc.
      </Banner>
    </>
  );
}
