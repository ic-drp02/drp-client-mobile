import React, { useState, useEffect } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { Appbar, List, Badge } from "react-native-paper";

import api from "../util/api";

export default function Question({ navigation }) {
  const fullHeight = { flex: 1 };

  const [refreshing, setRefreshing] = useState(true);
  const [subjects, setSubjects] = useState(null);

  async function refresh() {
    setRefreshing(true);

    const [sRes, qRes] = await Promise.all([
      api.getQuestionSubjects(),
      api.getQuestions(),
    ]);

    const subjects = sRes.data;

    for (const subject of subjects) {
      const count = qRes.data.filter((q) => q.subject.id == subject.id).length;
      subject.count = count;
    }

    setSubjects(subjects);
    setRefreshing(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <View style={fullHeight}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Questions" />
      </Appbar.Header>
      <View style={fullHeight}>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
        >
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
        </ScrollView>
      </View>
    </View>
  );
}
