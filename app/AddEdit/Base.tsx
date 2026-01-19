import { AlertDialog, SelectableButton, ThemedButton, ThemedText } from "@components";
import { ImageCarousel } from "@components/ImageCarousel";
import { ThemedTextInput } from "@components/ThemedTextInput";
import { useEnums } from "@hooks/useEnums";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@lib/constants/messages";
import { getAnimalMediaDownloadURLs, selectImages, uploadLocalImages } from "@lib/services/animalMediaService";
import { addAnimal, fetchAnimalDetails, updateAnimal } from "@lib/services/animalService";
import {
  getAdoptionStatusesEnum,
  getAnimalSizesEnum,
  getAnimalTypesEnum,
  getCharacterTypesEnum,
  getSexesEnum,
} from "@lib/supabaseEnumHandler";
import { Animal } from "@lib/types";
import "@lib/utils/stringExtensions";
import { theme } from "@theme";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";

export default function AddEditAnimal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  let animalId = Array.isArray(id) ? id[0] : id;
  const isEditMode = !!id;

  const [animal, setAnimal] = useState<Partial<Animal>>({
    name: "",
    origin: "",
    age: null,
    type: undefined,
    sex: undefined,
    size: undefined,
    character: undefined,
    status: "open",
  });
  const [originalAnimal, setOriginalAnimal] = useState<Animal | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [originalImageUrls, setOriginalImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const {
    enums,
    loading: enumsAreLoading,
    error: enumsError,
  } = useEnums({
    animalTypes: getAnimalTypesEnum,
    animalSizes: getAnimalSizesEnum,
    sexes: getSexesEnum,
    characterTypes: getCharacterTypesEnum,
    adoptionStatuses: getAdoptionStatusesEnum,
  });

  async function loadAnimal() {
    try {
      setLoading(true);
      const data = await fetchAnimalDetails(id as string);
      if (data) {
        setAnimal(data);
        setOriginalAnimal(data);
      } else {
        Alert.alert("Fehler", ERROR_MESSAGES.ANIMAL_LOAD_FAILED);
      }
    } catch (error) {
      console.error(ERROR_MESSAGES.ANIMAL_LOAD_FAILED, error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchImages() {
    try {
      const urls = await getAnimalMediaDownloadURLs(animalId);
      setImageUrls(urls);
      setOriginalImageUrls(urls);
    } catch (error) {
      console.error(ERROR_MESSAGES.IMAGE_DOWNLOAD_FAILED, error);
    }
  }

  async function handleImageSelection() {
    try {
      const newUris = await selectImages({ allowMultiple: true });
      if (newUris.length > 0) {
        setImageUrls([...imageUrls, ...newUris]);
      }
    } catch (error) {
      Alert.alert(ERROR_MESSAGES.ERROR, ERROR_MESSAGES.IMAGE_SELECTION_FAILED);
      console.error(error);
    }
  }

  const handleSave = async () => {
    setSaving(true);

    const animalChanged = animal !== originalAnimal;
    const imagesChanged = JSON.stringify(imageUrls) !== JSON.stringify(originalImageUrls);

    if (isEditMode) {
      if (!animalChanged && !imagesChanged) {
        router.back();
        return;
      } else if (animalChanged) {
        try {
          await updateAnimal(animal);
        } catch (error) {
          Alert.alert(ERROR_MESSAGES.ERROR, ERROR_MESSAGES.ANIMAL_UPDATE_FAILED);
          setSaving(false);
          return;
        }
      }
    } else {
      try {
        const newAnimal = await addAnimal({
          name: animal.name || "",
          age: animal.age,
          origin: animal.origin || "",
          type: animal.type,
          size: animal.size,
          sex: animal.sex,
          character: animal.character,
          status: "open",
        });

        animalId = newAnimal.id;
      } catch (error) {
        Alert.alert(ERROR_MESSAGES.ERROR, ERROR_MESSAGES.ANIMAL_UPDATE_FAILED);
        setSaving(false);
        return;
      }
    }

    const newImageUris = imageUrls.filter((uri) => !originalImageUrls.includes(uri));
    if (newImageUris.length > 0) {
      try {
        await uploadLocalImages(animalId, newImageUris);
      } catch (error) {
        console.error("Error uploading local images:", error);
        Alert.alert(ERROR_MESSAGES.WARNING, ERROR_MESSAGES.IMAGE_UPLOAD_FAILED);
      }
    }

    setAlertVisible(true);
    setSaving(false);
  };

  useEffect(() => {
    navigation.setOptions({
      title: isEditMode ? "Tier bearbeiten" : "Tier hinzufügen",
    });
  }, [isEditMode, navigation]);

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
        title={SUCCESS_MESSAGES.SUCCESS}
        message={isEditMode ? SUCCESS_MESSAGES.ANIMAL_UPDATED : SUCCESS_MESSAGES.ANIMAL_CREATED}
        buttons={[
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]}
        onDismiss={() => setAlertVisible(false)}
      />
      <ScrollView style={{ flex: 1 }}>
        {imageUrls.length > 0 && (
          <View style={{ height: 250 }}>
            <ImageCarousel urls={imageUrls} />
          </View>
        )}
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <ThemedButton textStyle={{ fontWeight: "bold" }} onPress={handleImageSelection}>
              BILD HOCHLADEN
            </ThemedButton>
          </View>

          <ThemedText variant="h3">Name:</ThemedText>
          <ThemedTextInput
            value={animal.name || ""}
            onChangeText={(text) => setAnimal({ ...animal, name: text })}
            placeholder="Name des Tiers"
          />

          <ThemedText variant="h3">Herkunft:</ThemedText>
          <ThemedTextInput
            value={animal.origin || ""}
            onChangeText={(text) => setAnimal({ ...animal, origin: text })}
            placeholder="Herkunft des Tiers"
          />

          <ThemedText variant="h3">Alter:</ThemedText>
          <ThemedTextInput
            value={animal.age?.toString() || ""}
            keyboardType="numeric"
            onChangeText={(text) => setAnimal({ ...animal, age: parseInt(text) || null })}
            placeholder="Alter des Tiers"
          />

          <ThemedText variant="h3">Art:</ThemedText>
          <View style={styles.selectionContainer}>
            {enums.animalTypes.values.map((value) => (
              <SelectableButton
                key={value}
                isSelected={animal.type === value}
                onPress={() => setAnimal({ ...animal, type: value })}
                style={styles.selectableButton}
              >
                {value.capitalizeFirst()}
              </SelectableButton>
            ))}
          </View>

          <ThemedText variant="h3">Geschlecht:</ThemedText>
          <View style={styles.selectionContainer}>
            {enums.sexes.values.map((value) => (
              <SelectableButton
                key={value}
                isSelected={animal.sex === value}
                onPress={() => setAnimal({ ...animal, sex: value })}
                style={styles.selectableButton}
              >
                {value.capitalizeFirst()}
              </SelectableButton>
            ))}
          </View>

          <ThemedText variant="h3">Größe:</ThemedText>
          <View style={styles.selectionContainer}>
            {enums.animalSizes.values.map((value) => (
              <SelectableButton
                key={value}
                isSelected={animal.size === value}
                onPress={() => setAnimal({ ...animal, size: value })}
                style={styles.selectableButton}
              >
                {value.capitalizeFirst()}
              </SelectableButton>
            ))}
          </View>

          <ThemedText variant="h3">Charakter:</ThemedText>
          <View style={styles.selectionContainer}>
            {enums.characterTypes.values.map((value) => (
              <SelectableButton
                key={value}
                isSelected={animal.character === value}
                onPress={() => setAnimal({ ...animal, character: value })}
                style={styles.selectableButton}
              >
                {value.capitalizeFirst()}
              </SelectableButton>
            ))}
          </View>

          {isEditMode && (
            <>
              <ThemedText variant="h3">Status:</ThemedText>
              <View style={styles.selectionContainer}>
                {enums.adoptionStatuses.values.map((value) => (
                  <SelectableButton
                    key={value}
                    isSelected={animal.status === value}
                    onPress={() => setAnimal({ ...animal, status: value })}
                    style={styles.selectableButton}
                  >
                    {value.capitalizeFirst()}
                  </SelectableButton>
                ))}
              </View>
            </>
          )}

          <View style={styles.buttonContainer}>
            <ThemedButton textStyle={{ fontWeight: "bold" }} onPress={handleSave} disabled={saving}>
              {isEditMode ? "SPEICHERN" : "TIER HINZUFÜGEN"}
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
  inputContainer: {
    paddingHorizontal: 10,
    color: theme.colors.text.dark,
  },
  buttonContainer: { marginVertical: 8, overflow: "hidden" },
});
