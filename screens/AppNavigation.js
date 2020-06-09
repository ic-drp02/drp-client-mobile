import React, { useEffect, useState } from "react";
import { AsyncStorage } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

import Home from "./Home.js";
import Search from "./Search.js";
import SearchPosts from "./SearchPosts";
import SearchFiles from "./SearchFiles";
import Question from "./Question.js";
import QuestionSubmitted from "./QuestionSubmitted.js";
import PostUpdate from "./PostUpdate.js";
import Updates from "./Updates.js";
import UpdatePosted from "./UpdatePosted.js";
import UpdateDetails from "./UpdateDetails.js";
import Questions from "./Questions";
import QuestionCategory from "./QuestionCategory";
import Welcome from "./Welcome";
import Login from "./Login";

const StackNavigator = createStackNavigator();

export default function AppNavigation() {
  const [loggedIn, setLoggedIn] = useState(undefined);

  useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem("LOGGED_IN");
      if (!value) {
        await AsyncStorage.setItem("LOGGED_IN", "false");
      }
      setLoggedIn(value === "true");
    })();
  }, []);

  if (loggedIn === undefined) {
    return <></>;
  }

  // const initialRoute = loggedIn ? "Home" : "Login";
  const initialRoute = "Login";

  return (
    <StackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initialRoute}
    >
      <StackNavigator.Screen name="Home" component={Home} />
      <StackNavigator.Screen name="Search" component={Search} />
      <StackNavigator.Screen name="SearchPosts" component={SearchPosts} />
      <StackNavigator.Screen name="SearchFiles" component={SearchFiles} />
      <StackNavigator.Screen name="Updates" component={Updates} />
      <StackNavigator.Screen name="Question" component={Question} />
      <StackNavigator.Screen
        name="QuestionSubmitted"
        component={QuestionSubmitted}
      />
      <StackNavigator.Screen name="PostUpdate" component={PostUpdate} />
      <StackNavigator.Screen name="UpdatePosted" component={UpdatePosted} />
      <StackNavigator.Screen name="UpdateDetails" component={UpdateDetails} />
      <StackNavigator.Screen name="Questions" component={Questions} />
      <StackNavigator.Screen
        name="QuestionCategory"
        component={QuestionCategory}
      />
      <StackNavigator.Screen name="Welcome" component={Welcome} />
      <StackNavigator.Screen name="Login" component={Login} />
    </StackNavigator.Navigator>
  );
}
