import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useEnum } from "../../hooks/useEnum";
import { fetchAnimalDetails, updateAnimal } from "../../lib/animalService";
import {
  getAdoptionStatusesEnum,
  getAnimalSizesEnum,
  getAnimalTypesEnum,
  getCharacterTypesEnum,
  getSexesEnum,
} from "../../lib/supabaseEnumHandler";
import { Animal } from "../../lib/types";

export default function EditAnimal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { enumObj: animalTypes, loading: animalTypesLoading, error: animalTypesError } = useEnum(getAnimalTypesEnum);
  const { enumObj: animalSizes, loading: animalSizesLoading, error: animalSizesError } = useEnum(getAnimalSizesEnum);
  const { enumObj: sexes, loading: sexesLoading, error: sexesError } = useEnum(getSexesEnum);
  const {
    enumObj: characterTypes,
    loading: characterTypesLoading,
    error: characterTypesError,
  } = useEnum(getCharacterTypesEnum);
  const {
    enumObj: adoptionStatuses,
    loading: adoptionStatusesLoading,
    error: adoptionStatusesError,
  } = useEnum(getAdoptionStatusesEnum);

  const Label = ({ label, value }: { label: string; value: any }) => (
    <Text style={{ marginBottom: 25 }}>
      <Text style={{ fontWeight: "bold" }}>{label}:</Text>
      {value || "Unbekannt"}
    </Text>
  );

  async function loadAnimal() {
    setLoading(true);
    const data = await fetchAnimalDetails(id as string);
    if (data) setAnimal(data);
    else Alert.alert("Fehler", "Tier konnte nicht geladen werden.");
    setLoading(false);
  }

  useEffect(() => {
    if (!id) return;
    loadAnimal();
  }, [id]);

  if (
    loading ||
    animalTypesLoading ||
    animalSizesLoading ||
    sexesLoading ||
    characterTypesLoading ||
    adoptionStatusesLoading
  )
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  if (!animal)
    return (
      <View style={styles.center}>
        <Text>Tier nicht gefunden.</Text>
      </View>
    );

  if (
    animalTypesError ||
    !animalTypes ||
    animalSizesError ||
    !animalSizes ||
    sexesError ||
    !sexes ||
    characterTypesError ||
    !characterTypes ||
    adoptionStatusesError ||
    !adoptionStatuses
  )
    return (
      <View style={styles.center}>
        <Text>Fehler beim Laden</Text>
      </View>
    );

  const handleSave = async () => {
    if (!animal) return;

    setSaving(true);

    const updated = await updateAnimal(animal);
    if (updated) {
      Alert.alert("Erfolg", "Tier wurde aktualisiert!");
      router.back();
    } else {
      Alert.alert("Fehler, Aktualisierung fehlgeschlagen!");
    }
    setSaving(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={{ fontWeight: "bold", marginTop: 10 }}>Name:</Text>
        <TextInput
          style={styles.input}
          value={animal.name || ""}
          onChangeText={(text) => setAnimal({ ...animal, name: text })}
        />

        <Text style={{ fontWeight: "bold", marginTop: 10 }}>Herkunft:</Text>
        <TextInput
          style={styles.input}
          value={animal.origin || ""}
          onChangeText={(text) => setAnimal({ ...animal, origin: text })}
        />

        <Text style={{ fontWeight: "bold" }}>Art:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={animal.type || ""}
            onValueChange={(itemValue) => setAnimal({ ...animal, type: itemValue })}
            style={styles.picker}
          >
            {animalTypes.values.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>

        <Text style={{ fontWeight: "bold" }}>Geschlecht:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={animal.size ?? "Unbekannt"}
            onValueChange={(itemValue) => setAnimal({ ...animal, sex: itemValue })}
            style={styles.picker}
          >
            {sexes.values.map((sex) => (
              <Picker.Item key={sex} label={sex} value={sex} />
            ))}
          </Picker>
        </View>

        <Text style={{ fontWeight: "bold" }}>Größe:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={animal.size ?? "Unbekannt"}
            onValueChange={(itemValue) => setAnimal({ ...animal, size: itemValue })}
            style={styles.picker}
          >
            {animalSizes.values.map((size) => (
              <Picker.Item key={size} label={size} value={size} />
            ))}
          </Picker>
        </View>

        <Text style={{ fontWeight: "bold", marginTop: 10 }}>Charakter:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={animal.character ?? "Unbekannt"}
            onValueChange={(itemValue) => setAnimal({ ...animal, character: itemValue })}
            style={styles.picker}
          >
            {characterTypes.values.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>

        <Text style={{ fontWeight: "bold", marginTop: 10 }}>Status:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={animal.status ?? "Unbekannt"}
            onValueChange={(itemValue) => setAnimal({ ...animal, status: itemValue })}
            style={styles.picker}
          >
            {adoptionStatuses.values.map((status) => (
              <Picker.Item key={status} label={status} value={status} />
            ))}
          </Picker>
        </View>

        <Text style={{ fontWeight: "bold", marginTop: 10 }}>Alter:</Text>
        <TextInput
          style={styles.input}
          value={animal.age?.toString() || ""}
          keyboardType="numeric"
          onChangeText={(text) => setAnimal({ ...animal, age: parseInt(text) || null })}
        />

        <View style={styles.buttonContainer}>
          <Button title="Speichern" onPress={handleSave} disabled={saving} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  name: { fontSize: 28, fontWeight: "bold", marginBottom: 30 },
  input: {
    backgroundColor: "#fff",
    borderColor: "#5f5f5fff",
    borderWidth: 1,
    borderRadius: 5,
    height: 45,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#000",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderColor: "#5f5f5fff",
    borderWidth: 1,
    borderRadius: 5,
    height: 45,
    justifyContent: "center",
    marginVertical: 5,
  },
  picker: {
    height: 55,
  },
  buttonContainer: { marginTop: 30, overflow: "hidden", width: "30%" },
});
