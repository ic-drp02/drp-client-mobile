import React, { useRef, useEffect, useState, useCallback } from "react";
import { View, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Appbar, Searchbar, ProgressBar, Text } from "react-native-paper";

import PostsList from "../../components/PostsList.js";
import InfiniteScrollView from "../../components/InfiniteScrollView.js";

import api from "../../util/api";

export default function Search({ navigation }) {
  const DEFAULT_SEARCH_LIMIT = 10;
  const fullHeight = { flex: 1 };
  const ref = useRef(null);
  const [firstFocus, setFirstFocus] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [foundPosts, setFoundPosts] = useState([]);
  const [limit, setLimit] = useState(DEFAULT_SEARCH_LIMIT);
  const [loading, setLoading] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false);

  useEffect(() => {
    return navigation.addListener("focus", () => {
      if (!!ref.current && firstFocus) {
        ref.current.focus();
        setFirstFocus(false);
      }
    });
  }, [firstFocus]);

  const update = useCallback(
    ({ text, loadMore }) => {
      if (text === "" || (text === undefined && searchText == "")) {
        // Return [] when searching for an empty strings
        setFoundPosts([]);
        return;
      }

      let ignoreOutdated = false;
      // Keep limit in a temporary variable so that it can be updated synchronously
      let currentLimit = limit;

      if (loadMore === true && !loading) {
        if (foundPosts.length < currentLimit) {
          // No more posts to load
          setLoadedAll(true);
          return;
        }
        currentLimit = currentLimit + DEFAULT_SEARCH_LIMIT;
        setLimit(currentLimit);
      } else if (!loadMore) {
        /* Search triggered through change of search term,
           reset limit and carry on with search */
        currentLimit = DEFAULT_SEARCH_LIMIT;
        setLimit(currentLimit);
      } else if (loading) {
        /* Search triggered through reaching end of the list,
           but other request is pending - cancel */
        return;
      }
      setLoading(true);

      async function search(text, fetchNumber) {
        const results = await api.searchPosts(text, 0, fetchNumber);
        if (!results.success) {
          return;
        }
        if (!ignoreOutdated) {
          // Update of found posts was not cancelled by more recent search
          setFoundPosts(results.data);
        }
      }

      search(text ? text : searchText, currentLimit).then(() =>
        setLoading(false)
      );
      return () => {
        // Cancel update of found posts
        ignoreOutdated = true;
      };
    },
    [foundPosts, searchText, limit, loading]
  );

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
              onChangeText={(text) => {
                setSearchText(text);
                update({ text: text });
              }}
            />
          </View>
        </Appbar.Header>
      </TouchableWithoutFeedback>
      <View style={fullHeight}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <InfiniteScrollView
            onEndReached={() => update({ loadMore: true })}
            onEndReachedThreshold={30}
          >
            <PostsList posts={foundPosts} />
            {loadedAll && (
              <Text style={{ textAlign: "center" }}>No more results</Text>
            )}
          </InfiniteScrollView>
        </TouchableWithoutFeedback>
        {loading && <ProgressBar indeterminate={true} />}
      </View>
    </View>
  );
}
