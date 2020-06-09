import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import { Appbar, Searchbar, ProgressBar } from "react-native-paper";

import PostsListWithButton from "../components/PostsListWithButton";
import SectionWithButton from "../components/SectionWithButton";
import AttachmentsList from "../components/AttachmentsList";

import api from "../util/api";

export default function Search({ navigation }) {
  const DEFAULT_RESULTS = 4;

  const ref = useRef(null);
  const [firstFocus, setFirstFocus] = useState(true);
  const [searchText, setSearchText] = useState(true);
  const [foundPosts, setFoundPosts] = useState([]);
  const [foundFiles, setFoundFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return navigation.addListener("focus", () => {
      if (!!ref.current && firstFocus) {
        ref.current.focus();
        setFirstFocus(false);
      }
    });
  }, [firstFocus]);

  const update = useCallback(
    ({ text }) => {
      if (text === "") {
        // Return [] when searching for an empty strings
        setFoundPosts([]);
        setFoundFiles([]);
        return;
      }

      let ignoreOutdated = false;
      setLoading(true);

      async function search(text) {
        const postsResults = await api.searchPosts(text, 0, DEFAULT_RESULTS);
        const fileResults = await api.searchFiles(text, 0, DEFAULT_RESULTS);
        if (!postsResults.success || !fileResults.success) {
          return;
        }
        if (!ignoreOutdated) {
          // Update of found posts was not cancelled by more recent search
          setFoundPosts(postsResults.data);
          setFoundFiles(fileResults.data);
        }
      }

      search(text).then(() => setLoading(false));
      return () => {
        // Cancel update of found posts
        ignoreOutdated = true;
      };
    },
    [foundPosts, loading]
  );

  return (
    <View style={styles.fullHeight}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <View style={{ flex: 1, marginLeft: 16, marginRight: 8 }}>
            <Searchbar
              placeholder="Search"
              style={{ height: 42 }}
              ref={ref}
              onChangeText={(text) => {
                setSearchText(text);
                update({ text: text });
              }}
            />
          </View>
        </Appbar.Header>
      </TouchableWithoutFeedback>
      <View style={[styles.fullHeight, styles.contentContainer]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            <PostsListWithButton
              title="Found posts"
              buttonText="More"
              onButtonPress={() =>
                navigation.navigate("SearchPosts", { searchText: searchText })
              }
              loading={loading}
              limit={4}
              posts={foundPosts}
            />
            <SectionWithButton
              title="Related files"
              buttonText="More"
              onButtonPress={() =>
                navigation.navigate("SearchFiles", { searchText: searchText })
              }
            >
              <AttachmentsList filesWithPosts={foundFiles} />
            </SectionWithButton>
            {loading && <ProgressBar indeterminate={true} />}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  fullHeight: {
    flex: 1,
  },
});
