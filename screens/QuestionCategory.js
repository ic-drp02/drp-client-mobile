import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  Appbar,
  ProgressBar,
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

  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    api.getQuestions().then((res) => {
      setQuestions(res.data.filter((q) => q.subject.id == subject.id));
    });
  }, []);

  return (
    <View style={fullHeight}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={subject.name} />
      </Appbar.Header>
      <View style={fullHeight}>
        {!questions && <ProgressBar indeterminate />}
        {questions &&
          (questions.length !== 0 ? (
            <QuestionsList
              questions={questions}
              onResolved={(question) =>
                setQuestions(questions.filter((q) => q.id !== question.id))
              }
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>Looks like there are no questions for this category!</Text>
            </View>
          ))}
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

function QuestionsList({ questions, onResolved }) {
  const theme = useTheme();
  const labelStyle = {
    fontStyle: "italic",
    color: theme.colors.placeholder,
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 4 }}>
      {questions.map((q) => (
        <Card key={q.id} style={{ margin: 4 }}>
          <Card.Content>
            <Paragraph>{q.text}</Paragraph>
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
                  <Text> {q.site.name}</Text>
                </Paragraph>
                <Paragraph style={{ textAlign: "right" }}>
                  <Text> {getGrade(q.grade)}</Text>
                </Paragraph>
                <Paragraph style={{ textAlign: "right" }}>
                  <Text> {q.specialty}</Text>
                </Paragraph>
              </View>
            </View>
            <Divider style={{ marginTop: 8 }} />
          </Card.Content>
          <Card.Actions>
            <Button compact onPress={() => onResolved(q)}>
              Resolved
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontStyle: "italic",
  },
});
