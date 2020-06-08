import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Button, Text, Headline, Checkbox } from "react-native-paper";

export default function Welcome({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        top: -50,
      }}
    >
      <View style={styles.padding}>
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
          A network designed to help you, as junior doctors, get your questions
          to senior management.
        </Text>
        <Button
          mode="contained"
          style={{ margin: 8 }}
          onPress={() => navigation.goBack()}
        >
          Start
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 16,
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
