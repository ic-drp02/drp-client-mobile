import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { Spinner, H3, Text } from "native-base";

import PostSummary from "./PostSummary.js";

import { COLOR_PRIMARY } from "../util/colors.js";

export default function UpdateData(props) {
  const [data, setData] = useState(undefined);
  const id = props.id;

  const BACKEND_ENDPOINT = "http://178.62.116.172:8000/posts";

  async function loadPost() {
    try {
      let response = await fetch(BACKEND_ENDPOINT + "/" + id.toString(), {
        method: "GET",
      });
      let json = await response.json();
      setData(json);
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
