import { ColumnView, RowView, ThemedButton, ThemedText, ThemedTextInput } from "@components";
import { useSupabaseSession } from "@hooks/useSupabaseSession";
import { checkForForm, loadUserContacts, saveUserContacts, updateUserContacts } from "@lib/adoptionService";
import { UserContact } from "@types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ERROR_MESSAGES } from "../../lib/constants/messages";
import { getCurrentUserId } from "../../lib/userService";

export default function AdoptionFormUserContact() {
  const router = useRouter();
  const { session, isLoading: isSessionLoading } = useSupabaseSession();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(String);
  const [animalId, setAnimalId] = useState(String);
  const [saving, setSaving] = useState(false);
  const [prefilledContact, setPrefilledContact] = useState(false);
  const [contacts, setContacts] = useState<UserContact>({
    user_id: null,
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
  let paramType = useLocalSearchParams().animalType;

  async function getData() {
    if (!animalId) {
      paramAnimal instanceof Array ? setAnimalId(paramAnimal[0]) : setAnimalId(paramAnimal);
    }
    if (!userId) {
      try {
        if (!session?.user) throw new Error(ERROR_MESSAGES.NO_USER_ON_SESSION);

        const data = await getCurrentUserId();
        if (data) {
          setUserId(data);
        } else {
          throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message);
          router.back();
        } else console.error(error);
      }
    }
  }

  async function check() {
    try {
      const pastForm = await checkForForm(userId, animalId);
      if (pastForm) {
        Alert.alert("You already have an existing contact request for this animal!");
        router.back();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function prefillForm() {
    try {
      const data = await loadUserContacts(userId);
      if (data) {
        setContacts(data);
        setPrefilledContact(true);
      }
    } catch (error) {
      console.error(error);
    }
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

      if (!contacted || contacted.user_id != userId) {
        Alert.alert(ERROR_MESSAGES.ERROR, ERROR_MESSAGES.ANIMAL_UPDATE_FAILED);
        setSaving(false);
        return;
      }
    } catch (error) {
      console.error(error);
    }

    setSaving(false);
  }

  useEffect(() => {
    if (session) {
      if (animalId && userId) {
        check();
        prefillForm();
        setLoading(false);
      } else {
        setLoading(true);
        getData();
      }
    }
  }, [session, animalId, userId]);

  if (loading || isSessionLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else
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
              onPress={async () => {
                setContacts({ ...contacts, user_id: userId });
                await handleSave();
                router.navigate({
                  pathname: "AdoptionForm/UserSituation",
                  params: { animalId: animalId, animalType: paramType },
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
  selectionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    marginBottom: 8,
  },
  selectableButton: {
    marginRight: 8,
    marginLeft: 0,
  },
  hours: {
    marginHorizontal: 10,
  },
  vertAlign: { alignItems: "center" },
});
