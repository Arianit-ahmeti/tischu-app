import { useEnum } from "@hooks/useEnum";
import { getAnimalMediaDownloadURls } from "@lib/AnimalMediaService";
import {
  getAdoptionStatusesEnum,
  getAnimalSizesEnum,
  getAnimalTypesEnum,
  getCharacterTypesEnum,
  getSexesEnum,
} from "@lib/supabaseEnumHandler";
import { FlashList } from "@shopify/flash-list";
import type { Animal, AnimalFilters } from "@types";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, Image, Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { fetchFilteredAnimals, loadAllAnimals } from '../lib/animalService';


export default function AnimalList() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const numColumns = Math.max(1, Math.floor(width / 200));
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [previewImage, setPreviewImage] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalvisible] = useState(false);
  const [filter, setFilter] = useState<AnimalFilters>({});
  const [filterVersion, setFilterVersion] = useState(0);

  const { enumObj: animalTypes, loading: animalTypesLoading, error: animalTypesError } = useEnum(getAnimalTypesEnum);
  const { enumObj: animalSizes, loading: animalSizesLoading, error: animalSizesError } = useEnum(getAnimalSizesEnum);
  const { enumObj: sexes, loading: sexesLoading, error: sexesError } = useEnum(getSexesEnum);
  const {
      enumObj: characterTypes,
      loading: characterTypesLoading,
      error: characterTypesError,
    } = useEnum(getCharacterTypesEnum);
    const {
      enumObj: adoptionStatuses,
      loading: adoptionStatusesLoading,
      error: adoptionStatusesError,
    } = useEnum(getAdoptionStatusesEnum);

  async function fetchImages(data: Animal[]|[]) {
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

  async function load(filtered: boolean) {
    setLoading(true);

    try {
      let data: Animal[] | null;

      if (filtered && filter) {
        data = await fetchFilteredAnimals(filter);
      }
      else {
        data = await loadAllAnimals()
      }

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
      load(true);
    }, []),
  );





  if (loading ||
      animalTypesLoading ||
      animalSizesLoading ||
      sexesLoading ||
      characterTypesLoading ||
      adoptionStatusesLoading
    ) {
    return (
      <View>
        <Text>Daten werden geladen...</Text>
      </View>
    );
    }


  if (
      animalTypesError ||
      !animalTypes ||
      animalSizesError ||
      !animalSizes ||
      sexesError ||
      !sexes ||
      characterTypesError ||
      !characterTypes ||
      adoptionStatusesError ||
      !adoptionStatuses
    )
      return (
        <View style={styles.view}>
          <Text>Fehler beim Laden</Text>
        </View>
      );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.view}>
    <View style={styles.container}>
      <Button
        title="Filter"
        onPress={() => setModalvisible(!modalVisible)}>
      </Button>
      <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => { setModalvisible(!modalVisible); load(false); }}>
          <View style={styles.centerModal}>
            <View style={styles.modal}>
              <Text style={{fontSize:18, fontWeight:"bold", alignSelf: "center"}}>Filter</Text>
                <View style={styles.pickerContainer}>
                  <Text style={{paddingLeft:2}}>Art:</Text>
                  <Dropdown
                    data={animalTypes.values.map((val) => ({ value: val }))}
                    valueField={"value"}
                    labelField={"value"}
                    value={filter?.type ?? null}
                    placeholder='Art'
                    placeholderStyle={styles.placeholder}
                    onChange={(itemValue) => setFilter({ ...filter, type: itemValue.value })}
                    style={styles.picker}
                  ></Dropdown>
                </View>
                  <View style={styles.pickerContainer}>
                  <Text style={{paddingLeft:2}}>Geschlecht:</Text>
                  <Dropdown
                    data={sexes.values.map((val) => ({ value: val }))}
                    valueField={"value"}
                    labelField={"value"}
                    value={filter?.sex ?? null}
                    placeholder='Geschlecht'
                    placeholderStyle={styles.placeholder}
                    onChange={(value) => setFilter({ ...filter, sex : value.value })}
                    style={styles.picker}
                  ></Dropdown>
                </View>
                <View style={styles.pickerContainer}>
                  <Text style={{paddingLeft:2}}>Größe:</Text>
                  <Dropdown
                    data={animalSizes.values.map((val) => ({ value: val }))}
                    valueField={"value"}
                    labelField={"value"}
                    value={filter?.size ?? null}
                    placeholder='Größe'
                    placeholderStyle={styles.placeholder}
                    onChange={(itemValue) => setFilter({ ...filter, size: itemValue.value })}
                    style={styles.picker}
                  ></Dropdown>
                </View>
                <View style={styles.pickerContainer}>
                  <Text style={{paddingLeft:2}}>Charakter:</Text>
                  <Dropdown
                    data={characterTypes.values.map((val) => ({ value: val }))}
                    valueField={"value"}
                    labelField={"value"}
                    value={filter?.character ?? null}
                    placeholder='Charakter'
                    placeholderStyle={styles.placeholder}
                    onChange={(itemValue) => setFilter({ ...filter, character: itemValue.value })}
                    style={styles.picker}
                  ></Dropdown>
                </View>
                <View style={styles.pickerContainer}>
                  <Text style={{paddingLeft:2}}>Status:</Text>
                  <Dropdown
                    data={adoptionStatuses.values.map((val) => ({ value: val }))}
                    valueField={"value"}
                    labelField={"value"}
                    value={filter?.status ?? null}
                    placeholder='Status'
                    placeholderStyle={styles.placeholder}
                    onChange={(itemValue) => setFilter({ ...filter, status: itemValue.value })}
                    style={styles.picker}
                  ></Dropdown>
                </View>
            <Button
              title="Anwenden"
                  onPress={() => {
                    setModalvisible(!modalVisible);
                    load(true);
                  }
                  }>
                </Button>
                <Button
              title="Filter Löschen"
                  onPress={() => {
                    setFilter({});
                    load(false);
                  }
                  }>
                </Button>
             <Button
              title="Schließen"
                  onPress={() => {
                    setModalvisible(!modalVisible);
                  }
                  }>
                </Button>

            </View>
          </View>
      </Modal>
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
  centerModal: {
    //justifyContent: "flex-start",
    position: "relative",
    top: 50,
    alignItems: "stretch",
    padding: 20,
  },
  modal: {
    alignItems: "stretch",
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 5,
    padding: 20,
    paddingBottom: 30,
    margin: 15,
    shadowColor: "#000",
    shadowRadius: 4,
    shadowOpacity: 0.25,
    shadowOffset: { width: 1, height: 2 },
  },
  pickerContainer: {
    justifyContent: "center",
    marginTop: 20,
  },
  picker: {
    backgroundColor: "#fff",
    borderColor: "#5f5f5fff",
    borderWidth: 1,
    borderRadius: 5,
    margin: 1,
    padding: 5,
  },
  placeholder: {
    fontStyle: "italic",
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
