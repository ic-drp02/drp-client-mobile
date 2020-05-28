import React, { Component } from "react";

import { createStackNavigator } from "@react-navigation/stack";

import HomeNavigation from "./Home/HomeNavigation.js";
import Question from "./Question.js";
import PostUpdate from "./PostUpdate.js";

const StackNavigator = createStackNavigator();

export default function AppNavigation() {
  return (
    <StackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
    >
      <StackNavigator.Screen name="Home" component={HomeNavigation} />
      <StackNavigator.Screen name="Question" component={Question} />
      <StackNavigator.Screen name="PostUpdate" component={PostUpdate} />
    </StackNavigator.Navigator>
  );
}
