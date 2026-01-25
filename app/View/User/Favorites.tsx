import { AnimalCard, ThemedText } from "@components";
import { useSupabaseSession } from "@hooks/useSupabaseSession";
import { getAnimalMediaDownloadURLs } from "@lib/animalMediaService";
import { fetchUserFavorites } from "@lib/animalService";
import { FlashList } from "@shopify/flash-list";
import type { Animal } from "@types";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnimalList() {
  const { width } = useWindowDimensions();
  const { session } = useSupabaseSession();
  const numColumns = Math.max(1, Math.floor(width / 180));
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [previewImage, setPreviewImage] = useState<Record<string, string>>({});
  const [imageLoading, setImageLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  async function fetchImages(data: Animal[] | []) {
    const previewMap: Record<string, string> = {};

    for (const animal of data ?? []) {
      setImageLoading(true);
      try {
        const urls = await getAnimalMediaDownloadURLs(animal.id);
        if (urls.length > 0) {
          previewMap[animal.id] = urls[0];
        }
      } catch (err) {
        console.log(`Could not load preview image for animal ${animal.id}:`, err);
      }
    }
    setPreviewImage(previewMap);
    setImageLoading(false);
  }

  async function load() {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const data = await fetchUserFavorites(session.user.id);
      const finalData = data || [];

      setAnimals(finalData);
      fetchImages(finalData);
    } catch (err) {
      console.log("Error loading animals", err);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [session?.user?.id])
  );

  if (loading) {
    return (
      <View style={styles.emptyComponent}>
        <ThemedText variant="h3">
          Favoriten werden geladen... <ActivityIndicator></ActivityIndicator>
        </ThemedText>
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
        contentContainerStyle={animals.length === 0 ? { flexGrow: 1 } : {}}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AnimalCard
            animal={item}
            previewImage={previewImage[item.id]}
            onFavoriteChange={() => {
              setAnimals((prev) => prev.filter((a) => a.id !== item.id));
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {session ? (
              <View style={styles.emptyContainer}>
                <ThemedText variant="h2" style={styles.emptyText}>
                  Noch keine Favoriten
                </ThemedText>
                <ThemedText variant="body" style={{ color: "gray" }}>
                  Speichere Tiere mit dem Herz-Symbol.
                </ThemedText>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <ThemedText variant="h3" style={styles.emptyText}>
                  Funktion nur für angemeldete Nutzer verfügbar
                </ThemedText>
              </View>
            )}
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
  headerArea: {
    justifyContent: "space-between",
  },
  buttonArea: {
    flexDirection: "row-reverse",
  },
  button: { margin: 2 },
  list: { justifyContent: "space-evenly" },
  meta: { marginTop: 4 },
  emptyComponent: { alignItems: "center", padding: 10 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: "center",
    marginBottom: 8,
  },
});
