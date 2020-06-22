import React, { useState } from "react";
import { View, Image, ScrollView, StyleSheet, Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  Text,
  Headline,
  TextInput,
  useTheme,
} from "react-native-paper";

import IosKeyboardAvoidingView from "../../components/IosKeyboardAvoidingView.js";

import * as auth from "../../store/auth";
import api from "../../util/api.js";
import mapErrorToReadableMessage from "./utils.js";

export default function Login() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const error = useSelector((s) => s.auth.error);
  const loading = useSelector((s) => s.auth.loading);
  const registering = useSelector((s) => s.auth.registering);
  const registered = useSelector((s) => s.auth.registered);

  async function login() {
    dispatch(auth.login(email, password));
  }

  async function register() {
    dispatch(auth.register(email, password));

    setEmail("");
    setPassword("");
  }

  let errorMessage;
  if (!!error) {
    errorMessage = mapErrorToReadableMessage(error);
  }

  return (
    <IosKeyboardAvoidingView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/icon_full.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <Headline style={styles.text}>
            Welcome to ICON, the Imperial Comms Network
          </Headline>
          <Text style={styles.text}>
            A network facilitating clear communication with senior management
            and easy access to trust guidelines
          </Text>
          <View style={{ marginHorizontal: 8, marginVertical: 16 }}>
            {registered && (
              <Text style={{ textAlign: "center", color: "blue" }}>
                Please check your email for a confirmation link.
              </Text>
            )}
            {!!errorMessage && (
              <Text style={{ textAlign: "center", color: "red" }}>
                {errorMessage}
              </Text>
            )}
            <TextInput
              mode="outlined"
              label="Email Address"
              autoCompleteType="email"
              textContentType="emailAddress"
              style={{ marginVertical: 8 }}
              value={email}
              onChangeText={(v) => setEmail(v)}
            />
            <TextInput
              mode="outlined"
              label="Password"
              secureTextEntry
              autoCompleteType="password"
              textContentType="password"
              style={{ marginVertical: 8 }}
              value={password}
              onChangeText={(v) => setPassword(v)}
            />
          </View>
          <View
            style={{
              marginHorizontal: 8,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              mode="contained"
              style={{ width: "48%" }}
              disabled={registering || registered}
              loading={registering}
              onPress={register}
            >
              Register
            </Button>
            <Button
              mode="contained"
              style={{ width: "48%" }}
              disabled={loading}
              loading={loading}
              onPress={login}
            >
              Login
            </Button>
          </View>
          <Text
            style={{
              color: theme.colors.primary,
              marginHorizontal: 8,
              marginVertical: 16,
            }}
            onPress={() =>
              Linking.openURL(api.baseUrl + "/auth/reset_password")
            }
          >
            Forgot password
          </Text>
        </View>
      </ScrollView>
    </IosKeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  content: {
    padding: 16,
  },
  imageContainer: {
    height: 200,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  text: {
    textAlign: "center",
    margin: 8,
  },
});
