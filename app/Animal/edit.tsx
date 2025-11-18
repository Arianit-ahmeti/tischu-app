import ImageCarousel from "@components/ImageCarousel";
import { useEnum } from "@hooks/useEnum";
import { getAnimalMediaDownloadURls, uploadAnimalMedia } from "@lib/AnimalMediaService";
import { fetchAnimalDetails, updateAnimal } from "@lib/animalService";
import {
  getAdoptionStatusesEnum,
  getAnimalSizesEnum,
  getAnimalTypesEnum,
  getCharacterTypesEnum,
  getSexesEnum,
} from "@lib/supabaseEnumHandler";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function EditAnimal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const animalId = Array.isArray(id) ? id[0] : id;

  const [animal, setAnimal] = useState<any | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
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

  async function loadAnimal() {
    setLoading(true);
    const data = await fetchAnimalDetails(id as string);
    if (data) setAnimal(data);
    else Alert.alert("Fehler", "Tier konnte nicht geladen werden.");
    setLoading(false);
  }

  async function fetchImages() {
    try {
      setLoading(true);
      const urls = await getAnimalMediaDownloadURls(animalId);
      setImageUrls(urls);
    } catch (error) {
      console.error("Error fetching animal images:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload() {
    try {
      await uploadAnimalMedia(animalId);
      await fetchImages();
    } catch (error) {
      Alert.alert("Fehler beim Hochladen");
      console.error(error);
    }
  }

  useEffect(() => {
    if (!id) return;
    loadAnimal();
    fetchImages();
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
    <ScrollView style={{ flex: 1 }}>
      <View style={{ height: 250, marginBottom: 10 }}>
        <ImageCarousel urls={imageUrls} />
      </View>
      <View style={styles.container}>
        <View style={styles.button}>
          <Button title="Bild Hinzufügen" onPress={handleImageUpload} />
        </View>

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
          <Dropdown
            data={animalTypes.values.map((val) => ({ value: val }))}
            valueField={"value"}
            labelField={"value"}
            value={animal.type}
            onChange={(itemValue) => setAnimal({ ...animal, type: itemValue.value })}
            style={styles.picker}
          ></Dropdown>
        </View>

        <Text style={{ fontWeight: "bold" }}>Geschlecht:</Text>
        <View style={styles.pickerContainer}>
          <Dropdown
            data={sexes.values.map((val) => ({ value: val }))}
            valueField={"value"}
            labelField={"value"}
            value={animal.sex}
            onChange={(itemValue) => setAnimal({ ...animal, sex: itemValue.value })}
            style={styles.picker}
          ></Dropdown>
        </View>

        <Text style={{ fontWeight: "bold" }}>Größe:</Text>
        <View style={styles.pickerContainer}>
          <Dropdown
            data={animalSizes.values.map((val) => ({ value: val }))}
            valueField={"value"}
            labelField={"value"}
            value={animal.size}
            onChange={(itemValue) => setAnimal({ ...animal, size: itemValue.value })}
            style={styles.picker}
          ></Dropdown>
        </View>

        <Text style={{ fontWeight: "bold", marginTop: 10 }}>Charakter:</Text>
        <View style={styles.pickerContainer}>
          <Dropdown
            data={characterTypes.values.map((val) => ({ value: val }))}
            valueField={"value"}
            labelField={"value"}
            value={animal.character}
            onChange={(itemValue) => setAnimal({ ...animal, character: itemValue.value })}
            style={styles.picker}
          ></Dropdown>
        </View>

        <Text style={{ fontWeight: "bold", marginTop: 10 }}>Status:</Text>
        <View style={styles.pickerContainer}>
          <Dropdown
            data={adoptionStatuses.values.map((val) => ({ value: val }))}
            valueField={"value"}
            labelField={"value"}
            value={animal.status}
            onChange={(itemValue) => setAnimal({ ...animal, status: itemValue.value })}
            style={styles.picker}
          ></Dropdown>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
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
    padding: 10,
  },
  buttonContainer: { marginTop: 30, overflow: "hidden", width: "30%" },
  button: { marginVertical: 8, overflow: "hidden" },
});
