import React, { useState, useEffect, useCallback, useContext } from "react";
import { useDispatch } from "react-redux";
import {
  View,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
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
import IosKeyboardAvoidingView from "../components/IosKeyboardAvoidingView.js";

import { Grade } from "drp-api-js";
import api from "../util/api";
import { showSnackbar, hideSnackbar } from "../store";

const grades = Object.keys(Grade).map((g) => ({
  label: g == "CoreTrainee" ? "Core trainee" : g,
  value: Grade[g],
}));

export default function Question({ navigation }) {
  const [sites, setSites] = useState(null);
  const [subjects, setSubjects] = useState(null);

  const [site, setSite] = useState(undefined);
  const [grade, setGrade] = useState(undefined);
  const [specialty, setSpecialty] = useState("");
  const [subject, setSubject] = useState(undefined);
  const [query, setQuery] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

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
        site: site.label,
        specialty,
        grade: grade.value,
        questions: [
          {
            subject: subject.label,
            text: query,
          },
        ],
      })
      .then((res) => {
        setSubmitting(false);
        if (res.success) {
          navigation.replace("QuestionSubmitted");
        } else {
          dispatch(
            showSnackbar(
              "An error occurred while submitting your questions",
              Snackbar.DURATION_SHORT,
              { label: "ok", onPress: () => dispatch(hideSnackbar()) }
            )
          );
        }
      });
  }, [site, specialty, subject, query, sites, subjects]);

  const siteItems = !!sites
    ? sites.map((site) => ({
        label: site.name,
        value: site.id,
      }))
    : [];

  const subjectItems = !!subjects
    ? subjects.map((subject) => ({
        label: subject.name,
        value: subject.id,
      }))
    : [];

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Appbar.Header style={{ zIndex: 10 }}>
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
            <IosKeyboardAvoidingView>
              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.formContainer}>
                  <DropdownField
                    label="Which Imperial site are you at?"
                    items={siteItems}
                    selected={site}
                    onSelectionChange={(s) => setSite(s)}
                  />
                  <DropdownField
                    label="What is your grade?"
                    items={grades}
                    selected={grade}
                    onSelectionChange={(v) => setGrade(v)}
                  />
                  <TextField
                    label="What is your specialty?"
                    short="Specialty"
                    onChangeText={(v) => setSpecialty(v)}
                  />
                  <DropdownField
                    label="What is your question about?"
                    items={subjectItems}
                    selected={subject}
                    onSelectionChange={(s) => setSubject(s)}
                  />
                  <TextInput
                    label="Query"
                    mode="outlined"
                    multiline={true}
                    numberOfLines={7}
                    onChangeText={(v) => setQuery(v)}
                    style={styles.fieldContainer}
                  />
                  <Button
                    mode="contained"
                    onPress={submitQuestion}
                    disabled={submitting}
                    loading={submitting}
                    style={styles.submit}
                  >
                    Submit
                  </Button>
                </View>
              </ScrollView>
            </IosKeyboardAvoidingView>
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  );
}

function DropdownField({ label, items, selected, onSelectionChange }) {
  return (
    <View style={styles.fieldContainer}>
      <Text>{label}</Text>
      <Dropdown
        items={items}
        selected={selected}
        onSelectionChange={onSelectionChange}
        style={styles.field}
      />
    </View>
  );
}

function TextField({ label, short, onChangeText }) {
  return (
    <View style={styles.fieldContainer}>
      <Text>{label}</Text>
      <TextInput
        label={short}
        mode="outlined"
        onChangeText={onChangeText}
        style={styles.field}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 24,
  },
  fieldContainer: {
    marginVertical: 4,
  },
  field: {
    marginVertical: 8,
  },
  submit: {
    marginTop: 16,
    padding: 8,
  },
});
