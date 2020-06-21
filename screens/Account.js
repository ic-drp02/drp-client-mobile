import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Appbar,
  Text,
  TextInput,
  Title,
  Button,
  Snackbar,
} from "react-native-paper";

import api from "../util/api";
import { showSnackbar, hideSnackbar, logout } from "../store";

export default function Account({ navigation }) {
  const fullHeight = { flex: 1 };
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [info, setInfo] = useState(null);

  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [saving, setSaving] = useState(false);

  async function fetchUserInfo() {
    const res = await fetch(api.baseUrl + `/api/users/${user.id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (res.status !== 200) {
      console.warn("request failed with status " + res.status);
    } else {
      setInfo(await res.json());
    }
  }

  useEffect(() => {
    fetchUserInfo();
  }, [user]);

  async function savePassword() {
    if (
      !newPassword ||
      newPassword.length < 8 ||
      newPassword !== confirmPassword
    ) {
      return;
    }

    setSaving(true);

    const res = await fetch(api.baseUrl + `/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: newPassword,
      }),
    });

    if (res.status !== 200) {
      console.warn("request failed with status " + res.status);
    } else {
      dispatch(
        showSnackbar("Password has been updated", Snackbar.DURATION_SHORT, {
          label: "ok",
          onPress: () => dispatch(hideSnackbar()),
        })
      );
    }

    setSaving(false);
  }

  return (
    <View style={fullHeight}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Account Settings"
          subtitle={!!info ? info.email : ""}
        />
      </Appbar.Header>
      <View style={fullHeight}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Title>Change password</Title>
          <TextInput
            style={styles.input}
            mode="outlined"
            label="New password"
            secureTextEntry
            autoCompleteType="password"
            textContentType="newPassword"
            error={!!newPassword && newPassword.length < 8}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          {!!newPassword && newPassword.length < 8 && (
            <Text style={{ color: "red" }}>
              Password must be at least 8 characters
            </Text>
          )}
          <TextInput
            style={styles.input}
            mode="outlined"
            label="Confirm new password"
            secureTextEntry
            autoCompleteType="password"
            textContentType="password"
            error={confirmPassword !== null && confirmPassword !== newPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {confirmPassword !== null && confirmPassword !== newPassword && (
            <Text style={{ color: "red" }}>Passwords don't match</Text>
          )}
          <Button
            style={styles.button}
            mode="contained"
            disabled={saving}
            loading={saving}
            onPress={savePassword}
          >
            Save
          </Button>
          <Button mode="contained" onPress={() => dispatch(logout())}>
            Sign out
          </Button>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 8,
    marginBottom: 4,
  },
  button: {
    marginVertical: 16,
  },
});
