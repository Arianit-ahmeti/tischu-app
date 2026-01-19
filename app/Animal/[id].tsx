import { AlertDialog, BackButton, Chip, ImageCarousel, ThemedButton, ThemedText } from "@components";
import { IconButton } from "@components/IconButton";
import { useSupabaseSession } from "@hooks/useSupabaseSession";
import { getAnimalMediaDownloadURLs } from "@lib/animalMediaService";
import { deleteAnimal, fetchAnimalDetails, isOrganizationAnimal } from "@lib/animalService";
import { ERROR_MESSAGES } from "@lib/constants/messages";
import { favoriteService } from "@lib/services/favoriteService";
import { theme } from "@theme";
import { Animal } from "@types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnimalDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const animalId = Array.isArray(id) ? id[0] : id;

  const { session, type, isLoading: sessionLoading } = useSupabaseSession();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOrgAnimal, setIsOrgAnimal] = useState(false);
  const [isFavoriteAnimal, setIsFavorite] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  async function loadAnimal() {
    try {
      const data = await fetchAnimalDetails(animalId as string);

      if (data) {
        setAnimal(data);
      } else {
        Alert.alert("Fehler", ERROR_MESSAGES.ANIMAL_NOT_FOUND);
      }
    } catch (error) {
      console.error("Error fetching animal details", error);
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

  async function loadFavoriteStatus() {
    if (session?.user.id) {
      try {
        const status = await favoriteService.getFavoriteStatus(animalId as string, session.user.id);
        setIsFavorite(status);
      } catch (error) {
        console.error("Error loading favorite status", error);
      }
    }
  }

  async function toggleFavorite() {
    if (session?.user.id) {
      try {
        const newStatus = await favoriteService.toggleFavorite(animalId as string, session.user.id, isFavoriteAnimal);
        setIsFavorite(newStatus);
      } catch (error) {
        console.error("Error changing favorite status", error);
      }
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

  useEffect(() => {
    const checkIsOrganizationAnimal = async () => {
      if (animal && session?.user.id && type === "organization") {
        const result = await isOrganizationAnimal(animal.id, session.user.id);
        setIsOrgAnimal(result);
      } else {
        setIsOrgAnimal(false);
      }
    };

    checkIsOrganizationAnimal();
  }, [animal, session?.user.id, type]);

  if (loading || sessionLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.brand.primary} />
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
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <ImageCarousel urls={imageUrls} height={300} />
          <View style={styles.backButtonContainer}>
            <BackButton />
          </View>
          <View style={styles.favoriteButtonContainer}>
            <IconButton
              iconName={isFavoriteAnimal ? "heart" : "heart-o"}
              iconSet="FontAwesome"
              iconColor={isFavoriteAnimal ? theme.colors.brand.focus : theme.colors.text.dark}
              style={styles.favoriteButton}
              onPress={() => {
                toggleFavorite();
              }}
            />
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <ThemedText style={styles.name} variant="h1" color={theme.colors.brand.primary}>
                {animal.name}
              </ThemedText>
              <ThemedText variant="body" color={theme.colors.brand.secondary}>
                {animal.origin}
              </ThemedText>
            </View>
            {isOrgAnimal && (
              <>
                <View style={styles.actions}>
                  <IconButton
                    size={24}
                    iconName="edit-2"
                    iconSet="Feather"
                    onPress={() => router.push(`AddEdit/Edit?id=${animal.id}`)}
                  />
                  <IconButton iconSet="Feather" iconName="trash-2" size={24} onPress={() => setAlertVisible(true)} />
                </View>
              </>
            )}
            <AlertDialog
              visible={alertVisible}
              title="Tier löschen"
              message={`Möchten Sie ${animal.name} wirklich löschen?`}
              buttons={[
                { text: "Abbrechen", variant: "text", onPress: () => setAlertVisible(false) },
                {
                  text: "Löschen",
                  variant: "filled",
                  onPress: async () => {
                    (await deleteAnimal(animalId as string), router.back());
                  },
                },
              ]}
              onDismiss={() => setAlertVisible(false)}
            />
          </View>

          <View style={styles.infoSection}>
            <View style={styles.row}>
              <ThemedText variant="body" style={styles.label} color={theme.colors.brand.secondary}>
                GESCHLECHT
              </ThemedText>
              <ThemedText style={styles.value}>{animal.sex}</ThemedText>
            </View>
            <View style={styles.row}>
              <ThemedText variant="body" style={styles.label} color={theme.colors.brand.secondary}>
                ALTER
              </ThemedText>
              <ThemedText style={styles.value}>{animal.age || "Unbekannt"}</ThemedText>
            </View>
            <View style={styles.row}>
              <ThemedText variant="body" style={styles.label} color={theme.colors.brand.secondary}>
                GRÖSSE
              </ThemedText>
              <View style={styles.chipContainer}>
                <Chip text={animal.size || "Unbekannt"} />
              </View>
            </View>
            <View style={styles.row}>
              <ThemedText variant="body" style={styles.label} color={theme.colors.brand.secondary}>
                CHARAKTER
              </ThemedText>
              <View style={styles.chipContainer}>
                <Chip text={animal.character || "Unbekannt"} />
              </View>
            </View>
          </View>

          <View style={styles.description}>
            <ThemedText variant="body" style={styles.descriptionText}>
              Hier kann ihr Text stehen!
            </ThemedText>
          </View>

          <ThemedButton textStyle={{ fontWeight: "bold" }}>JETZT BEWERBEN</ThemedButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.base,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    height: 300,
    width: "100%",
    position: "relative",
  },
  backButtonContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  favoriteButtonContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  favoriteButton: {
    backgroundColor: theme.colors.background.warm,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.background.base,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
    paddingRight: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  infoSection: {
    marginBottom: 24,
    gap: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    width: 120,
  },
  value: {
    fontSize: 16,
    color: theme.colors.text.dark,
  },
  chipContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  description: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: theme.colors.background.warm,
    borderRadius: 12,
  },
  descriptionText: {
    lineHeight: 24,
  },
  applyButton: {
    marginTop: "auto",
  },
  gap: {
    marginBottom: 8,
  },
});
