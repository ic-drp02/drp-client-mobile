import React, { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import { Appbar, Text, useTheme } from "react-native-paper";
import { TabView, TabBar } from "react-native-tab-view";
import { useSelector, useDispatch } from "react-redux";

import Main from "./components/Main";
import Favourites from "./components/Favourites";

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
  const [index, setIndex] = useState(0);

  const favourites = useSelector((s) => s.posts.favourites);
  const updatedFavourites = countUpdates(favourites);

  useEffect(
    // Refresh posts when home screen is focused
    () => navigation.addListener("focus", () => dispatch(refreshPosts())),
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
    </>
  );
}
