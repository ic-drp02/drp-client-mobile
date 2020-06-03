import React from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Text, Button } from "react-native-paper";

import BigText from "../components/BigText.js";

export default function UpdatePosted({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Question submitted" />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={[styles.content, styles.center]}>
          <BigText text="Great!" />
          <Text style={styles.center}>Your question has been submitted!</Text>
          <Text style={styles.center}>
            We hope to update you as soon as possible with a response.
          </Text>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate("Home")}
          >
            Go to home screen
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  center: {
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
  },
  topMargin: {
    marginTop: 30,
  },
  button: {
    margin: 16,
    padding: 8,
  },
});
