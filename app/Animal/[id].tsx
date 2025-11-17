import { deleteAnimal, fetchAnimalDetails } from "@lib/animalService";
import { Animal } from "@types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from "react-native";

const router = useRouter();

export default function AnimalDetailScreen() {
  const { id } = useLocalSearchParams();
  const animalId = Array.isArray(id) ? id[0] : id;

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  async function loadAnimal() {
    setLoading(true);
    const data = await fetchAnimalDetails(animalId as string);

    if (data) {
      setAnimal(data);
    } else {
      Alert.alert("Fehler", "Tier konnte nicht geladen werden.");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!animalId) {
      setLoading(false);
      return;
    }
    loadAnimal();
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
    <View style={styles.container}>
      <Text style={styles.name}>{animal?.name}</Text>
      <Text>Herkunft: {animal.origin}</Text>
      <Text>Alter: {animal.age || "Unbekannt"}</Text>
      <Text>Charakter: {animal.character}</Text>
      <Button
        title="Tier löschen"
        onPress={() => {
          Alert.alert("Tier löschen", `Möchten Sie ${animal.name} wirklich löschen?`, [
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
          ]);
        }}
      />
      <View style={styles.button}>
        <Button title="Bearbeiten" onPress={() => router.push(`/Animal/edit?id=${animal.id}`)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  name: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  button: { marginTop: 30, overflow: "hidden", width: "30%" },
});
