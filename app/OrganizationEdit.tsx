import { AlertDialog, ThemedButton, ThemedText, ThemedTextInput } from "@components";
import { ERROR_MESSAGES } from "@lib/constants/messages";
import { getCurrentSession, getProfile, updateProfile } from "@lib/userService";
import { theme } from "@theme";
import { Organization } from "@types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function OrganizationEdit() {
  const router = useRouter();
  const [profile, setProfile] = useState<Organization | null>(null);
  const [originalProfile, setOriginalProfile] = useState<Organization | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  async function loadProfile() {
    try {
      setLoading(true);
      //get user id
      const session = await getCurrentSession();
      if (!session?.user) {
        Alert.alert("Fehler", ERROR_MESSAGES.ORG_SESSION_FAILED);
        return;
      }
      //fetch profile-data
      const data = await getProfile(session.user.id);
      if (data) {
        setProfile(data);
        setOriginalProfile(data);
      } else {
        Alert.alert("Fehler", ERROR_MESSAGES.ORG_PROFILE_LOAD_FAILED);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Fehler", ERROR_MESSAGES.ORG_PROFILE_LOAD_FAILED);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    if (!profile || !originalProfile) return;
    if (profile == originalProfile) router.back();

    setSaving(true);
    const updated = await updateProfile(profile.id, profile);
    if (updated) {
      setAlertVisible(true);
    } else {
      Alert.alert("Fehler", ERROR_MESSAGES.ANIMAL_UPDATE_FAILED);
    }
    setSaving(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <ThemedText>{ERROR_MESSAGES.ORG_NOT_FOUND}</ThemedText>
      </View>
    );
  }

  return (
    <>
      <AlertDialog
        visible={alertVisible}
        title="Erfolg"
        message="Profil wurde erfolgreich aktualisiert!"
        buttons={[
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]}
        onDismiss={() => setAlertVisible(false)}
      />

      <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: theme.colors.background.base }}>
        <View style={styles.container}>
          <ThemedText variant="h3" style={styles.label}>
            Vereinsname:
          </ThemedText>
          <ThemedTextInput value={profile.name || ""} onChangeText={(text) => setProfile({ ...profile, name: text })} />

          <ThemedText variant="h3" style={styles.label}>
            Straße:
          </ThemedText>
          <ThemedTextInput
            value={profile.street || ""}
            onChangeText={(text) => setProfile({ ...profile, street: text })}
          />

          <ThemedText variant="h3" style={styles.label}>
            Hausnummer:
          </ThemedText>
          <ThemedTextInput
            value={profile.house_number || ""}
            onChangeText={(text) => setProfile({ ...profile, house_number: text })}
          />

          <ThemedText variant="h3" style={styles.label}>
            Postleitzahl:
          </ThemedText>
          <ThemedTextInput
            value={profile.postal_code?.toString() || ""}
            keyboardType="numeric"
            onChangeText={(text) => setProfile({ ...profile, postal_code: text ? parseInt(text) : null })}
          />

          <ThemedText variant="h3" style={styles.label}>
            Stadt:
          </ThemedText>
          <ThemedTextInput value={profile.city || ""} onChangeText={(text) => setProfile({ ...profile, city: text })} />

          <ThemedText variant="h3" style={styles.label}>
            Land:
          </ThemedText>
          <ThemedTextInput
            value={profile.country || ""}
            onChangeText={(text) => setProfile({ ...profile, country: text })}
          />

          <View style={styles.buttonContainer}>
            <ThemedButton onPress={handleSave} disabled={saving}>
              Speichern
            </ThemedButton>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background.base },
  label: { marginTop: 16, marginBottom: 4 },
  buttonContainer: { marginTop: 32, marginBottom: 40 },
});
