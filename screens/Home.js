import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Appbar, Button, Title, Text, useTheme } from "react-native-paper";
import { TabView, TabBar } from "react-native-tab-view";
import { useSelector, useDispatch } from "react-redux";

import PostsList from "../components/PostsList";
import PostsListWithButton from "../components/PostsListWithButton";

import { refreshPosts } from "../store";
import { useNavigation } from "@react-navigation/native";

export default function Home({ navigation }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const favourites = useSelector((s) => s.posts.favourites);
  const updatedFavourites = favourites.filter((f) => f.updated).length;

  const [index, setIndex] = useState(0);

  useEffect(
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
        renderTabBar={(props) => (
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
        )}
        navigationState={{
          index,
          routes: [
            { key: "home", title: "Home" },
            { key: "favourites", title: "Favourites" },
          ],
        }}
        renderScene={({ route }) => {
          switch (route.key) {
            case "home":
              return <Main />;

            case "favourites":
              return <Favourites />;
          }
        }}
        initialLayout={{ width: Dimensions.get("window").width }}
        onIndexChange={(i) => {
          setIndex(i);
        }}
      />
    </>
  );
}

function Main() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const auth = useSelector((s) => s.auth);
  const posts = useSelector((s) => s.posts.latest);

  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    if (posts) {
      setRefreshing(false);
    }
  }, [posts]);

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            dispatch(refreshPosts());
          }}
        />
      }
    >
      <View style={styles.buttons}>
        <Button
          style={
            auth.user.role === "admin" ? styles.button : styles.singleButton
          }
          mode="contained"
          onPress={() => navigation.navigate("Question")}
        >
          Ask a question
        </Button>
        {auth.user.role === "admin" && (
          <Button
            style={styles.button}
            mode="contained"
            onPress={() => navigation.navigate("PostUpdate")}
          >
            Post an update
          </Button>
        )}
      </View>
      {posts && (
        <PostsListWithButton
          title="Latest"
          buttonText="View all"
          onButtonPress={() => navigation.navigate("Updates")}
          posts={posts}
        />
      )}
      {posts && (
        <PostsListWithButton
          title="Most popular"
          buttonText="More"
          onButtonPress={() => navigation.navigate("Updates")}
          posts={posts}
        />
      )}
    </ScrollView>
  );
}

function Favourites() {
  const dispatch = useDispatch();

  const favourites = useSelector((s) => s.posts.favourites);

  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    if (favourites) {
      setRefreshing(false);
    }
  }, [favourites]);

  if (favourites && favourites.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ textAlign: "center" }}>No favourite posts</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            dispatch(refreshPosts());
          }}
        />
      }
    >
      {favourites && favourites.length > 0 && (
        <View>
          <Title>Favourites</Title>
          <PostsList posts={favourites} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  button: {
    width: "48%",
    justifyContent: "center",
    marginVertical: 8,
  },
  singleButton: {
    width: "100%",
    justifyContent: "center",
    marginVertical: 8,
  },
});
