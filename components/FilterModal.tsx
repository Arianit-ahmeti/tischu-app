import { useAnimalFieldEnums } from "@hooks/useAnimalFieldEnums";
import { ERROR_MESSAGES } from "@lib/constants/messages";
import { theme } from "@theme";
import type { AnimalFilters } from "@types";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, ModalProps, ScrollView, StyleSheet, Text, View } from "react-native";
import { IconButton } from "./IconButton";
import { RowView } from "./RowView";
import { ThemedButton } from "./ThemedButton";
import { ThemedDropdown } from "./ThemedDropdown";
import { ThemedText } from "./ThemedText";
import { ThemedTextInput } from "./ThemedTextInput";

interface FilterModalProps extends ModalProps {
  closeModal: () => void;
  applyFilter: (filter: AnimalFilters) => void;
  currentFilter: AnimalFilters;
}
export const FilterModal: React.FC<FilterModalProps> = ({ ...props }) => {
  const [dropdownFilter, setDropdownFilter] = useState<AnimalFilters>({});
  const { enums, enumsAreLoading, enumsError } = useAnimalFieldEnums();

  useEffect(() => {
    setDropdownFilter(props.currentFilter);
  }, [props.currentFilter]);

  if (enumsAreLoading) {
    return (
      <View>
        <Text>
          <ActivityIndicator size="large" />
        </Text>
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
        <ThemedText>{ERROR_MESSAGES.ENUM_LOAD_FAILED}</ThemedText>
      </View>
    );
  }

  return (
    <Modal
      transparent={true}
      visible={true}
      onRequestClose={() => {
        props.closeModal();
      }}
      style={styles.center}
    >
      <View style={styles.center}>
        <View style={styles.modal}>
          <View style={styles.headerRow}>
            <ThemedText variant="h3" color={theme.colors.text.dark} style={styles.header}>
              Suche filtern
            </ThemedText>
            <IconButton
              iconSet="Feather"
              iconName="x"
              size={24}
              backgroundColor={theme.colors.background.warm}
              iconColor={theme.colors.text.dark}
              style={styles.close}
              onPress={() => {
                props.closeModal();
              }}
            />
          </View>
          <ScrollView>
            <ThemedText variant="badge" color={theme.colors.text.light} style={styles.text}>
              Art
            </ThemedText>
            <ThemedDropdown
              dropdownData={enums.animalTypes}
              button={true}
              currentVal={dropdownFilter.type}
              valueSetter={(itemValue) => setDropdownFilter({ ...dropdownFilter, type: itemValue })}
            />

            <ThemedText variant="badge" color={theme.colors.text.light} style={styles.text}>
              Geschlecht
            </ThemedText>
            <ThemedDropdown
              dropdownData={enums.sexes}
              button={true}
              currentVal={dropdownFilter.sex}
              valueSetter={(itemValue) => setDropdownFilter({ ...dropdownFilter, sex: itemValue })}
            />

            <ThemedText variant="badge" color={theme.colors.text.light} style={styles.text}>
              Alter
            </ThemedText>
            <RowView style={styles.row}>
              <ThemedTextInput
                keyboardType="numeric"
                style={styles.ages}
                placeholder="Min"
                value={dropdownFilter.age_min?.toString()}
                onChangeText={(text) => {
                  let input = parseInt(text) || 0;
                  setDropdownFilter({ ...dropdownFilter, age_min: input });
                }}
              />
              <ThemedText variant="body" style={styles.textInline}>
                bis
              </ThemedText>
              <ThemedTextInput
                keyboardType="numeric"
                style={styles.ages}
                placeholder="Max"
                value={dropdownFilter.age_max?.toString()}
                onChangeText={(text) => {
                  let input = parseInt(text) || null;
                  if (input) setDropdownFilter({ ...dropdownFilter, age_max: input });
                }}
              />
            </RowView>

            <ThemedText variant="badge" color={theme.colors.text.light} style={styles.text}>
              Größe
            </ThemedText>
            <ThemedDropdown
              dropdownData={enums.animalSizes}
              key="sizes"
              button={true}
              currentVal={dropdownFilter.size}
              valueSetter={(itemValue) => setDropdownFilter({ ...dropdownFilter, size: itemValue })}
            />

            <ThemedText variant="badge" color={theme.colors.text.light} style={styles.text}>
              Charakter
            </ThemedText>
            <ThemedDropdown
              dropdownData={enums.characterTypes}
              key="character"
              button={true}
              currentVal={dropdownFilter.character}
              valueSetter={(itemValue) => setDropdownFilter({ ...dropdownFilter, character: itemValue })}
            />

            <ThemedText variant="badge" color={theme.colors.text.light} style={styles.text}>
              Adoptionsstatus
            </ThemedText>
            <ThemedDropdown
              dropdownData={enums.adoptionStatuses}
              key="status"
              button={true}
              currentVal={dropdownFilter.status}
              valueSetter={(itemValue) => setDropdownFilter({ ...dropdownFilter, status: itemValue })}
            />
          </ScrollView>

          <View style={styles.bottom}>
            <ThemedButton
              textStyle={{ fontWeight: "bold" }}
              onPress={() => {
                props.applyFilter(dropdownFilter);
                props.closeModal();
              }}
            >
              ANWENDEN
            </ThemedButton>
            <ThemedButton
              variant="text"
              textColor={theme.colors.brand.secondary}
              onPress={() => {
                setDropdownFilter({});
              }}
            >
              Filter löschen
            </ThemedButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
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
    maxHeight: "80%",
    maxWidth: "90%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    textAlignVertical: "center",
    verticalAlign: "top",
  },
  header: {
    textAlignVertical: "center",
    paddingVertical: 10,
  },
  text: {
    marginVertical: 10,
  },
  textInline: {
    padding: 4,
  },
  row: { alignItems: "center" },
  ages: {
    flex: 1,
    height: 48,
    maxWidth: 70,
    margin: 4,
    borderRadius: 32,
    textAlign: "center",
  },
  close: {
    alignSelf: "flex-end",
  },
  bottom: {
    padding: 10,
  },
});
