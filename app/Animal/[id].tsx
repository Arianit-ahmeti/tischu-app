import { Chip, ImageCarousel, ThemedButton, ThemedText } from "@components";
import { IconButton } from "@components/IconButton";
import { useSupabaseSession } from "@hooks/useSupabaseSession";
import { getAnimalMediaDownloadURLs } from "@lib/animalMediaService";
import { addFavorite, deleteAnimal, fetchAnimalDetails, isFavorite, removeFavorite } from "@lib/animalService";
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

  const { session, isLoading: sessionLoading } = useSupabaseSession();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [isFavoriteAnimal, setIsFavorite] = useState(false);
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

  async function loadFavoriteStatus() {
    if (session?.user.id) {
      try {
        await isFavorite(animalId, session.user.id)
          .then(setIsFavorite)
          .catch((e) => Alert.alert("Error fetching favorite details"));
      } catch (error) {
        console.error("Error fetching favorite status", error);
      }
    }
  }

  async function fetchImages() {
    try {
      const urls = await getAnimalMediaDownloadURLs(animalId);
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

  useEffect(() => {
    if (!sessionLoading && session?.user.id && animalId) {
      loadFavoriteStatus();
    }
  }, [sessionLoading, session?.user.id, animalId]);

  if (loading || sessionLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!animal || !session?.user.id) {
    return (
      <View style={styles.center}>
        <Text>Tier nicht gefunden.</Text>
      </View>
    );
  }

  const userID = session.user.id;

  return (
    <View style={styles.root}>
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
              iconName={isFavoriteAnimal ? "favorite" : "favorite-border"}
              iconSet="MaterialIcons"
              iconColor={theme.colors.brand.focus}
              onPress={() => {
                isFavoriteAnimal
                  ? removeFavorite(animalId, userID).then(() => setIsFavorite(false))
                  : addFavorite(animalId, userID).then(() => setIsFavorite(true));
              }}
            />
            <IconButton
              size={30}
              iconName="edit"
              iconSet="AntDesign"
              onPress={() => router.push(`AddEdit/Edit?id=${animal.id}`)}
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
            Geschlecht
          </ThemedText>
          <ThemedText>{animal.sex}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText variant="badge" color={theme.colors.brand.secondary}>
            Alter
          </ThemedText>
          <ThemedText>{animal.age || "Unbekannt"}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText variant="badge" color={theme.colors.brand.secondary}>
            Größe
          </ThemedText>
          <Chip text={animal.size || "Unbekannt"} />
        </View>
        <View style={styles.row}>
          <ThemedText variant="badge" color={theme.colors.brand.secondary}>
            Charakter
          </ThemedText>
          <Chip text={animal.character || "Unbekannt"} />
        </View>
        <View style={styles.description}>
          <ThemedText variant="body"> Hier kann ihr Text stehen!</ThemedText>
        </View>

            <ThemedButton onPress={() =>
        router.navigate({
          pathname: "AdoptionForm/UserContact",
          params: { animalId: animalId, animalType: animal.type },
        })}>Jetzt Bewerben</ThemedButton>
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
