import React, { useState } from "react";
import {
  View,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Text,
  Card,
  Paragraph,
  Button,
  Divider,
  useTheme,
  Portal,
  Dialog,
  TextInput,
} from "react-native-paper";

import { Grade } from "drp-api-js";
import api from "../util/api";

export default function QuestionCard({
  editable,
  canResolve,
  question,
  onResolved,
  onSaved,
}) {
  const theme = useTheme();
  const labelStyle = {
    fontStyle: "italic",
    color: theme.colors.placeholder,
  };

  const [resolving, setResolving] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editContent, setEditContent] = useState(question.text);
  const [saving, setSaving] = useState(false);

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
        {editable && (
          <Button
            compact
            disabled={resolving}
            loading={resolving}
            onPress={() => setEdit(true)}
          >
            Edit
          </Button>
        )}
        {canResolve && (
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
        )}
        <Portal>
          <Dialog visible={edit} onDismiss={() => setEdit(false)}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View>
                <Dialog.Title>Edit question</Dialog.Title>
                <ScrollView>
                  <Dialog.Content>
                    <TextInput
                      multiline
                      numberOfLines={5}
                      mode="outlined"
                      value={editContent}
                      onChangeText={(v) => setEditContent(v)}
                    />
                  </Dialog.Content>
                </ScrollView>
                <Dialog.Actions>
                  <Button
                    disabled={saving}
                    loading={saving}
                    onPress={async () => {
                      setSaving(true);
                      await api.updateQuestion(question.id, editContent);
                      setSaving(false);
                      setEdit(false);
                      onSaved && onSaved();
                    }}
                  >
                    Save
                  </Button>
                </Dialog.Actions>
              </View>
            </TouchableWithoutFeedback>
          </Dialog>
        </Portal>
      </Card.Actions>
    </Card>
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
