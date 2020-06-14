import React, { useState, useEffect } from "react";
import { View, ScrollView, RefreshControl, Dimensions } from "react-native";
import {
  Appbar,
  List,
  Badge,
  Text,
  FAB,
  useTheme,
  Portal,
  Dialog,
  Button,
} from "react-native-paper";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

import QuestionCard from "../components/QuestionCard";

import api from "../util/api";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function Question({ navigation }) {
  const fullHeight = { flex: 1 };
  const theme = useTheme();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "user", title: "My questions" },
    { key: "all", title: "All questions" },
  ]);

  const renderScene = SceneMap({
    user: UserQuestions,
    all: AllQuestions,
  });

  return (
    <View style={fullHeight}>
      <Appbar.Header style={{ elevation: 0 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Questions" />
      </Appbar.Header>
      <View style={fullHeight}>
        <TabView
          renderTabBar={(props) => (
            <TabBar
              {...props}
              style={{ backgroundColor: theme.colors.primary }}
              indicatorStyle={{ backgroundColor: theme.colors.accent }}
            />
          )}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get("window").width }}
        />
      </View>
    </View>
  );
}

function AllQuestions() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(true);
  const [subjects, setSubjects] = useState(null);

  async function refresh() {
    setRefreshing(true);

    const [sRes, qRes] = await Promise.all([
      api.getQuestionSubjects(),
      api.getQuestions(),
    ]);

    const subjects = sRes.data;

    for (const subject of subjects) {
      const count = qRes.data.filter(
        (q) => q.subject.id === subject.id && !q.resolved
      ).length;
      subject.count = count;
    }

    setSubjects(subjects);
    setRefreshing(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }
    >
      {subjects &&
        subjects.map((s) => (
          <List.Item
            key={s.id}
            title={s.name}
            right={(props) => (
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    justifyContent: "center",
                  }}
                >
                  {<Badge {...props}>{s.count}</Badge>}
                </View>
                <List.Icon {...props} icon="chevron-right" />
              </View>
            )}
            onPress={() =>
              navigation.navigate("QuestionCategory", { subject: s })
            }
          />
        ))}
    </ScrollView>
  );
}

function UserQuestions() {
  const navigation = useNavigation();
  const user = useSelector((s) => s.auth.user);

  const [refreshing, setRefreshing] = useState(true);
  const [questions, setQuestions] = useState(null);
  const [deleteQuestion, setDeleteQuestion] = useState(null);

  async function refresh() {
    setRefreshing(true);
    const res = await api.getQuestions();
    const questions = res.data.filter((q) => user.id === q.user);
    questions.reverse();
    setQuestions(questions);
    setRefreshing(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: 4, flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        {questions &&
          (questions.length !== 0 ? (
            <>
              {questions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  editable={user.id === q.user}
                  deletable={user.id === q.user}
                  onSaved={refresh}
                  canResolve={false}
                  onDelete={() => setDeleteQuestion(q)}
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
              <Text>You haven't asked any questions yet!</Text>
            </View>
          ))}
      </ScrollView>
      <Portal>
        <Dialog
          visible={deleteQuestion !== null}
          onDismiss={() => setDeleteQuestion(null)}
        >
          <Dialog.Title>Confirm</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this question?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button compact onPress={() => setDeleteQuestion(null)}>
              Cancel
            </Button>
            <Button
              compact
              color="red"
              onPress={async () => {
                await api.deleteQuestion(deleteQuestion.id);
                setDeleteQuestion(null);
                refresh();
              }}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <FAB
        style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
        icon="plus"
        onPress={() => navigation.navigate("Question")}
      />
    </View>
  );
}
