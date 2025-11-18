import { getAnimalMediaDownloadURls } from "@lib/AnimalMediaService";
import { supabase } from "@lib/supabase";
import { FlashList } from "@shopify/flash-list";
import type { Animal } from "@types";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnimalList() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const numColumns = Math.max(1, Math.floor(width / 200));
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [previewImage, setPreviewImage] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  async function loadAnimals() {
    try {
      const { data, error } = await supabase.from("animals").select("*");

      console.log("Loaded Animal data successfully");

      setAnimals(data ?? []);

      const previewMap: Record<string, string> = {};

      for (const animal of data ?? []) {
        try {
          const urls = await getAnimalMediaDownloadURls(animal.id);
          if (urls.length > 0) {
            previewMap[animal.id] = urls[0];
          }
        } catch (err) {
          console.log(`Could not load preview image for animal ${animal.id}:`, err);
        }
      }

      setPreviewImage(previewMap);
    } catch (error) {
      error instanceof Error ? console.log("Error fetching Animal data: ", error.message) : "Unexpected Error ocurred";
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      loadAnimals().finally(() => setLoading(false));
    }, []),
  );

  if (loading) {
    return (
      <View>
        <Text>Daten werden geladen...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={animals}
        masonry
        numColumns={numColumns}
        style={styles.list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SafeAreaView>
            <Pressable
              onPress={() =>
                router.navigate({
                  pathname: "Animal/[id]",
                  params: { id: item.id },
                })
              }
            >
              <View style={styles.card}>
                {previewImage[item.id] && (
                  <Image
                    source={{
                      uri: previewImage[item.id],
                      cache: "force-cache",
                    }}
                    style={styles.image}
                  />
                )}
                <Text style={styles.title}>{item.name}</Text>
              </View>
            </Pressable>
          </SafeAreaView>
        )}
        ListEmptyComponent={
          <View style={styles.emptyComponent}>
            <Text>No animals yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 10, padding: 12 },
  list: { justifyContent: "space-evenly" },
  card: {
    padding: 16,
    borderRadius: 25,
    backgroundColor: "lightblue",
    flexWrap: "nowrap",
    height: 160,
    margin: 5,
  },
  image: { width: "100%", height: 100, borderRadius: 12, marginBottom: 8 },
  title: { fontSize: 18, textAlign: "center" },
  meta: { marginTop: 4 },
  emptyComponent: { alignItems: "center" },
});
