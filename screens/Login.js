import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Button, Text, Headline, TextInput } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";

import IosKeyboardAvoidingView from "../components/IosKeyboardAvoidingView.js";

import * as auth from "../store/auth";

export default function Login() {
  const dispatch = useDispatch();

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
    switch (error.type) {
      case "InvalidEmail":
        errorMessage = "You must enter a valid email address.";
        break;

      case "Registered":
        errorMessage = "This email has already been registered.";
        break;

      case "UnauthorisedDomain":
        errorMessage =
          "You must register with an nhs.net or imperial.ac.uk email.";
        break;

      case "InvalidCredentials":
        errorMessage = "The email address or password is incorrect.";
        break;

      case "Unconfirmed":
        errorMessage =
          "Account has not been confirmed. Check your email for a confirmation link.";
        break;

      case "Unknown":
        errorMessage = error.message;
        break;
    }
  }

  return (
    <IosKeyboardAvoidingView>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.root}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/icon_full.png")}
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
        </View>
      </ScrollView>
    </IosKeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 16,
    flex: 1,
  },
  imageContainer: {
    height: 200,
    marginTop: 24,
    padding: 8,
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
