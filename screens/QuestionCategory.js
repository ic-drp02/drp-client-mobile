import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Appbar, List, ProgressBar, Text } from "react-native-paper";

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
            <QuestionsList questions={questions} />
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

function QuestionsList({ questions }) {
  return (
    <>
      {questions.map((q) => (
        <List.Item key={q.id} title={q.text} onPress={() => {}} />
      ))}
    </>
  );
}
