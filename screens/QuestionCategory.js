import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import {
  Appbar,
  ProgressBar,
  Text,
  Card,
  Paragraph,
  Button,
  Divider,
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

function QuestionsList({ questions, onResolved }) {
  return (
    <ScrollView>
      {questions.map((q) => (
        <Card key={q.id} style={{ margin: 8 }}>
          <Card.Content>
            <Paragraph>{q.text}</Paragraph>
            <Divider style={{ marginVertical: 8 }} />
            <View>
              <Paragraph>
                <Text style={{ fontStyle: "italic" }}>Site:</Text> {q.site.name}
              </Paragraph>
              <Paragraph>
                <Text style={{ fontStyle: "italic" }}>Grade:</Text>{" "}
                {Object.keys(Grade).filter((g) => Grade[g] === q.grade)[0]}
              </Paragraph>
              <Paragraph>
                <Text style={{ fontStyle: "italic" }}>Specialty:</Text>{" "}
                {q.specialty}
              </Paragraph>
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
