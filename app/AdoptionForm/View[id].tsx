import { AlertDialog, ColumnView, IconButton, RowView, ThemedText } from "@components";
import { loadUserContacts, loadUserSituation } from "@lib/adoptionService";
import { globalStyles } from "@lib/constants/globalStyles";
import { ERROR_MESSAGES } from "@lib/constants/messages";
import { theme } from "@theme";
import { UserContact, UserSituation } from "@types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdoptionFormUserContact() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(String);
  const [alertVisible, setAlertVisible] = useState(false);
  const [contacts, setContacts] = useState<UserContact | null>();
  const [situation, setSituation] = useState<UserSituation | null>();
  let paramFormId = useLocalSearchParams().formId;
  let paramUserId = useLocalSearchParams().userId;

  async function load() {
    if (!situation) {
      try {
        if (!paramFormId) {
          throw Error(ERROR_MESSAGES.ERROR);
        }
        setLoading(true);
        paramFormId = paramFormId instanceof Array ? paramFormId[0] : paramFormId;
        let form = await loadUserSituation(paramFormId);
        setSituation(form);
        setLoading(false);
      } catch (error) {
        console.error(ERROR_MESSAGES.USER_SITUATION_LOAD_FAILED, error);
        setAlertVisible(true);
      }
    }
    if (!userId) {
      try {
        if (!paramUserId) {
          throw Error(ERROR_MESSAGES.ERROR);
        }
        paramUserId = paramUserId instanceof Array ? paramUserId[0] : paramUserId;
        setUserId(paramUserId);
      } catch (error) {
        console.error(ERROR_MESSAGES.USER_NOT_FOUND, error);
        setAlertVisible(true);
      }
    }
    if (!contacts) {
      try {
        if (!paramUserId) {
          throw Error(ERROR_MESSAGES.ERROR);
        }
        setLoading(true);
        paramUserId = paramUserId instanceof Array ? paramUserId[0] : paramUserId;
        let data = await loadUserContacts(paramUserId);
        setContacts(data);
        setLoading(false);
      } catch (error) {
        console.error(ERROR_MESSAGES.USER_CONTACT_LOAD_FAILED, error);
        setAlertVisible(true);
      }
    }
  }

  useEffect(() => {
    load();
  }, [paramFormId]);

  if (loading) {
    return (
      <View style={globalStyles.center}>
        <ActivityIndicator />
      </View>
    );
  }
  if (!contacts || !situation || contacts == null || situation == null) {
    setAlertVisible(true);
  }

  const userProfile = () => {
    return (
      <IconButton
        iconSet="Feather"
        iconName="user"
        onPress={() =>
          router.navigate({
            pathname: "ProfileScreen",
            params: { id: userId },
          })
        }
      />
    );
  };

  if (alertVisible) {
    return (
      <View>
        <AlertDialog
          visible={true}
          title={ERROR_MESSAGES.ERROR}
          message={ERROR_MESSAGES.USER_SITUATION_LOAD_FAILED}
          onDismiss={() => router.back()}
        ></AlertDialog>
      </View>
    );
  }

  return (
    <>
      <SafeAreaView>
        <Stack.Screen options={{ headerRight: () => userProfile(), title: "Kontaktformular" }} />

        <ScrollView>
          <View style={styles.center}>
            <ThemedText variant="h1">{contacts?.full_name || "Nicht angegeben"}</ThemedText>

            <View style={styles.contact}>
              <ThemedText style={styles.block} variant="h3">
                Kontaktinformationen
              </ThemedText>
              <RowView>
                <ColumnView style={[styles.column, styles.block]}>
                  <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                    E-Mail-Adresse
                  </ThemedText>
                  <ThemedText variant="bodyLarge">{contacts?.mail || "Nicht angegeben"}</ThemedText>
                </ColumnView>
                <ColumnView style={styles.block}>
                  <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                    Telefonnummer
                  </ThemedText>
                  <ThemedText variant="bodyLarge">{contacts?.phone?.toString() || "Nicht angegeben"}</ThemedText>
                </ColumnView>
              </RowView>
              <ThemedText style={styles.block} variant="h3">
                Adresse
              </ThemedText>
              <RowView>
                <ColumnView style={styles.column}>
                  <View style={styles.block}>
                    <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                      Straße
                    </ThemedText>
                    <ThemedText variant="bodyLarge">{contacts?.street || "Nicht angegeben"}</ThemedText>
                  </View>
                  <View style={styles.block}>
                    <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                      Postleitzahl
                    </ThemedText>
                    <ThemedText>{contacts?.postal_code?.toString() || "Nicht angegeben"}</ThemedText>
                  </View>
                </ColumnView>
                <ColumnView>
                  <View style={styles.block}>
                    <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                      Hausnr.
                    </ThemedText>
                    <ThemedText variant="bodyLarge">{contacts?.house_nr?.toString() || "Nicht angegeben"}</ThemedText>
                  </View>
                  <View style={styles.block}>
                    <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                      Stadt
                    </ThemedText>
                    <ThemedText variant="bodyLarge">{contacts?.city || "Nicht angegeben"}</ThemedText>
                  </View>
                </ColumnView>
              </RowView>
              <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                Land
              </ThemedText>
              <ThemedText variant="bodyLarge">{contacts?.country || "Nicht angegeben"}</ThemedText>
            </View>
            <View style={styles.contact}>
              <ThemedText style={styles.block} variant="h3">
                Erfahrung
              </ThemedText>
              <View style={styles.block}>
                <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                  Besaß bereits Tiere dieser Art
                </ThemedText>
                <ThemedText variant="bodyLarge">{situation?.experience || "Nicht angegeben"}</ThemedText>
              </View>

              {situation?.experience && situation.experience != "none" && (
                <View style={styles.block}>
                  <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                    Beschreibung
                  </ThemedText>
                  {situation.experience == "one" && (
                    <View>
                      <ThemedText color={theme.colors.brand.secondary} variant="bodyLarge">
                        {situation.past_animals?.at(0) || "Nicht angegeben"}
                      </ThemedText>
                    </View>
                  )}
                  {situation.experience != "one" && (
                    <View>
                      {situation.past_animals?.map((animal, index) => {
                        return (
                          <ThemedText key={animal + index} variant="bodyLarge">
                            {animal || "Nicht angegeben"}
                          </ThemedText>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}
              <ThemedText style={styles.block} variant="h3">
                Haushalt und Lebenssituation
              </ThemedText>
              <View style={styles.block}>
                <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                  Im Haushalt lebende Personen
                </ThemedText>
              </View>
              {situation?.household_size && situation.household_size > 1 && (
                <View style={styles.block}>
                  <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                    Kinder im Haushalt
                  </ThemedText>
                  <ThemedText variant="bodyLarge">{situation.children?.valueOf() == true ? "Ja" : "Nein"}</ThemedText>
                  {situation.children?.valueOf() == true && (
                    <View style={styles.block}>
                      <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                        Alter der Kinder
                      </ThemedText>
                      <ThemedText variant="bodyLarge">{situation.children_ages?.toString()}</ThemedText>
                    </View>
                  )}
                </View>
              )}
              <View style={styles.block}>
                <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                  Weitere Tiere im Haushalt
                </ThemedText>
                <ThemedText variant="bodyLarge">
                  {situation?.current_animals ? situation.current_animals.toString() : "Nicht angegeben"}
                </ThemedText>
              </View>
              <View style={styles.block}>
                <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                  Haus oder Wohnung
                </ThemedText>
                <ThemedText variant="bodyLarge">{situation?.living_house ? "Haus" : "Wohnung"}</ThemedText>
              </View>
              {situation?.living_house?.valueOf() == false && (
                <View style={styles.block}>
                  <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                    Etage der Wohnung
                  </ThemedText>
                  <ThemedText variant="bodyLarge">
                    {situation.living_level?.toString() + ". Etage" || "Nicht angegeben"}
                  </ThemedText>

                  {situation.living_level && situation.living_level.valueOf() != 0 && (
                    <View style={styles.block}>
                      <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                        Aufzug
                      </ThemedText>
                      <ThemedText variant="bodyLarge">
                        {situation.elevator ? "Vorhanden" : "Nicht vorhanden"}
                      </ThemedText>
                    </View>
                  )}
                </View>
              )}
              <View style={styles.block}>
                <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                  Garten
                </ThemedText>
                <ThemedText variant="bodyLarge">
                  {situation?.garden_size}
                  {situation?.garden_size != "none" &&
                    (situation?.garden_fenced ? ", " + situation.garden_fenced : ", Umzäunung unbekannt")}
                </ThemedText>
              </View>
              <View style={styles.block}>
                <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                  Wohnsituation
                </ThemedText>
                <ThemedText variant="bodyLarge">{situation?.living_rented ? "Zur Miete" : "Eigentum"}</ThemedText>
              </View>
              {situation?.living_rented?.valueOf() == true && (
                <View style={styles.block}>
                  <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                    Erlaubnis des Vermieters zum Halten von Haustieren
                  </ThemedText>
                  <ThemedText variant="bodyLarge">{situation?.landlord_approval || "Nicht angegeben"}</ThemedText>
                </View>
              )}
              <View style={styles.block}>
                <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                  Umzug geplant (Im nächsten halben Jahr)
                </ThemedText>
                <ThemedText variant="bodyLarge">{situation?.moving_plans ? "Ja" : "Nein"}</ThemedText>
              </View>
              <View style={styles.block}>
                <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                  Zeit alleine (durchschnittlicher Tag)
                </ThemedText>
                <ThemedText variant="bodyLarge">
                  {situation?.time_alone ? situation.time_alone.toString() : "Nicht angegeben"}
                </ThemedText>
              </View>
              <View style={styles.block}>
                <ThemedText color={theme.colors.brand.secondary} variant="BigBadge">
                  Finanzielle Mittel überprüft und vorhanden
                </ThemedText>
                <ThemedText variant="bodyLarge">{situation?.financial_situation ? "Ja" : "Nein"}</ThemedText>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  baseFlex: { flex: 1, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", textAlign: "justify", alignSelf: "center" },
  buttonContainer: { marginVertical: 8, overflow: "hidden" },
  column: { paddingRight: 15 },
  block: { paddingBottom: 5, alignItems: "center" },
  contact: {
    backgroundColor: theme.colors.background.warm,
    alignItems: "center",
    alignSelf: "stretch",
    padding: 5,
    borderColor: theme.colors.brand.secondary,
    borderWidth: 1,
    borderRadius: 20,
    marginVertical: 5,
  },
});
