import ImageCarousel from "@components/ImageCarousel";
import { getAnimalMediaDownloadURls } from "@lib/AnimalMediaService";
import { deleteAnimal, fetchAnimalDetails } from "@lib/animalService";
import { ERROR_MESSAGES } from "@lib/constants/messages";
import { Animal } from "@types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function AnimalDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const animalId = Array.isArray(id) ? id[0] : id;

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAnimal() {
    try {
      const data = await fetchAnimalDetails(animalId as string);

      if (data) {
        setAnimal(data);
      } else {
        Alert.alert("Fehler", ERROR_MESSAGES.ANIMAL_NOT_FOUND);
      }
    } catch (error) {
      console.error("Error fetching animal images", error);
    }
  }

  async function fetchImages() {
    try {
      const urls = await getAnimalMediaDownloadURls(animalId);
      setImageUrls(urls);
    } catch (error) {
      console.error("Error fetching animal images:", error);
    }
  }

  useEffect(() => {
    if (!animalId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([loadAnimal(), fetchImages()]);
      setLoading(false);
    };

    fetchData();
  }, [animalId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!animal) {
    return (
      <View style={styles.center}>
        <Text>Tier nicht gefunden.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.imageContainer}>
        <ImageCarousel urls={imageUrls} />
      </View>
      <View style={styles.container}>
        <Text style={styles.name}>{animal.name}</Text>
        <Text>Herkunft: {animal.origin}</Text>
        <Text>Alter: {animal.age || "Unbekannt"}</Text>
        <Text>Charakter: {animal.character}</Text>
        <View style={styles.button}>
          <Button
            title="Tier löschen"
            onPress={() => {
              Alert.alert(
                "Tier löschen",
                `Möchten Sie ${animal.name} wirklich löschen?`,
                [
                  {
                    text: "Abbrechen",
                    style: "cancel",
                  },
                  {
                    text: "Löschen",
                    style: "destructive",
                    onPress: async () => {
                      await deleteAnimal(animalId as string);
                      router.back();
                    },
                  },
                ]
              );
            }}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Bearbeiten"
            onPress={() => router.push(`/Animal/edit?id=${animal.id}`)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  imageContainer: { height: 250 },
  container: { padding: 20, flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  name: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  button: { marginVertical: 8, overflow: "hidden" },
});
