import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";

import {
  Appbar,
  Button,
  Text,
  TextInput,
  ProgressBar,
  Snackbar,
} from "react-native-paper";

import Dropdown from "../components/Dropdown";
import SnackbarContext from "../SnackbarContext";

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
  const [specialty, setSpecialty] = useState("");
  const [subject, setSubject] = useState(undefined);
  const [query, setQuery] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const snackbar = useContext(SnackbarContext);

  useEffect(() => {
    api.getSites().then((res) => {
      res.data.length > 0 && setSite(res.data[0].id);
      setSites(res.data);
    });
    api.getQuestionSubjects().then((res) => {
      res.data.length > 0 && setSubject(res.data[0].id);
      setSubjects(res.data);
    });
  }, []);

  const submitQuestion = useCallback(() => {
    setSubmitting(true);
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
        setSubmitting(false);
        if (res.success) {
          navigation.replace("QuestionSubmitted");
        } else {
          snackbar.show(
            "An error occurred while submitting your questions",
            Snackbar.DURATION_SHORT,
            {
              label: "ok",
              onPress: (hide) => hide(),
            }
          );
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
      <View style={{ flex: 1 }}>
        {sites === null || subjects === null ? (
          <ProgressBar indeterminate />
        ) : (
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <ScrollView>
              <View style={{ padding: 24 }}>
                <View style={{ marginVertical: 4 }}>
                  <Text>Which Imperial site are you at?</Text>
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
                </View>
                <View style={{ marginVertical: 4 }}>
                  <Text>What is your grade?</Text>
                  <Dropdown
                    items={grades}
                    selected={grade}
                    onSelectionChange={(v) => setGrade(v)}
                    style={{ marginVertical: 8 }}
                  />
                </View>
                <View style={{ marginVertical: 4 }}>
                  <Text>What is your specialty?</Text>
                  <TextInput
                    label="Specialty"
                    mode="outlined"
                    onChangeText={(v) => setSpecialty(v)}
                    style={{ marginVertical: 8 }}
                  />
                </View>
                <View style={{ marginVertical: 4 }}>
                  <Text>What is your question about?</Text>
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
                </View>
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
                  disabled={submitting}
                  loading={submitting}
                  style={{ marginTop: 16, padding: 8 }}
                >
                  Submit
                </Button>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  );
}
