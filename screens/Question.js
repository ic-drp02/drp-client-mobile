import React, { useState, useEffect, useCallback } from "react";
import { View, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Appbar, Button, TextInput } from "react-native-paper";

import Dropdown from "../components/Dropdown";

import { Grade } from "drp-api-js";
import api from "../util/api";

const grades = Object.keys(Grade).map((g) => ({
  label: g == "CoreTrainee" ? "Core trainee" : g,
  value: Grade[g],
}));

export default function Question({ navigation }) {
  const [sites, setSites] = useState(null);
  const [subjects, setSubjects] = useState(null);

  const [site, setSite] = useState(undefined);
  const [grade, setGrade] = useState(Grade.Consultant);
  const [specialty, setSpecialty] = useState(undefined);
  const [subject, setSubject] = useState(undefined);
  const [query, setQuery] = useState(undefined);

  useEffect(() => {
    api.getSites().then((res) => setSites(res.data));
    api.getQuestionSubjects().then((res) => setSubjects(res.data));
  }, []);

  const submitQuestion = useCallback(() => {
    api
      .createQuestions({
        site: sites.find((s) => s.id === site).name,
        specialty,
        grade,
        questions: [
          {
            subject: subjects.find((s) => s.id === subject).name,
            text: query,
          },
        ],
      })
      .then((res) => {
        if (res.success) {
          navigation.navigate("Home");
        } else {
          console.warn("Failed with code " + res.status);
        }
      });
  }, [site, specialty, subject, query, sites, subjects]);

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Ask a question" />
        </Appbar.Header>
      </TouchableWithoutFeedback>
      <View style={{ flex: 1, padding: 24 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            <Dropdown
              items={
                !!sites
                  ? sites.map((site) => ({
                      label: site.name,
                      value: site.id,
                    }))
                  : []
              }
              selected={site}
              onSelectionChange={(s) => setSite(s)}
              style={{ marginVertical: 8 }}
            />
            <Dropdown
              items={grades}
              selected={grade}
              onSelectionChange={(v) => setGrade(v)}
              style={{ marginVertical: 8 }}
            />
            <TextInput
              label="Specialty"
              mode="outlined"
              onChangeText={(v) => setSpecialty(v)}
              style={{ marginVertical: 8 }}
            />
            <Dropdown
              items={
                !!subjects
                  ? subjects.map((subject) => ({
                      label: subject.name,
                      value: subject.id,
                    }))
                  : []
              }
              selected={subject}
              onSelectionChange={(s) => setSubject(s)}
              style={{ marginVertical: 8 }}
            />
            <TextInput
              label="Query"
              mode="outlined"
              multiline={true}
              numberOfLines={7}
              onChangeText={(v) => setQuery(v)}
              style={{ marginVertical: 8 }}
            />
            <Button
              mode="contained"
              onPress={submitQuestion}
              style={{ marginVertical: 8 }}
            >
              Submit
            </Button>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}
