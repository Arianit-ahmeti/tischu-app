import { AlertDialog, ThemedButton, ThemedText } from "@components";
import { ImageCarousel } from "@components/ImageCarousel";
import { ThemedTextInput } from "@components/ThemedTextInput";
import { useAnimalFieldEnums } from "@hooks/useAnimalFieldEnums";
import {
  getAnimalMediaDownloadURls,
  uploadAnimalMedia,
} from "@lib/AnimalMediaService";
import { fetchAnimalDetails, updateAnimal } from "@lib/animalService";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@lib/constants/messages";
import { Animal } from "@lib/types";
import { theme } from "@theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function EditAnimal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const animalId = Array.isArray(id) ? id[0] : id;

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [originalAnimal, setOriginalAnimal] = useState<Animal | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const { enums, enumsAreLoading, enumsError } = useAnimalFieldEnums();

  async function loadAnimal() {
    try {
      setLoading(true);
      const data = await fetchAnimalDetails(id as string);
      if (data) {
        setAnimal(data);
        setOriginalAnimal(data);
      } else Alert.alert("Fehler", ERROR_MESSAGES.ANIMAL_LOAD_FAILED);
    } catch (error) {
      console.error(ERROR_MESSAGES.ANIMAL_LOAD_FAILED, error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchImages() {
    try {
      setLoading(true);
      const urls = await getAnimalMediaDownloadURls(animalId);
      setImageUrls(urls);
    } catch (error) {
      console.error(ERROR_MESSAGES.IMAGE_DOWNLOAD_FAILED, error);
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload() {
    try {
      await uploadAnimalMedia(animalId);
      await fetchImages();
    } catch (error) {
      Alert.alert("Fehler", ERROR_MESSAGES.IMAGE_UPLOAD_FAILED);
      console.error(error);
    }
  }

  const handleSave = async () => {
    if (!animal) return;

    if (animal === originalAnimal) router.back();

    setSaving(true);

    const updated = await updateAnimal(animal);

    if (updated) {
      setAlertVisible(true);
    } else {
      Alert.alert("Fehler", ERROR_MESSAGES.ANIMAL_UPDATE_FAILED);
    }
    setSaving(false);
  };

  useEffect(() => {
    if (!id) return;
    loadAnimal();
    fetchImages();
  }, [id]);

  if (loading || enumsAreLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!animal) {
    return (
      <View style={styles.center}>
        <Text>{ERROR_MESSAGES.ANIMAL_NOT_FOUND}</Text>
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
        <Text>{ERROR_MESSAGES.ENUM_LOAD_FAILED}</Text>
      </View>
    );
  }

  return (
    <>
      <AlertDialog
        visible={alertVisible}
        title="Erfolg"
        message={SUCCESS_MESSAGES.ANIMAL_UPDATED}
        buttons={[
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]}
        onDismiss={() => setAlertVisible(false)}
      />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ height: 250 }}>
          <ImageCarousel urls={imageUrls} />
        </View>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <ThemedButton onPress={handleImageUpload}>
              Bild Hinzufügen
            </ThemedButton>
          </View>

          <ThemedText variant="h3">Name:</ThemedText>
          <ThemedTextInput
            value={animal.name || ""}
            onChangeText={(text) => setAnimal({ ...animal, name: text })}
          />

          <ThemedText variant="h3">Herkunft:</ThemedText>
          <ThemedTextInput
            value={animal.origin || ""}
            onChangeText={(text) => setAnimal({ ...animal, origin: text })}
          />

          <ThemedText variant="h3">Art:</ThemedText>
          <View style={styles.sharedComponentContainer}>
            <Dropdown
              data={enums.animalTypes.values.map((val) => ({ value: val }))}
              valueField={"value"}
              labelField={"value"}
              value={animal.type}
              onChange={(itemValue) =>
                setAnimal({ ...animal, type: itemValue.value })
              }
              style={styles.picker}
            />
          </View>

          <ThemedText variant="h3">Geschlecht:</ThemedText>
          <View style={styles.sharedComponentContainer}>
            <Dropdown
              data={enums.sexes.values.map((val) => ({ value: val }))}
              valueField={"value"}
              labelField={"value"}
              value={animal.sex}
              onChange={(itemValue) =>
                setAnimal({ ...animal, sex: itemValue.value })
              }
              style={styles.picker}
            />
          </View>

          <ThemedText variant="h3">Größe:</ThemedText>
          <View style={styles.sharedComponentContainer}>
            <Dropdown
              data={enums.animalSizes.values.map((val) => ({ value: val }))}
              valueField={"value"}
              labelField={"value"}
              value={animal.size}
              onChange={(itemValue) =>
                setAnimal({ ...animal, size: itemValue.value })
              }
              style={styles.picker}
            />
          </View>

          <ThemedText variant="h3">Charakter:</ThemedText>
          <View style={styles.sharedComponentContainer}>
            <Dropdown
              data={enums.characterTypes.values.map((val) => ({ value: val }))}
              valueField={"value"}
              labelField={"value"}
              value={animal.character}
              onChange={(itemValue) =>
                setAnimal({ ...animal, character: itemValue.value })
              }
              style={styles.picker}
            />
          </View>

          <ThemedText variant="h3">Status:</ThemedText>
          <View style={styles.sharedComponentContainer}>
            <Dropdown
              data={enums.adoptionStatuses.values.map((val) => ({
                value: val,
              }))}
              valueField={"value"}
              labelField={"value"}
              value={animal.status}
              onChange={(itemValue) =>
                setAnimal({ ...animal, status: itemValue.value })
              }
              style={styles.picker}
            />
          </View>

          <ThemedText variant="h3">Alter:</ThemedText>
          <ThemedTextInput
            value={animal.age?.toString() || ""}
            keyboardType="numeric"
            onChangeText={(text) =>
              setAnimal({ ...animal, age: parseInt(text) || null })
            }
          />

          <View style={styles.buttonContainer}>
            <ThemedButton onPress={handleSave} disabled={saving}>
              Speichern
            </ThemedButton>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 24 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  sharedComponentContainer: {
    backgroundColor: theme.colors.background.warm,
    borderColor: theme.colors.border.light,
    borderWidth: 1,
    borderRadius: 8,
    height: 56,
    marginTop: 4,
    marginBottom: 16,
    fontSize: 16,
    justifyContent: "center",
  },
  inputContainer: {
    paddingHorizontal: 10,
    color: theme.colors.text.dark,
  },
  picker: {
    height: 55,
    padding: 10,
  },
  buttonContainer: { marginVertical: 10, overflow: "hidden" },
});
