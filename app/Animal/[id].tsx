import { deleteAnimal, fetchAnimalDetails } from "@lib/animalService";
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
import ImageCarousel from "../../components/ImageCarousel";
import { getAnimalMediaDownloadURls } from "../../lib/AnimalMediaService";

export default function AnimalDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const animalId = Array.isArray(id) ? id[0] : id;

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAnimal() {
    try {
      setLoading(true);
      const data = await fetchAnimalDetails(animalId as string);

      if (data) {
        setAnimal(data);
      } else {
        Alert.alert("Fehler", "Tier konnte nicht geladen werden.");
      }
    } catch (error) {
      console.error("Error fetching animal images", error);
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
      console.error("Error fetching animal images:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!animalId) {
      setLoading(false);
      return;
    }
    loadAnimal();
    fetchImages();
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
    <View style={{ flex: 1 }}>
      <View style={{ height: 250 }}>
        <ImageCarousel urls={imageUrls} />
      </View>
      <View style={styles.container}>
        <Text style={styles.name}>{animal?.name}</Text>
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
  container: { padding: 20, flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  name: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  button: { marginVertical: 8, overflow: "hidden" },
});
