import { useEnum } from "@hooks/useEnum";
import {
  getAdoptionStatusesEnum,
  getAnimalSizesEnum,
  getAnimalTypesEnum,
  getCharacterTypesEnum,
  getSexesEnum,
} from "@lib/supabaseEnumHandler";
import { theme } from "@theme";
import type { AnimalFilters } from "@types";
import { useEffect, useState } from "react";
import { Button, Modal, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { IconButton } from "./IconButton";

export default function FilterModal({
  isVisible,
  changeVisibility,
  applyFilter,
  currentFilter,
}: {
  isVisible: boolean;
  changeVisibility: () => void;
  applyFilter: (filter: AnimalFilters) => void;
  currentFilter: AnimalFilters;
}) {
  const [dropdownFilter, setDropdownFilter] = useState<AnimalFilters>({});

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

  useEffect(() => {
    if (isVisible) {
      setDropdownFilter(currentFilter);
    }
  }, [isVisible, currentFilter]);

  if (animalTypesLoading || animalSizesLoading || sexesLoading || characterTypesLoading || adoptionStatusesLoading) {
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
  ) {
    return (
      <View>
        <Text>Fehler beim Laden</Text>
      </View>
    );
  }

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        changeVisibility();
      }}
    >
      <View style={styles.centerModal}>
        <View style={styles.modal}>
          <Text style={{ fontSize: 18, fontWeight: "bold", alignSelf: "center" }}>Filter</Text>
          <View style={styles.pickerContainer}>
            <Text style={{ paddingLeft: 2 }}>Art:</Text>
            <Dropdown
              data={animalTypes.values.map((val) => ({ value: val }))}
              valueField={"value"}
              labelField={"value"}
              value={dropdownFilter?.type ?? null}
              placeholder="Art"
              placeholderStyle={styles.placeholder}
              onChange={(itemValue) => setDropdownFilter({ ...dropdownFilter, type: itemValue.value })}
              style={styles.picker}
            ></Dropdown>
          </View>
          <View style={styles.pickerContainer}>
            <Text style={{ paddingLeft: 2 }}>Geschlecht:</Text>
            <Dropdown
              data={sexes.values.map((val) => ({ value: val }))}
              valueField={"value"}
              labelField={"value"}
              value={dropdownFilter?.sex ?? currentFilter?.sex ?? null}
              placeholder="Geschlecht"
              placeholderStyle={styles.placeholder}
              onChange={(itemValue) => setDropdownFilter({ ...dropdownFilter, sex: itemValue.value })}
              style={styles.picker}
            ></Dropdown>
          </View>
          <View style={styles.pickerContainer}>
            <Text style={{ paddingLeft: 2 }}>Größe:</Text>
            <Dropdown
              data={animalSizes.values.map((val) => ({ value: val }))}
              valueField={"value"}
              labelField={"value"}
              value={dropdownFilter?.size ?? null}
              placeholder="Größe"
              placeholderStyle={styles.placeholder}
              onChange={(itemValue) => setDropdownFilter({ ...dropdownFilter, size: itemValue.value })}
              style={styles.picker}
            ></Dropdown>
          </View>
          <View style={styles.pickerContainer}>
            <Text style={{ paddingLeft: 2 }}>Charakter:</Text>
            <Dropdown
              data={characterTypes.values.map((val) => ({ value: val }))}
              valueField={"value"}
              labelField={"value"}
              value={dropdownFilter?.character ?? null}
              placeholder="Charakter"
              placeholderStyle={styles.placeholder}
              onChange={(itemValue) =>
                setDropdownFilter({
                  ...dropdownFilter,
                  character: itemValue.value,
                })
              }
              style={styles.picker}
            ></Dropdown>
          </View>
          <View style={styles.pickerContainer}>
            <Text style={{ paddingLeft: 2 }}>Status:</Text>
            <Dropdown
              data={adoptionStatuses.values.map((val) => ({ value: val }))}
              valueField={"value"}
              labelField={"value"}
              value={dropdownFilter?.status ?? null}
              placeholder="Status"
              placeholderStyle={styles.placeholder}
              onChange={(itemValue) =>
                setDropdownFilter({
                  ...dropdownFilter,
                  status: itemValue.value,
                })
              }
              style={styles.picker}
            ></Dropdown>
          </View>
          <Button
            title="Anwenden"
            onPress={() => {
              changeVisibility();
              applyFilter(dropdownFilter);
            }}
          ></Button>
          <Button
            title="Filter Löschen"
            onPress={() => {
              setDropdownFilter({});
              applyFilter({});
              changeVisibility();
            }}
          ></Button>
          <IconButton
            iconSet="Feather"
            iconName="x"
            size={24}
            iconColor={theme.colors.text.dark}
            onPress={() => {
              changeVisibility();
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
});
