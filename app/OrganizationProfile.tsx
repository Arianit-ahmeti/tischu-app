import { getCurrentSession, getProfile } from "@lib/userService";
import { Organization } from "@types";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { ERROR_MESSAGES } from "../lib/constants/messages";

const initialProfileState: Organization = {
  id: "",
  created_at: "",
  name: null,
  street: null,
  house_number: null,
  postal_code: null,
  city: null,
  country: null,
  status: null,
};

export default function OrganizationProfile() {
  const [profile, setProfile] = useState<Organization>(initialProfileState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  async function loadProfileData() {
    setLoading(true);
    const session = await getCurrentSession();

    if (!session || !session.user) {
      Alert.alert("Fehler: ", ERROR_MESSAGES.ORG_SESSION_FAILED);
      setLoading(false);
      return;
    }
    const user_id = session.user.id;
    try {
      const profileData = await getProfile(user_id);
      if (profileData) {
        setProfile({ ...initialProfileState, ...profileData });
      } else {
        Alert.alert("Fehler:", ERROR_MESSAGES.ORG_PROFILE_LOAD_FAILED);
      }
    } catch (e) {
      Alert.alert("Fehler: ", ERROR_MESSAGES.ORG_PROFILE_LOAD_FAILED);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ fontWeight: "bold" }}>Vereinsname:</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>{profile.name}</Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={{ fontWeight: "bold" }}>Straße:</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>{profile.street}</Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={{ fontWeight: "bold" }}>Hausnummer:</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>{profile.house_number}</Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={{ fontWeight: "bold" }}>Postleitzahl:</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>{profile.postal_code}</Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={{ fontWeight: "bold" }}>Stadt:</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>{profile.city}</Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={{ fontWeight: "bold" }}>Land:</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>{profile.country}</Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={{ fontWeight: "bold" }}>Status:</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>{profile.status}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 10 },
  inputBox: {
    backgroundColor: "#fff",
    borderColor: "#5f5f5fff",
    borderWidth: 1,
    borderRadius: 5,
    height: 45,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 16,
    color: "#000",
  },
});
