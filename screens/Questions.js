import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Appbar, List, ProgressBar, Text, Badge } from "react-native-paper";

import api from "../util/api";

export default function Question({ navigation }) {
  const fullHeight = { flex: 1 };

  const [subjects, setSubjects] = useState(null);

  useEffect(() => {
    Promise.all([api.getQuestionSubjects(), api.getQuestions()]).then(
      ([sRes, qRes]) => {
        const subjects = sRes.data;
        for (const subject of subjects) {
          const count = qRes.data.filter((q) => q.subject.id == subject.id)
            .length;
          subject.count = count;
        }
        setSubjects(subjects);
      }
    );
  }, []);

  return (
    <View style={fullHeight}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Questions" />
      </Appbar.Header>
      <View style={fullHeight}>
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
      </View>
    </View>
  );
}