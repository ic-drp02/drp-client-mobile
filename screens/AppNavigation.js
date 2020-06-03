import React, { Component } from "react";

import { createStackNavigator } from "@react-navigation/stack";

import Home from "./Home/Home.js";
import Search from "./Home/Search.js";
import Question from "./Question.js";
import QuestionSubmitted from "./QuestionSubmitted.js";
import PostUpdate from "./PostUpdate.js";
import Updates from "./Updates.js";
import UpdatePosted from "./UpdatePosted.js";
import UpdateDetails from "./UpdateDetails.js";
import Questions from "./Questions";
import QuestionCategory from "./QuestionCategory";

const StackNavigator = createStackNavigator();

export default function AppNavigation() {
  return (
    <StackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
    >
      <StackNavigator.Screen name="Home" component={Home} />
      <StackNavigator.Screen name="Search" component={Search} />
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
    </StackNavigator.Navigator>
  );
}
