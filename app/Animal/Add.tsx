import { AlertDialog, ThemedButton, ThemedText } from "@components";
import { SelectableButton } from "@components/SelectableButton";
import { useAnimalFieldEnums } from "@hooks/useAnimalFieldEnums";
import { addAnimal } from "@lib/animalService";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@lib/constants/messages";
import { useRouter } from "expo-router";
import "lib/utils/stringExtensions";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, View } from "react-native";

export default function Add() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");
  const [age, setAge] = useState<number>();
  const [type, setType] = useState<string>();
  const [sex, setSex] = useState<string>();
  const [size, setSize] = useState<string>();
  const [character, setCharacter] = useState<string>();
  const [alertVisible, setAlertVisible] = useState(false);

  const { enums, enumsAreLoading, enumsError } = useAnimalFieldEnums();

  async function handleAddAnimal() {
    addAnimal({
      name,
      age,
      origin,
      type: type,
      size: size,
      sex: sex,
      character: character,
      status: "open",
    });
    setAlertVisible(true);
  }

  if (enumsAreLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (
    enumsError ||
    !enums.animalTypes ||
    !enums.animalSizes ||
    !enums.sexes ||
    !enums.characterTypes ||
    !enums.adoptionStatuses
  ) {
    return (
      <View style={styles.center}>
        <ThemedText>{ERROR_MESSAGES.ENUM_LOAD_FAILED}</ThemedText>
      </View>
    );
  }

  return (
    <>
      <AlertDialog
        visible={alertVisible}
        title="Erfolg"
        message={SUCCESS_MESSAGES.ANIMAL_CREATED}
        buttons={[
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]}
        onDismiss={() => setAlertVisible(false)}
      />

      <ScrollView style={styles.container}>
        <ThemedText variant="h3">Name</ThemedText>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setName(text)}
          value={name}
          placeholder="Name des Tiers"
        />

        <ThemedText variant="h3">Herkunft</ThemedText>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setOrigin(text)}
          value={origin}
          placeholder="Herkunft des Tiers"
        />

        <ThemedText variant="h3">Alter</ThemedText>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          onChangeText={(text) => setAge(parseInt(text) || 0)}
          value={age?.toString()}
          placeholder="Alter des Tiers"
        />

        <ThemedText variant="h3">Tierart</ThemedText>
        <ScrollView horizontal={true} contentContainerStyle={styles.buttonGroup} showsHorizontalScrollIndicator={false}>
          {enums.animalTypes.values.map((value) => (
            <SelectableButton isSelected={type == value} onPress={() => setType(value)}>
              {value.capitalizeFirst()}
            </SelectableButton>
          ))}
        </ScrollView>

        <ThemedText variant="h3">Geschlecht</ThemedText>
        <ScrollView horizontal={true} contentContainerStyle={styles.buttonGroup} showsHorizontalScrollIndicator={false}>
          {enums.sexes.values.map((value) => (
            <SelectableButton isSelected={sex == value} onPress={() => setSex(value)}>
              {value.capitalizeFirst()}
            </SelectableButton>
          ))}
        </ScrollView>

        <ThemedText variant="h3">Größe</ThemedText>
        <ScrollView horizontal={true} contentContainerStyle={styles.buttonGroup} showsHorizontalScrollIndicator={false}>
          {enums.animalSizes.values.map((value) => (
            <SelectableButton isSelected={size == value} onPress={() => setSize(value)}>
              {value.capitalizeFirst()}
            </SelectableButton>
          ))}
        </ScrollView>

        <ThemedText variant="h3">Charakter</ThemedText>
        <ScrollView horizontal={true} contentContainerStyle={styles.buttonGroup} showsHorizontalScrollIndicator={false}>
          {enums.characterTypes.values.map((value) => (
            <SelectableButton isSelected={character == value} onPress={() => setCharacter(value)}>
              {value.capitalizeFirst()}
            </SelectableButton>
          ))}
        </ScrollView>

        <ThemedButton onPress={async () => handleAddAnimal()}>Tier hinzufügen</ThemedButton>
        <View style={{ height: 20 }}></View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttonGroup: {
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  input: {
    marginVertical: 8,
    backgroundColor: "#fff",
    borderColor: "#5f5f5fff",
    borderWidth: 1,
    borderRadius: 5,
    height: 45,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#000",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
