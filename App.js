import React, { useEffect, useRef } from "react";
import { Provider as ReduxProvider, useSelector } from "react-redux";

import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import SideBar from "./components/SideBar.js";
import AppSnackbar from "./components/AppSnackbar";
import AppNavigation from "./screens/AppNavigation";
import Login from "./screens/Login";

import store from "./store";
import * as notifications from "./util/notifications.js";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#2f80ed",
    accent: "#f1c40f",
  },
};

const DrawerNavigator = createDrawerNavigator();
const AuthNavigator = createStackNavigator();

export default function App() {
  const navRef = useRef();

  return (
    <PaperProvider theme={theme}>
      <ReduxProvider store={store}>
        <NavigationContainer ref={navRef}>
          <AuthController>
            <DrawerNavigator.Navigator
              initialRouteName="AppNavigation"
              drawerContent={SideBar}
            >
              <DrawerNavigator.Screen
                name="AppNavigation"
                component={AppNavigation}
              />
            </DrawerNavigator.Navigator>
          </AuthController>
        </NavigationContainer>
        <AppSnackbar />
      </ReduxProvider>
    </PaperProvider>
  );
}

function AuthController({ children }) {
  const auth = useSelector((s) => s.auth);

  useEffect(() => {
    if (!!auth.user) {
      console.log("Registering push notifications");
      notifications.registerForPushNotifications();
      notifications.registerNotificationHandlers((postId) => {
        navRef.current.navigate("UpdateDetails", { postId });
      });
    }
  }, [auth]);

  if (!!auth.user) {
    return children;
  } else {
    return (
      <AuthNavigator.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        <AuthNavigator.Screen name="Login" component={Login} />
      </AuthNavigator.Navigator>
    );
  }
}
