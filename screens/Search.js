import React, { useRef, useEffect, useState, useCallback } from "react";
import { View, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Appbar, Searchbar, ProgressBar, Text } from "react-native-paper";
import { useSelector } from "react-redux";

import PostsList from "../components/PostsList.js";
import InfiniteScrollView from "../components/InfiniteScrollView.js";

import { showInfoSnackbar } from "../util/snackbar";
import api from "../util/api";

export default function Search({ navigation, route }) {
  const DEFAULT_SEARCH_LIMIT = 10;
  const fullHeight = { flex: 1 };

  const isInternetReachable = useSelector(
    (s) => s.connection.isInternetReachable
  );

  const ref = useRef(null);
  const guidelinesOnly = route.params ? route.params.guidelinesOnly : false;
  const tag = route.params ? route.params.tag : undefined;
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

  useEffect(() => {
    update(searchText);
  }, []);

  const update = useCallback(
    ({ text, loadMore }) => {
      if (!isInternetReachable) {
        navigation.goBack();
        showInfoSnackbar("Search is unavailable while offline!");
        return;
      }

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
        setLoadedAll(false);
      } else if (loading) {
        /* Search triggered through reaching end of the list,
           but other request is pending - cancel */
        return;
      }
      setLoading(true);

      async function search(text, fetchNumber) {
        const results = await api.searchPosts({
          searched: text,
          page: 0,
          results_per_page: fetchNumber,
          guidelines_only: guidelinesOnly,
          tag: tag ? tag.name : undefined,
        });
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
              value={searchText}
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
            <PostsList posts={foundPosts} showAttachments={true} />
            {loadedAll && (
              <Text style={{ textAlign: "center" }}>No more results</Text>
            )}
            {loading && <ProgressBar indeterminate={true} />}
          </InfiniteScrollView>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}
