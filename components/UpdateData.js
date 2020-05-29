import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { Spinner, H3, Text } from "native-base";

import { getDetails } from "../util/api.js";

import { COLOR_PRIMARY } from "../util/colors.js";

export default function UpdateData(props) {
  const [data, setData] = useState(undefined);
  const id = props.id;

  async function loadPost() {
    try {
      setData(await getDetails(id));
    } catch (error) {
      console.warn(error);
    }
  }

  useEffect(() => {
    if (data === undefined) {
      loadPost();
    }
  }, [data]);

  if (data === undefined) {
    return <Spinner color={COLOR_PRIMARY} />;
  }

  return (
    <View>
      <H3 style={styles.margin}>{data.title}</H3>
      <Text style={styles.margin}>{data.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  margin: {
    margin: 10,
  },
});
