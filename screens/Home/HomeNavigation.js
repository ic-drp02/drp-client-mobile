import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Home.js'
import Search from './Search.js'

const StackNavigator = createStackNavigator();

export default function HomeNavigation({ navigation }) {
    return (
      <StackNavigator.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Home"
      >
        <StackNavigator.Screen name="Home" component={Home} />
        <StackNavigator.Screen name="Search" component={Search} />
      </StackNavigator.Navigator>
    );
  }