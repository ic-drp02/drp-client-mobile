import React, { useState } from "react";
import { View, Image, StyleSheet, AsyncStorage } from "react-native";
import { Button, Text, Headline, TextInput } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import IosKeyboardAvoidingView from "../components/IosKeyboardAvoidingView.js";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(false);

  async function login() {
    setInvalid(false);
    setLoading(true);

    if ((email !== "test@nhs.net" || password !== "password") && email !== "") {
      setInvalid(true);
      setLoading(false);
      return;
    }

    await AsyncStorage.setItem("LOGGED_IN", "true");

    navigation.replace("Home");
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
            {invalid && (
              <Text style={{ textAlign: "center", color: "red" }}>
                The email address or password is incorrect.
              </Text>
            )}
            <TextInput
              mode="outlined"
              label="Email Address"
              autoCompleteType="email"
              textContentType="emailAddress"
              style={{ marginVertical: 8 }}
              onChangeText={(v) => setEmail(v)}
            />
            <TextInput
              mode="outlined"
              label="Password"
              secureTextEntry
              autoCompleteType="password"
              textContentType="password"
              style={{ marginVertical: 8 }}
              onChangeText={(v) => setPassword(v)}
            />
          </View>
          <Button
            mode="contained"
            style={{ margin: 8 }}
            disabled={loading}
            loading={loading}
            onPress={login}
          >
            Login
          </Button>
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
