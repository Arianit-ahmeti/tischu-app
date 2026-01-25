import { AnimalCard, ThemedText } from "@components";
import { useSupabaseSession } from "@hooks/useSupabaseSession";
import { fetchAnimalPreviewImages } from "@lib/animalMediaService";
import { fetchOrganizationAnimals } from "@lib/animalService";
import { globalStyles } from "@lib/constants/globalStyles";
import { ERROR_MESSAGES } from "@lib/constants/messages";
import { FlashList } from "@shopify/flash-list";
import { Animal } from "@types";
import { useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrgAnimalList() {
  const { width } = useWindowDimensions();
  const { session, isLoading: sessionLoading } = useSupabaseSession();
  const numColumns = Math.max(1, Math.floor(width / 150));

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [previewImage, setPreviewImage] = useState<Record<string, string>>({});
  const [isLoadingAnimals, setIsLoadingAnimals] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [error, setError] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (!sessionLoading && session?.user) {
        setIsLoadingAnimals(true);
        fetchOrganizationAnimals(session.user.id)
          .then((data) => {
            setAnimals(data);
            setError(false);
          })
          .catch((err) => {
            console.error("Error loading organization animals:", err);
            setAnimals([]);
            setError(true);
          })
          .finally(() => setIsLoadingAnimals(false));
      }
    }, [sessionLoading, session?.user.id])
  );

  useEffect(() => {
    if (animals.length > 0) {
      setIsLoadingImages(true);
      fetchAnimalPreviewImages(animals)
        .then(setPreviewImage)
        .catch((err) => console.error("Error loading animal preview images:", err))
        .finally(() => setIsLoadingImages(false));
    }
  }, [animals]);

  const isLoading = isLoadingAnimals || sessionLoading;

  if (isLoading) {
    return (
      <View style={globalStyles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={globalStyles.center}>
        <ThemedText variant="h3">{ERROR_MESSAGES.ANIMAL_LOAD_FAILED}</ThemedText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.view}>
      <FlashList
        data={animals}
        masonry
        numColumns={numColumns}
        style={styles.list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AnimalCard animal={item} previewImage={previewImage[item.id]} />}
        ListEmptyComponent={
          <View style={globalStyles.center}>
            <ThemedText variant="h2">No animals yet</ThemedText>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    padding: 5,
    marginBottom: 2,
  },
  list: { justifyContent: "space-evenly" },
});
