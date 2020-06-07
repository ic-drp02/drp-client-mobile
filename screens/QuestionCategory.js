import React, { useState, useEffect } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import {
  Appbar,
  Text,
  Card,
  Paragraph,
  Button,
  Divider,
  useTheme,
} from "react-native-paper";

import { Grade } from "drp-api-js";
import api from "../util/api";

export default function Question({ route, navigation }) {
  const fullHeight = { flex: 1 };
  const { subject } = route.params;

  const [refreshing, setRefreshing] = useState(true);
  const [questions, setQuestions] = useState(null);
  const [resolving, setResolving] = useState(false);

  async function refresh() {
    setRefreshing(true);
    const res = await api.getQuestions();
    setQuestions(
      res.data.filter((q) => q.subject.id === subject.id && !q.resolved)
    );
    setRefreshing(false);
  }

  async function resolveAll() {
    setResolving(true);
    await Promise.all(questions.map((q) => api.resolveQuestion(q.id)));
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
                {questions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
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

function getGrade(value) {
  const grade = Object.keys(Grade).filter((g) => Grade[g] === value)[0];
  if (grade !== "CoreTrainee") {
    return grade;
  } else {
    return "Core Trainee";
  }
}

function QuestionCard({ question, onResolved }) {
  const theme = useTheme();
  const labelStyle = {
    fontStyle: "italic",
    color: theme.colors.placeholder,
  };

  const [resolving, setResolving] = useState(false);

  return (
    <Card style={{ margin: 4 }}>
      <Card.Content>
        <Paragraph>{question.text}</Paragraph>
        <Divider style={{ marginVertical: 8 }} />
        <View style={{ flexDirection: "row" }}>
          <View>
            <Paragraph>
              <Text style={labelStyle}>Site:</Text>
            </Paragraph>
            <Paragraph>
              <Text style={labelStyle}>Grade:</Text>
            </Paragraph>
            <Paragraph>
              <Text style={labelStyle}>Specialty:</Text>
            </Paragraph>
          </View>
          <View style={{ flex: 1 }}>
            <Paragraph style={{ textAlign: "right" }}>
              <Text> {question.site.name}</Text>
            </Paragraph>
            <Paragraph style={{ textAlign: "right" }}>
              <Text> {getGrade(question.grade)}</Text>
            </Paragraph>
            <Paragraph style={{ textAlign: "right" }}>
              <Text> {question.specialty}</Text>
            </Paragraph>
          </View>
        </View>
        <Divider style={{ marginTop: 8 }} />
      </Card.Content>
      <Card.Actions>
        <Button
          compact
          disabled={resolving}
          loading={resolving}
          onPress={async () => {
            setResolving(true);
            const res = await api.resolveQuestion(question.id);
            if (res.success) {
              onResolved(question);
            }
          }}
        >
          Resolve
        </Button>
      </Card.Actions>
    </Card>
  );
}
