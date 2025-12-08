import { Chip, ImageCarousel, ThemedButton, ThemedText } from "@components";
import { IconButton } from "@components/IconButton";
import { getAnimalMediaDownloadURls } from "@lib/AnimalMediaService";
import { deleteAnimal, fetchAnimalDetails } from "@lib/animalService";
import { ERROR_MESSAGES } from "@lib/constants/messages";
import { theme } from "@theme";
import { Animal } from "@types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

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
    <View style={{ flex: 1 }}>
      <View style={styles.imageContainer}>
        <ImageCarousel urls={imageUrls} />
      </View>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.name} variant="h1" color={theme.colors.brand.primary}>
            {animal.name}
          </ThemedText>
          <ThemedText variant="bodySmall" color={theme.colors.brand.secondary}>
            {animal.origin}
          </ThemedText>
          <View style={styles.buttons}>
            <IconButton
              size={30}
              iconName="favorite-border"
              iconSet="MaterialIcons"
              iconColor={theme.colors.brand.focus}
            />
            <IconButton
              size={30}
              iconName="edit"
              iconSet="AntDesign"
              onPress={() => router.push(`/Animal/${animal.id}/Edit`)}
            />
            <IconButton
              iconSet="Ionicons"
              iconName="trash"
              size={30}
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
          </View>
        </View>

        <View style={styles.row}>
          <ThemedText variant="badge" color={theme.colors.brand.secondary}>
            {" "}
            Geschlecht{" "}
          </ThemedText>
          <ThemedText>{animal.sex}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText variant="badge" color={theme.colors.brand.secondary}>
            {" "}
            Alter{" "}
          </ThemedText>
          <Text>{animal.age || "Unbekannt"}</Text>
        </View>
        <View style={styles.row}>
          <ThemedText variant="badge" color={theme.colors.brand.secondary}>
            {" "}
            Größe{" "}
          </ThemedText>
          <Chip text={animal.size || "Unbekannt"} />
        </View>
        <View style={styles.row}>
          <ThemedText variant="badge" color={theme.colors.brand.secondary}>
            {" "}
            Charakter{" "}
          </ThemedText>
          <Chip text={animal.character || "Unbekannt"} />
        </View>
        <View style={styles.description}>
          <ThemedText variant="body"> Hier kann ihr Text stehen!</ThemedText>
        </View>

        <ThemedButton>Jetzt Bewerben</ThemedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    verticalAlign: "middle",
    justifyContent: "flex-start",
    paddingBottom: 15,
    alignItems: "center",
  },
  root: { flex: 1 },
  imageContainer: { height: 250 },
  header: { paddingBottom: 20 },
  container: { padding: 20, flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  name: { fontSize: 28, fontWeight: "bold" },
  buttons: {
    position: "absolute",
    flexDirection: "column",
    alignSelf: "flex-end",
  },
  description: {
    margin: 2,
    padding: 5,
    marginBottom: 10,
    alignItems: "center",
  },
});
