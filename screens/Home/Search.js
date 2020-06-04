import React, { useRef, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Appbar, Searchbar } from "react-native-paper";

import LatestUpdates from "../../components/LatestUpdates.js";

export default function Search({ navigation }) {
  const fullHeight = { flex: 1 };
  const ref = useRef(null);
  const [firstFocus, setFirstFocus] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    return navigation.addListener("focus", () => {
      if (!!ref.current && firstFocus) {
        ref.current.focus();
        setFirstFocus(false);
      }
    });
  }, [firstFocus]);

  return (
    <View style={fullHeight}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <View style={{ flex: 1, marginLeft: 16, marginRight: 8 }}>
            <Searchbar
              placeholder="Search"
              style={{ height: 42 }}
              ref={ref}
              onChangeText={(text) => setSearchText(text)}
            />
          </View>
        </Appbar.Header>
      </TouchableWithoutFeedback>
      <View style={fullHeight}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={{ padding: 16 }}
            keyboardShouldPersistTaps="handled"
          >
            <LatestUpdates search={searchText} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}
