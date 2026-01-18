import { ColumnView, RowView, ThemedButton, ThemedText, ThemedTextInput } from "@components";
import { useSupabaseSession } from "@hooks/useSupabaseSession";
import { loadUserContacts, saveUserContacts, updateUserContacts } from "@lib/adoptionService";
import { ERROR_MESSAGES } from "@lib/constants/messages";
import { theme } from "@theme";
import { UserContact } from "@types";
import { isLoading } from "expo-font";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdoptionFormUserContact() {
  const router = useRouter();
  const { session, isLoading: isSessionLoading } = useSupabaseSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prefilledContact, setPrefilledContact] = useState(false);
  const [contacts, setContacts] = useState<UserContact>({
    user_id: session?.user.id || null,
    full_name: null,
    street: null,
    house_nr: null,
    postal_code: null,
    city: null,
    country: null,
    mail: null,
    phone: null,
  });
  let paramAnimal = useLocalSearchParams().animalId;

  async function getData() {
    setLoading(true);
    if (session?.user?.id) {
      try {
        const data = await loadUserContacts(session.user.id);
        if (data) {
          setContacts(data);
          setPrefilledContact(true);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    let contacted;
    try {
      if (prefilledContact) {
        contacted = await updateUserContacts(contacts);
      } else {
        contacted = await saveUserContacts(contacts);
      }
      if (!contacted || contacted.user_id != session?.user.id) {
        Alert.alert(ERROR_MESSAGES.ERROR, ERROR_MESSAGES.USER_CONTACT_SAVE_FAILED);
        setSaving(false);
        return;
      }
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  }

  useEffect(() => {
    if (session?.user) {
      getData();
    } else if (!session?.user && !isLoading) {
      Alert.alert(ERROR_MESSAGES.NO_USER_ON_SESSION);
      router.back();
    }
  }, [session]);

  if (loading || isSessionLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.baseFlex}>
        <ScrollView>
          <ThemedText variant="h3">Name</ThemedText>
          <ThemedTextInput
            value={contacts.full_name || ""}
            onChangeText={(text) => setContacts({ ...contacts, full_name: text })}
            placeholder="Vollständiger Name"
          />

          <RowView>
            <ColumnView style={[styles.column, { width: "50%" }]}>
              <ThemedText variant="h3">E-Mail-Adresse</ThemedText>
              <ThemedTextInput
                value={contacts.mail || ""}
                onChangeText={(text) => setContacts({ ...contacts, mail: text })}
                placeholder="Mail"
              />
            </ColumnView>
            <ColumnView style={[styles.column, { width: "50%" }]}>
              <ThemedText variant="h3">Telefonnummer</ThemedText>
              <ThemedTextInput
                value={contacts.phone?.toString() || ""}
                keyboardType="phone-pad"
                onChangeText={(text) => setContacts({ ...contacts, phone: Number(text) || null })}
                placeholder="Telefon"
              />
            </ColumnView>
          </RowView>

          <RowView>
            <ColumnView style={[styles.column, { width: "50%" }]}>
              <ThemedText variant="h3">Straße</ThemedText>
              <ThemedTextInput
                value={contacts.street || ""}
                onChangeText={(text) => setContacts({ ...contacts, street: text })}
                placeholder="Straße"
              />
            </ColumnView>
            <ColumnView style={[styles.column, { width: "50%" }]}>
              <ThemedText variant="h3">Hausnummer</ThemedText>
              <ThemedTextInput
                value={contacts.house_nr?.toString() || ""}
                keyboardType="numeric"
                onChangeText={(text) => setContacts({ ...contacts, house_nr: parseInt(text) || null })}
                placeholder="Hausnummer"
              />
            </ColumnView>
          </RowView>

          <RowView>
            <ColumnView style={[styles.column, { width: "50%" }]}>
              <ThemedText variant="h3">Postleitzahl</ThemedText>
              <ThemedTextInput
                value={contacts.postal_code?.toString() || ""}
                keyboardType="numeric"
                onChangeText={(text) => setContacts({ ...contacts, postal_code: parseInt(text) || null })}
                placeholder="PLZ"
              />
            </ColumnView>

            <ColumnView style={[styles.column, { width: "50%" }]}>
              <ThemedText variant="h3">Stadt</ThemedText>
              <ThemedTextInput
                value={contacts.city || ""}
                onChangeText={(text) => setContacts({ ...contacts, city: text })}
                placeholder="Stadt"
              />
            </ColumnView>
          </RowView>

          <ThemedText variant="h3">Land</ThemedText>
          <ThemedTextInput
            value={contacts.country || ""}
            onChangeText={(text) => setContacts({ ...contacts, country: text })}
            placeholder="Land"
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <ThemedButton
            textStyle={theme.typography.buttonPrimary}
            onPress={async () => {
              await handleSave();
              router.navigate({
                pathname: "AdoptionForm/UserSituation",
                params: { animalId: paramAnimal },
              });
            }}
            disabled={saving}
          >
            WEITER
          </ThemedButton>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  baseFlex: { flex: 1, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  buttonContainer: { marginVertical: 8, overflow: "hidden" },
  column: { paddingRight: 15 },
});
