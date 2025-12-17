import { AnimalCard, FilterModal, IconButton, RowView, ThemedText } from "@components";
import { getAnimalMediaDownloadURls } from "@lib/AnimalMediaService";
import { fetchAnimalsForList } from "@lib/animalService";
import { FlashList } from "@shopify/flash-list";
import { theme } from "@theme";
import type { Animal, AnimalFilters } from "@types";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

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
        console.log(`Could not load preview image for animal ${animal.id}:`, err);
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
    }, [])
  );

  useEffect(() => {
    load();
  }, [filter]);

  if (loading) {
    return (
      <View style={styles.emptyComponent}>
        <ThemedText variant="h3">
          {" "}
          Loading... <ActivityIndicator></ActivityIndicator>
        </ThemedText>
      </View>
    );
  }
  let headertext;
  if (!filter.type) {
    headertext = "All Animals";
  } else {
    headertext = "All " + filter.type + "s";
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.view}>
        <RowView style={styles.headerArea}>
          <ThemedText variant="h3" color={theme.colors.text.dark}>
            {headertext}
          </ThemedText>
          <RowView style={styles.buttonArea}>
            <IconButton
              iconSet="Feather"
              iconName="sliders"
              size={24}
              iconColor={theme.colors.brand.primary}
              backgroundColor={theme.colors.background.warm}
              onPress={() => setModalVisibility(!modalVisibility)}
              style={styles.button}
            />
            <IconButton
              iconSet="Feather"
              iconName="search"
              size={24}
              iconColor={theme.colors.text.inverted}
              backgroundColor={theme.colors.brand.secondary}
              onPress={() => {}}
              style={styles.button}
            />
          </RowView>
        </RowView>
        {modalVisibility && (
          <FilterModal
            closeModal={() => setModalVisibility(false)}
            applyFilter={(filter: AnimalFilters) => {
              setFilter(filter);
            }}
            currentFilter={filter}
          />
        )}
        <FlashList
          data={animals}
          masonry
          numColumns={numColumns}
          style={styles.list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AnimalCard animal={item} previewImage={previewImage[item.id]} doneLoading={doneImgLoad} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyComponent}>
              <ThemedText variant="h2"> No animals yet</ThemedText>
            </View>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
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
    margin: 10,
  },
  buttonArea: {
    flexDirection: "row-reverse",
  },
  button: { margin: 2 },
  list: { justifyContent: "space-evenly" },
  meta: { marginTop: 4 },
  emptyComponent: { alignItems: "center", padding: 10 },
});
