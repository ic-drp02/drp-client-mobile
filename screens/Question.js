import React, { useState, useEffect, useCallback } from "react";
import { View, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Appbar, Button, TextInput } from "react-native-paper";

import Dropdown from "../components/Dropdown";

import api from "../util/api";

export default function Question({ navigation }) {
  const [sites, setSites] = useState(null);
  const [subjects, setSubjects] = useState(null);

  const [site, setSite] = useState(undefined);
  const [specialty, setSpecialty] = useState(undefined);
  const [subject, setSubject] = useState(undefined);
  const [query, setQuery] = useState(undefined);

  useEffect(() => {
    api.getSites().then((res) => setSites(res.data));
    api.getQuestionSubjects().then((res) => setSubjects(res.data));
  }, []);

  const submitQuestion = useCallback(() => {
    api
      .createQuestion({
        site: sites.find((s) => s.id === site).name,
        specialty,
        subject: subjects.find((s) => s.id === subject).name,
        text: query,
      })
      .then(() => navigation.navigate("Home"));
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
