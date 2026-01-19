import { AnimalCard, FilterModal, IconButton, RowView, ThemedText } from "@components";
import { fetchAnimalsForList } from "@lib/services/animalService";
import { FlashList } from "@shopify/flash-list";
import { theme } from "@theme";
import type { Animal, AnimalFilters } from "@types";
import { Stack, useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from "react-native";

export default function AnimalList() {
  const { width } = useWindowDimensions();
  const numColumns = Math.max(1, Math.floor(width / 180));
  const [listMode, setListMode] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AnimalFilters>({});
  const [modalVisibility, setModalVisibility] = useState(false);

  async function load() {
    setLoading(true);

    try {
      let data: Animal[] | null;

      data = await fetchAnimalsForList(filter);

      if (data == null) {
        data = [];
      }
      setAnimals(data);
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
          Loading... <ActivityIndicator></ActivityIndicator>
        </ThemedText>
      </View>
    );
  }
  let headertext: string;
  headertext = "Alle Tiere";

  const isListMode = listMode;
  const effectiveNumColumns = isListMode ? 1 : numColumns;
  const cardVariant = isListMode || numColumns === 1 ? "list" : "grid";

  function listHeader() {
    return (
      <RowView style={[styles.buttonArea, { paddingHorizontal: 8 }]}>
        <IconButton
          iconSet="Feather"
          iconName="search"
          size={20}
          iconColor={theme.colors.text.inverted}
          backgroundColor={theme.colors.brand.secondary}
          onPress={() => {}}
          style={styles.button}
        />
        <IconButton
          iconSet="Feather"
          iconName="sliders"
          size={20}
          iconColor={theme.colors.brand.primary}
          backgroundColor={theme.colors.background.warm}
          onPress={() => setModalVisibility(!modalVisibility)}
          style={styles.button}
        />
        {numColumns > 1 && (
          <IconButton
            iconSet="Feather"
            iconName={isListMode ? "grid" : "list"}
            size={20}
            iconColor={theme.colors.brand.primary}
            backgroundColor={theme.colors.background.warm}
            onPress={() => {
              setListMode((prev) => !prev);
            }}
            style={styles.button}
          />
        )}
      </RowView>
    );
  }

  return (
    <View style={styles.view}>
      <Stack.Screen
        options={{ headerRight: listHeader, title: headertext, headerShown: true, headerTitleAlign: "left" }}
      />
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
        masonry={!isListMode}
        numColumns={effectiveNumColumns}
        style={styles.list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AnimalCard animal={item} variant={cardVariant} />}
        ListEmptyComponent={
          <View style={styles.emptyComponent}>
            <ThemedText variant="h2">Es wurden keine Tiere gefunden.</ThemedText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  headerArea: {
    justifyContent: "space-between",
  },
  buttonArea: {
    flexDirection: "row",
  },
  button: { margin: 2 },
  list: { justifyContent: "space-evenly" },
  emptyComponent: { alignItems: "center", padding: 10 },
});
