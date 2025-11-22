import FilterModal from "@components/FilterModal";
import { getAnimalMediaDownloadURls } from "@lib/AnimalMediaService";
import { fetchFilteredAnimals } from '@lib/animalService';
import { FlashList } from "@shopify/flash-list";
import type { Animal, AnimalFilters } from "@types";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


export default function AnimalList() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const numColumns = Math.max(1, Math.floor(width / 200));
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [previewImage, setPreviewImage] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AnimalFilters>({});
  const [modalVisibility, setModalVisibility] = useState(false);


  async function fetchImages(data: Animal[] | []) {
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

  }

  async function load() {
    setLoading(true);


    console.log(filter)
    try {
      let data: Animal[] | null;

      data = await fetchFilteredAnimals(filter);

      if (data == null) {
        return (<View>
          <Text>Daten werden geladen...</Text>
        </View>);
      }
      setAnimals(data);
      fetchImages(data);
    }
    catch (err) {
      console.log("Error loading animals", err);
    }
    finally {
      setLoading(false);
    }

  };

    useFocusEffect(
      React.useCallback(() => {
        load();
      }, []),
  );


  useEffect(() => {
    load();
  }, [filter]);


    if (loading) {
      return (
        <View>
          <Text>Daten werden geladen...</Text>
        </View>
      );
    }



    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.view}>
          <View style={styles.container}>
          <Button
              title="Filter"
              onPress={() => setModalVisibility(!modalVisibility)}>
            </Button>
            <FilterModal isVisible={modalVisibility} changeVisibility={() => setModalVisibility(!modalVisibility)} applyFilter={(filter: AnimalFilters) => { setFilter(filter);}} currentFilter={filter} />

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
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
  },
  container: {flex:1, padding: 5, marginBottom: 4 ,},
  filterButton: {
    borderRadius: 20,
    padding: 10,
    elevation:2,
  },
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
  title: { fontSize: 18, textAlign: "center"},
  meta: { marginTop: 4 },
  emptyComponent: { alignItems: "center" },
});
