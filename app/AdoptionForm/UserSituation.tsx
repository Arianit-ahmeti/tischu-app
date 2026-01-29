import {
  AlertDialog,
  ColumnView,
  RowView,
  SelectableButton,
  ThemedArrayInput,
  ThemedButton,
  ThemedText,
  ThemedTextInput,
} from "@components";
import { useSupabaseSession } from "@hooks/useSupabaseSession";
import { useUserSituationEnums } from "@hooks/useUserSituationEnums";
import { saveAdoptionContact, saveUserSituation } from "@lib/adoptionService";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@lib/constants/messages";
import { UserSituation } from "@types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdoptionFormUserSituation() {
  const router = useRouter();
  const { session, isLoading: isSessionLoading } = useSupabaseSession();
  const { enums, enumsAreLoading, enumsError } = useUserSituationEnums();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(String);
  const [animalId, setAnimalId] = useState(String);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertFailVisible, setAlertFailVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [moreAnimals, setMoreAnimals] = useState(false);
  const [situation, setSituation] = useState<Partial<UserSituation>>({
    household_size: null,
    children: null,
    children_ages: null,
    current_animals: [""],
    moving_plans: null,
    elevator: null,
    time_alone: null,
    financial_situation: null,
    living_rented: null,
    living_house: null,
    past_animals: [""],
    garden_size: null,
    garden_fenced: null,
    landlord_approval: null,
    experience: null,
    living_level: null,
  });
  let paramAnimal = useLocalSearchParams().animalId;

  async function getData() {
    if (!animalId) {
      paramAnimal instanceof Array ? setAnimalId(paramAnimal[0]) : setAnimalId(paramAnimal);
    }
    if (!userId) {
      try {
        if (!session?.user) throw new Error(ERROR_MESSAGES.NO_USER_ON_SESSION);
        else {
          setUserId(session.user.id);
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message);
          router.back();
        } else {
          console.error(error);
        }
      }
    }
  }

  async function handleSave() {
    setSaving(true);
    let form;
    try {
      let savedData = await saveUserSituation(situation);
      if (savedData) form = await saveAdoptionContact(userId, savedData.form_id, animalId);
      else throw new Error(ERROR_MESSAGES.USER_SITUATION_SAVE_FAILED);
    } catch (error) {
      console.error(error);
    }
    if (form) setAlertVisible(true);
    else setAlertFailVisible(true);
    setSaving(false);
  }

  useEffect(() => {
    if (session) {
      if (animalId && userId) {
        setLoading(false);
      } else {
        setLoading(true);
        getData();
      }
    }
  }, [session, animalId, paramAnimal]);

  if (loading || isSessionLoading || enumsAreLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (enumsError || !enums.gardenSizes || !enums.landlordApproval || !enums.petExperience) {
    return (
      <View style={styles.center}>
        <ThemedText>{ERROR_MESSAGES.ENUM_LOAD_FAILED}</ThemedText>
      </View>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.baseFlex}>
        <AlertDialog
          visible={alertVisible}
          title={SUCCESS_MESSAGES.SUCCESS}
          message={SUCCESS_MESSAGES.USER_SITUATION_SAVED}
          buttons={[
            {
              text: "OK",
              onPress: () => {
                router.dismissAll();
                router.navigate({
                  pathname: "Animal/[id]",
                  params: { id: animalId },
                });
              },
            },
          ]}
          onDismiss={() => setAlertVisible(false)}
        />
        <AlertDialog
          visible={alertFailVisible}
          title={ERROR_MESSAGES.ERROR}
          message={ERROR_MESSAGES.ADOPTION_CONTACT_SAVE_FAILED}
          buttons={[
            {
              text: "Tieransicht",
              onPress: () => {
                router.dismissAll();
                router.navigate({
                  pathname: "Animal/[id]",
                  params: { id: animalId },
                });
              },
            },
            {
              text: "Schließen",
              onPress: () => {
                setAlertFailVisible(false);
              },
            },
          ]}
          onDismiss={() => setAlertFailVisible(false)}
        />

        <ScrollView>
          <ThemedText variant="h3">Hatten Sie schon einmal ein Tier dieser Art?</ThemedText>
          <View style={styles.selectionContainer}>
            {enums.petExperience.values.map((value) => (
              <SelectableButton
                key={value}
                isSelected={situation.experience?.valueOf() == value}
                onPress={() => setSituation({ ...situation, experience: value })}
                style={styles.selectableButton}
              >
                {value.capitalizeFirst()}
              </SelectableButton>
            ))}
          </View>
          {situation.experience && situation.experience != "none" && (
            <View>
              <ThemedText variant="h3">Bitte beschreiben Sie ihre Erfahrungen genauer</ThemedText>
              <ThemedText variant="bodyLarge">
                Geben Sie bitte pro Tier folgende Daten an: Rasse? Alter? Wie lange lebte das Tier bei Ihnen? Weitere
                Informationen?
              </ThemedText>

              {situation.experience == "one" && (
                <View>
                  <ThemedTextInput
                    value={situation.past_animals?.at(0) || ""}
                    onChangeText={(text) => setSituation({ ...situation, past_animals: [text] })}
                    placeholder="Tier"
                  />
                </View>
              )}
              {situation.experience != "one" && (
                <ThemedArrayInput
                  data={situation.past_animals as string[]}
                  labels="Tier"
                  onChange={(text) => setSituation({ ...situation, past_animals: text })}
                />
              )}
            </View>
          )}

          <ThemedText variant="h3">Wie viele Personen leben insgesamt im Haushalt?</ThemedText>
          <ThemedTextInput
            value={situation.household_size?.toString() || ""}
            keyboardType="numeric"
            onChangeText={(text) => setSituation({ ...situation, household_size: parseInt(text) || null })}
            placeholder="Anzahl Personen"
          />

          {situation.household_size && situation.household_size > 1 && (
            <View>
              <ThemedText variant="h3">Leben Kinder im Haushalt?</ThemedText>
              <View style={styles.selectionContainer}>
                <SelectableButton
                  key="ChildrenTrue"
                  isSelected={situation.children?.valueOf() == true}
                  onPress={() => setSituation({ ...situation, children: true })}
                  style={styles.selectableButton}
                >
                  Ja
                </SelectableButton>
                <SelectableButton
                  key="ChildrenFalse"
                  isSelected={situation.children?.valueOf() == false}
                  onPress={() => setSituation({ ...situation, children: false })}
                  style={styles.selectableButton}
                >
                  Nein
                </SelectableButton>
              </View>
              {situation.children?.valueOf() == true && (
                <View>
                  <ThemedText variant="h3">Wie alt sind die Kinder?</ThemedText>
                  <ThemedArrayInput
                    data={situation.children_ages || []}
                    labels="Kind"
                    keyboardType="numeric"
                    onChange={(newData) => {
                      const numericData = newData.map((val) => {
                        const parsed = Number(val);
                        return isNaN(parsed) ? 0 : parsed;
                      });

                      setSituation({
                        ...situation,
                        children_ages: numericData,
                      });
                    }}
                    singleRow={true}
                  />
                </View>
              )}
            </View>
          )}

          <ThemedText variant="h3">Leben weitere Tiere im Haushalt?</ThemedText>
          <View style={styles.selectionContainer}>
            <SelectableButton
              key="AnimalsTrue"
              isSelected={moreAnimals.valueOf() == true}
              onPress={() => setMoreAnimals(true)}
              style={styles.selectableButton}
            >
              Ja
            </SelectableButton>
            <SelectableButton
              key="AnimalsFalse"
              isSelected={moreAnimals.valueOf() == false}
              onPress={() => setMoreAnimals(false)}
              style={styles.selectableButton}
            >
              Nein
            </SelectableButton>
          </View>

          {moreAnimals.valueOf() == true && (
            <View>
              <ThemedText variant="h3">Bitte beschreiben Sie die Tiere genauer</ThemedText>
              <ThemedText variant="bodyLarge">
                Geben Sie bitte pro Tier folgende Daten an: Tierart? Rasse? Alter? Wie lange lebt das Tier schon bei
                Ihnen? Weitere Informationen?
              </ThemedText>
              <ThemedArrayInput
                data={situation.current_animals as string[]}
                labels="Tier"
                onChange={(text) => setSituation({ ...situation, current_animals: text })}
              />
            </View>
          )}

          <ThemedText variant="h3">Leben Sie in einem Haus oder einer Wohnung?</ThemedText>
          <View style={styles.selectionContainer}>
            <SelectableButton
              key="HouseTrue"
              isSelected={situation.living_house?.valueOf() == true}
              onPress={() => setSituation({ ...situation, living_house: true })}
              style={styles.selectableButton}
            >
              Haus
            </SelectableButton>
            <SelectableButton
              key="HouseFalse"
              isSelected={situation.living_house?.valueOf() == false}
              onPress={() => setSituation({ ...situation, living_house: false })}
              style={styles.selectableButton}
            >
              Wohnung
            </SelectableButton>
          </View>

          {situation.living_house?.valueOf() == false && (
            <View>
              <ThemedText variant="h3">Im wievielten Stockwerk liegt die Wohnung?</ThemedText>
              <ThemedTextInput
                keyboardType="numeric"
                onChangeText={(text) => setSituation({ ...situation, living_level: parseInt(text) || null })}
                placeholder="Stockwerk"
              />

              {situation.living_level?.valueOf() != 0 && (
                <View>
                  <ThemedText variant="h3">Gibt es einen Aufzug?</ThemedText>
                  <View style={styles.selectionContainer}>
                    <SelectableButton
                      key="ElevatorTrue"
                      isSelected={situation.elevator?.valueOf() == true}
                      onPress={() => setSituation({ ...situation, elevator: true })}
                      style={styles.selectableButton}
                    >
                      Ja
                    </SelectableButton>
                    <SelectableButton
                      key="ElevatorFalse"
                      isSelected={situation.elevator?.valueOf() == false}
                      onPress={() => setSituation({ ...situation, elevator: false })}
                      style={styles.selectableButton}
                    >
                      Nein
                    </SelectableButton>
                  </View>
                </View>
              )}
            </View>
          )}

          <ThemedText variant="h3">Haben Sie einen Garten? Wenn ja, wie groß ist der Garten?</ThemedText>
          <View style={styles.selectionContainer}>
            {enums.gardenSizes.values.map((value) => (
              <SelectableButton
                key={value}
                isSelected={situation.garden_size?.valueOf() == value}
                onPress={() => setSituation({ ...situation, garden_size: value })}
                style={styles.selectableButton}
              >
                {value.capitalizeFirst()}
              </SelectableButton>
            ))}
          </View>
          {situation.garden_size?.valueOf() != "none" && (
            <View>
              <ThemedText variant="h3">Ist der Garten umzäunt?</ThemedText>
              <View style={styles.selectionContainer}>
                <SelectableButton
                  key="FencedTrue"
                  isSelected={situation.garden_fenced?.valueOf() == true}
                  onPress={() => setSituation({ ...situation, garden_fenced: true })}
                  style={styles.selectableButton}
                >
                  Ja
                </SelectableButton>
                <SelectableButton
                  key="FencedFalse"
                  isSelected={situation.garden_fenced?.valueOf() == false}
                  onPress={() => setSituation({ ...situation, garden_fenced: false })}
                  style={styles.selectableButton}
                >
                  Nein
                </SelectableButton>
              </View>
            </View>
          )}

          <ThemedText variant="h3">Leben Sie zur Miete?</ThemedText>
          <View style={styles.selectionContainer}>
            <SelectableButton
              key="RentedTrue"
              isSelected={situation.living_rented?.valueOf() == true}
              onPress={() => setSituation({ ...situation, living_rented: true })}
              style={styles.selectableButton}
            >
              Ja
            </SelectableButton>
            <SelectableButton
              key="RentedFalse"
              isSelected={situation.living_rented?.valueOf() == false}
              onPress={() => setSituation({ ...situation, living_rented: false })}
              style={styles.selectableButton}
            >
              Nein
            </SelectableButton>
          </View>

          {situation.living_rented?.valueOf() == true && (
            <View>
              <ThemedText variant="h3">Hat Ihr Vermieter die Erlaubnis zum Halten von Haustieren erteilt?</ThemedText>
              <View style={styles.selectionContainer}>
                {enums.landlordApproval.values.map((value) => (
                  <SelectableButton
                    key={value}
                    isSelected={situation.landlord_approval?.valueOf() == value}
                    onPress={() => setSituation({ ...situation, landlord_approval: value })}
                    style={styles.selectableButton}
                  >
                    {value.capitalizeFirst()}
                  </SelectableButton>
                ))}
              </View>
            </View>
          )}

          <ThemedText variant="h3">Planen Sie, innerhalb des nächsten halben Jahres umzuziehen?</ThemedText>
          <View style={styles.selectionContainer}>
            <SelectableButton
              key="MovingTrue"
              isSelected={situation.moving_plans?.valueOf() == true}
              onPress={() => setSituation({ ...situation, moving_plans: true })}
              style={styles.selectableButton}
            >
              Ja
            </SelectableButton>
            <SelectableButton
              key="MovingFalse"
              isSelected={situation.moving_plans?.valueOf() == false}
              onPress={() => setSituation({ ...situation, moving_plans: false })}
              style={styles.selectableButton}
            >
              Nein
            </SelectableButton>
          </View>

          <ThemedText variant="h3">
            Wie viel Zeit müsste das Tier an einem durchschnittlichen Tag alleine verbringen?
          </ThemedText>
          <RowView style={styles.vertAlign}>
            <ColumnView style={styles.time}>
              <ThemedTextInput
                value={situation.time_alone?.toString() || ""}
                keyboardType="numeric"
                onChangeText={(text) => setSituation({ ...situation, time_alone: parseInt(text) || null })}
                placeholder="Zeit Alleine"
              />
            </ColumnView>
            <ThemedText style={styles.hours}>Stunden pro Tag</ThemedText>
          </RowView>

          <ThemedText variant="h3">
            Haben Sie sichergestellt, dass Sie die finanziellen Mittel für ein Tier haben?
          </ThemedText>
          <ThemedText variant="bodyLarge">
            Bedenken Sie nicht nur regelmäßige Kosten, wie Futter, sondern auch unvorhergesehene, hohe Kosten, wie
            Tierarztbesuche und Medikamente
          </ThemedText>
          <View style={styles.selectionContainer}>
            <SelectableButton
              key="FinancesTrue"
              isSelected={situation.financial_situation?.valueOf() == true}
              onPress={() => setSituation({ ...situation, financial_situation: true })}
              style={styles.selectableButton}
            >
              Ja
            </SelectableButton>
            <SelectableButton
              key="FinancesFalse"
              isSelected={situation.financial_situation?.valueOf() == false}
              onPress={() => setSituation({ ...situation, financial_situation: false })}
              style={styles.selectableButton}
            >
              Nein
            </SelectableButton>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <ThemedButton
            onPress={() => {
              handleSave();
            }}
            disabled={saving}
          >
            Senden
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
  time: { width: "25%" },
});
