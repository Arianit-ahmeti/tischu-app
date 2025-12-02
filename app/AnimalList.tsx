import { ThemedButton, ThemedText } from '@components';
import { AnimalCard } from '@components/AnimalCard';
import FilterModal from "@components/FilterModal";
import { getAnimalMediaDownloadURls } from "@lib/AnimalMediaService";
import { fetchAnimalsForList } from "@lib/animalService";
import { FlashList } from "@shopify/flash-list";
import type { Animal, AnimalFilters } from "@types";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { theme } from '../theme/theme';

export default function AnimalList() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const numColumns = Math.max(1, Math.floor(width / 200));
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [previewImage, setPreviewImage] = useState<Record<string, string>>({});
  const [doneImgLoad, setDoneImgLoad] = useState(true);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AnimalFilters>({});
  const [modalVisibility, setModalVisibility] = useState(false);

  async function fetchImages(data: Animal[] | []) {
    const previewMap: Record<string, string> = {};

    for (const animal of data ?? []) {
      setDoneImgLoad(false);
      try {
        const urls = await getAnimalMediaDownloadURls(animal.id);
        if (urls.length > 0) {
          previewMap[animal.id] = urls[0];
        }
      } catch (err) {
        console.log(
          `Could not load preview image for animal ${animal.id}:`,
          err,
        );
      }
    }

    setPreviewImage(previewMap);
    setDoneImgLoad(true);
  }

  async function load() {
    setLoading(true);

    console.log(filter);
    try {
      let data: Animal[] | null;

      data = await fetchAnimalsForList(filter);

      if (data == null) {
        data = [];
      }
      setAnimals(data);
      fetchImages(data);
    } catch (err) {
      console.log("Error loading animals", err);
    } finally {
      setLoading(false);
    }
  }

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
      <View style={styles.emptyComponent}>
        <ThemedText variant='h3'> Loading... <ActivityIndicator></ActivityIndicator></ThemedText>
      </View>
    );
  }
  let headertext;
  if (!filter.type) {
    headertext = "All Animals"
  } else {
    headertext = "All " + filter.type + "s"
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.view}>
        <View style={styles.container}>
          <View style={styles.buttonArea}>
            <ThemedButton borderRadius={100} backgroundColor={theme.colors.brand.secondary}> F </ThemedButton>
            <ThemedButton borderRadius={100} backgroundColor={theme.colors.background.warm} textColor={theme.colors.text.dark} onPress={() => setModalVisibility(!modalVisibility)}> S </ThemedButton>
          </View>
          <ThemedText variant='h2' style={styles.header}>{headertext}</ThemedText>


          <FilterModal
            isVisible={modalVisibility}
            changeVisibility={() => setModalVisibility(!modalVisibility)}
            applyFilter={(filter: AnimalFilters) => {
              setFilter(filter);
            }}
            currentFilter={filter}
          />
          <FlashList
            data={animals}
            masonry
            numColumns={numColumns}
            style={styles.list}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AnimalCard animal={item} previewImage={previewImage[item.id]} doneLoading={doneImgLoad}/>
            )}
            ListEmptyComponent={
              <View style={styles.emptyComponent}>
                <ThemedText variant='h2'> No animals yet</ThemedText>
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
  container: { flex: 1, padding: 5, marginBottom: 2 },
  buttonArea: {
    flexDirection: "row-reverse"
  },
  header: {
    padding: 10,
  },
  list: { justifyContent: "space-evenly" },
  meta: { marginTop: 4 },
  emptyComponent: { alignItems: "center", padding: 10},
});
