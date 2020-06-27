import React, { useState, useEffect } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { Appbar, Text, Button } from "react-native-paper";
import { useSelector } from "react-redux";

import QuestionCard from "../components/QuestionCard";

import api from "../util/api";
import { showInfoSnackbar } from "../util/snackbar";

export default function Question({ route, navigation }) {
  const fullHeight = { flex: 1 };
  const { subject } = route.params;
  const user = useSelector((s) => s.auth.user);
  const isInternetReachable = useSelector(
    (s) => s.connection.isInternetReachable
  );

  const [refreshing, setRefreshing] = useState(true);
  const [questions, setQuestions] = useState(null);
  const [resolving, setResolving] = useState(false);

  async function refresh() {
    if (!isInternetReachable) {
      showInfoSnackbar("The questions cannot be loaded while offline!");
      navigation.goBack();
      return;
    }

    setRefreshing(true);
    const res = await api.getQuestions();
    setQuestions(res.data.filter((q) => q.subject.id === subject.id));
    setRefreshing(false);
  }

  async function resolveAll() {
    if (!isInternetReachable) {
      showInfoSnackbar("Questions cannot be resolved while offline!");
      navigation.goBack();
      return;
    }

    setResolving(true);
    await Promise.all(
      questions.filter((q) => !q.resolved).map((q) => api.resolveQuestion(q.id))
    );
    setResolving(false);
    setQuestions([]);
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <View style={fullHeight}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={subject.name} />
      </Appbar.Header>
      <View style={fullHeight}>
        <ScrollView
          contentContainerStyle={{ padding: 4, flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
        >
          {questions &&
            (questions.length !== 0 ? (
              <>
                {user.role === "admin" && (
                  <View style={{ flexDirection: "row-reverse" }}>
                    <Button
                      mode="contained"
                      style={{ margin: 4 }}
                      icon="check-all"
                      disabled={resolving}
                      loading={resolving}
                      onPress={resolveAll}
                    >
                      Resolve all
                    </Button>
                  </View>
                )}
                {questions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    editable={user.id === q.user}
                    onSaved={refresh}
                    canResolve={!q.resolved && user.role === "admin"}
                    onResolved={(question) =>
                      setQuestions(
                        questions.filter((q) => q.id !== question.id)
                      )
                    }
                  />
                ))}
              </>
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text>
                  Looks like there are no questions for this category!
                </Text>
              </View>
            ))}
        </ScrollView>
      </View>
    </View>
  );
}
