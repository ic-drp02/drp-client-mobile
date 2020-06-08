import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Title } from "react-native-paper";

export default function PostsListWithButton({
  title,
  buttonText,
  onButtonPress,
  ...props
}) {
  return (
    <View {...props}>
      <View style={styles.headingWithButton}>
        <Title>{title}</Title>
        <Button compact mode="text" onPress={onButtonPress}>
          {buttonText}
        </Button>
      </View>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  headingWithButton: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
