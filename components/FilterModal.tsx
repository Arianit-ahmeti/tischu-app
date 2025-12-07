import { ThemedText } from '@components/ThemedText';
import { useAnimalFieldEnums } from "@hooks/useAnimalFieldEnums";
import { ERROR_MESSAGES } from "@lib/constants/messages";
import { theme } from '@theme';
import type { AnimalFilters } from "@types";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, ModalProps, ScrollView, StyleSheet, Text, View } from "react-native";
import { IconButton } from './IconButton';
import { ThemedButton } from './ThemedButton';
import { ThemedDropdown } from './ThemedDropdown';

interface FilterModalProps extends ModalProps{
  closeModal: () => void;
  applyFilter: (filter: AnimalFilters) => void;
  currentFilter: AnimalFilters;
}
export const FilterModal: React.FC<FilterModalProps> = ({
  ...props
}) => {
  const [dropdownFilter, setDropdownFilter] = useState<AnimalFilters>({});
  const { enums, enumsAreLoading, enumsError } = useAnimalFieldEnums();


  useEffect(() => {
      setDropdownFilter(props.currentFilter);
  }, [props.currentFilter]);

  if (
    enumsAreLoading
  ) {
    return (
      <View>
        <Text><ActivityIndicator size="large" /></Text>
      </View>
    );
  }

  if (
    enumsError ||
    !enums ||
    !enums.animalTypes ||
    !enums.animalSizes ||
    !enums.sexes ||
    !enums.characterTypes ||
    !enums.adoptionStatuses
  ) {
    return (
      <View>
        <Text>{ERROR_MESSAGES.ENUM_LOAD_FAILED}</Text>
      </View>
    );
  }


  return (<Modal
      transparent={true}
      visible={true}
      onRequestClose={() => {
        props.closeModal();
      }}
    >
      <View style={styles.centerModal}>
      <View style={styles.modal}>
        <View style={styles.headerRow}>
        <ThemedText variant='h3' color={theme.colors.text.dark}> Suche filtern</ThemedText>
          <IconButton
            iconSet="Feather"
            iconName="x"
            size={24}
          iconColor={theme.colors.text.dark}
          style={styles.close}
            onPress={() => {
              props.closeModal();
            }}
          />
          </View>
          <View style={styles.buttonRow}>
            <ThemedText> Art </ThemedText>
          <ThemedDropdown dropdownData={enums.animalTypes} button={true} currentVal={dropdownFilter.type}
            valueSetter={(itemValue) => setDropdownFilter({ ...dropdownFilter, type: itemValue })} />
        </View>
          <View style={styles.buttonRow}>
            <ThemedText> Geschlecht </ThemedText>
          <ThemedDropdown dropdownData={enums.sexes} button={true} currentVal={dropdownFilter.sex}
            valueSetter={(itemValue) => setDropdownFilter({ ...dropdownFilter, sex: itemValue })} />
        </View>

          <View style={styles.buttonRow}>
          <ThemedText> Größe </ThemedText>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <ThemedDropdown dropdownData={enums.animalSizes} key="sizes" button={true} currentVal={dropdownFilter.size}
            valueSetter={(itemValue) => setDropdownFilter({ ...dropdownFilter, size: itemValue })} />
          </ScrollView>
          </View>
          <View style={styles.buttonRow}>
          <ThemedText> Charakter </ThemedText>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <ThemedDropdown dropdownData={enums.characterTypes} key="character" button={true} currentVal={dropdownFilter.character}
            valueSetter={(itemValue) => setDropdownFilter({ ...dropdownFilter, character: itemValue })} />
          </ScrollView>
          </View>
          <View style={styles.buttonRow}>
          <ThemedText> Status </ThemedText>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <ThemedDropdown dropdownData={enums.adoptionStatuses} key="status" button={true} currentVal={dropdownFilter.status}
              valueSetter={(itemValue) => setDropdownFilter({ ...dropdownFilter, status: itemValue })} />
            </ScrollView>
          </View>
        <View style={styles.bottom}>
          <ThemedButton
            onPress={() => {
              props.applyFilter(dropdownFilter);
            }}
          >Anwenden</ThemedButton>
          <ThemedButton
            variant='text'
            textColor={theme.colors.brand.secondary}
            onPress={() => {
              setDropdownFilter({});
            }}
        >Filter Löschen</ThemedButton>
        </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centerModal: {
    position: "relative",
    top: 50,
    alignItems: "stretch",
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  close: {
    alignSelf: "flex-end"
  },
  modal: {
    alignItems: "stretch",
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 5,
    padding: 20,
    paddingBottom: 10,
    margin: 15,
    shadowColor: "#000",
    shadowRadius: 4,
    shadowOpacity: 0.25,
    shadowOffset: { width: 1, height: 2 },
  },
  buttonRow: {
    flexDirection: "row",
    margin: 5
  },
  bottom: {
    padding:10
  }
});
