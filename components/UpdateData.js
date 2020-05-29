import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Headline, Text, ProgressBar } from "react-native-paper";

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
    return <ProgressBar color={COLOR_PRIMARY} indeterminate={true} />;
  }

  return (
    <View>
      <Headline>{data.title}</Headline>
      <Text>{data.content}</Text>
    </View>
  );
}
