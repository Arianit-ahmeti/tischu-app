import { ThemedText } from "@components";
import { ThemedTextInput } from "@components/ThemedTextInput";
import { getCurrentSession, getProfile } from "@lib/userService";
import { Organization } from "@types";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
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
        <ThemedText variant="h3">Vereinsname:</ThemedText>
        <ThemedTextInput value={profile.name || ""} />
      </View>

      <View style={styles.container}>
        <ThemedText variant="h3">Straße:</ThemedText>
        <ThemedTextInput value={profile.street || ""} />
      </View>

      <View style={styles.container}>
        <ThemedText variant="h3">Hausnummer:</ThemedText>
        <ThemedTextInput value={profile.house_number || ""} />
      </View>

      <View style={styles.container}>
        <ThemedText variant="h3">Postleitzahl:</ThemedText>
        <ThemedTextInput value={profile.postal_code?.toString() || ""} />
      </View>

      <View style={styles.container}>
        <ThemedText variant="h3">Stadt:</ThemedText>
        <ThemedTextInput value={profile.city || ""} />
      </View>

      <View style={styles.container}>
        <ThemedText variant="h3">Land:</ThemedText>
        <ThemedTextInput value={profile.country || ""} />
      </View>

      <View style={styles.container}>
        <ThemedText variant="h3">Status:</ThemedText>
        <ThemedTextInput value={profile.status || ""} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingVertical: 5 },
});
