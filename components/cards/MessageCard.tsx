import { IconButton } from "@components/IconButton";
import { adoptionRead, deleteAdoptionContact } from "@lib/adoptionService";
import { fetchAnimalDetails } from "@lib/animalService";
import { ERROR_MESSAGES } from "@lib/constants/messages";
import { AdoptionContact } from "@lib/types";
import { getUserName } from "@lib/userService";
import { theme } from "@theme";
import { router } from "expo-router";
import { reload } from "expo-router/build/global-state/routing";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from "react-native";
import { Chip } from "./Chip";
import { ColumnView } from "./ColumnView";
import { RowView } from "./RowView";
import { ThemedText } from "./ThemedText";

interface MessageCardProps {
  message: AdoptionContact;
}

export const MessageCard: React.FC<MessageCardProps> = (props) => {
  const [animalName, setAnimalName] = useState<string>();
  const [dataLoading, setDataLoading] = useState(false);
  const [userName, setUserName] = useState<string>();

  async function load() {
    setDataLoading(true);
    try {
      let name = await getUserName(props.message.user_id);
      if (name) setUserName(name);
    } catch (err) {
      console.log(ERROR_MESSAGES.USER_NAME_LOAD_FAILED, err);
    }
    try {
      let animal = await fetchAnimalDetails(props.message.animal_id);
      if (animal?.name) setAnimalName(animal.name);
    } catch (error) {
      console.log(ERROR_MESSAGES.ANIMAL_LOAD_FAILED, error);
    }
    setDataLoading(false);
  }

  async function setRead(userId: string, animalId: string) {
    try {
      let read = await adoptionRead(userId, animalId);
      if (!read) throw Error(ERROR_MESSAGES.ADOPTION_CONTACT_SET_READ_FAILED);
    } catch (error) {
      console.log(ERROR_MESSAGES.ADOPTION_CONTACT_SET_READ_FAILED, error);
    }
  }

  async function deleteContact(userId: string, animalId: string) {
    try {
      let deleted = await deleteAdoptionContact(userId, animalId);
      if (!deleted) throw Error(ERROR_MESSAGES.ADOPTION_CONTACT_DELETE_FAILED);
      reload();
    } catch (error) {
      console.log(ERROR_MESSAGES.ADOPTION_CONTACT_DELETE_FAILED, error);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const names = () => {
    if (dataLoading) {
      return (
        <View>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <ColumnView>
          <RowView>
            <ThemedText style={styles.marginVert} variant="h4">
              Von
            </ThemedText>
            <ThemedText variant="h4">{userName || "Unbekannt"}</ThemedText>
          </RowView>
          <RowView>
            <ThemedText style={styles.marginVert} variant="h4">
              Tier
            </ThemedText>
            <ThemedText variant="h4">{animalName}</ThemedText>
          </RowView>
        </ColumnView>
      );
    }
  };

  return (
    <Pressable
      style={styles.card}
      onPress={() => {
        setRead(props.message.user_id, props.message.animal_id);
        router.navigate({
          pathname: "AdoptionForm/View[id]",
          params: { userId: props.message.user_id, formId: props.message.form_id },
        });
      }}
    >
      <RowView style={styles.element}>
        <ColumnView style={styles.text}>{names()}</ColumnView>
        <ColumnView>{props.message.read_at?.valueOf() == null && <Chip text="Neu" />}</ColumnView>
        <ColumnView>
          <IconButton
            onPress={() => {
              Alert.alert(
                "Tier löschen",
                `Möchten Sie die Kontaktanfrage von ${userName} für ${animalName} wirklich löschen?`,
                [
                  {
                    text: "Abbrechen",
                    style: "cancel",
                  },
                  {
                    text: "Löschen",
                    style: "destructive",
                    onPress: async () => {
                      await deleteContact(props.message.user_id, props.message.animal_id);
                      router.replace("/AdoptionForm/List");
                    },
                  },
                ]
              );
            }}
            iconSet="Feather"
            iconName="trash"
          />
        </ColumnView>
      </RowView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.warm,
    borderColor: theme.colors.border.light,
    borderWidth: 1,
    flexWrap: "nowrap",
    height: 75,
    margin: 5,
    borderRadius: 10,
    paddingLeft: 10,
  },
  element: { flex: 1, alignItems: "center" },
  text: { flex: 1, alignItems: "baseline" },
  chip: { verticalAlign: "middle" },
  marginVert: { marginRight: 10, color: theme.colors.brand.secondary },
});
