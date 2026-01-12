import { ThemedText } from "@components";
import { MessageCard } from '@components/MessageCard';
import { fetchAdoptionContactsForList } from '@lib/adoptionService';
import { ERROR_MESSAGES } from '@lib/constants/messages';
import { FlashList } from "@shopify/flash-list";
import type { AdoptionContact } from "@types";
import { useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdoptionContactList() {
  const [messages, setMessages] = useState<AdoptionContact[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
      setLoading(true);
    try {
        let data: AdoptionContact[] | null;
        data = await fetchAdoptionContactsForList();
        if (data == null) {
          data = [];
        }
        setMessages(data);
      } catch (err) {
        console.error(ERROR_MESSAGES.ADOPTION_CONTACT_LOAD_ALL_FAILED, err);
      }
      setLoading(false);
    }

    useFocusEffect(
      React.useCallback(() => {
        load();
      }, [])
    );

    useEffect(() => {
      load();
    }, []);

    if (loading) {
      return (
        <View style={styles.component}>
          <ThemedText variant="h3">
            Loading... <ActivityIndicator></ActivityIndicator>
          </ThemedText>
        </View>
      );
    }


    return (
      <SafeAreaView style={styles.view}>
        <FlashList
          data={messages}
          keyExtractor={(item) => (item.user_id, item.animal_id)}
          renderItem={({ item }) => (
            <MessageCard message={item} />
          )}
          ListEmptyComponent={
            <View style={styles.component}>
              <ThemedText variant="h2">Noch keine Kontaktanfragen</ThemedText>
            </View>
          }
        />
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    view: {
      flex: 1,
      justifyContent: "center",
    },
    buttonArea: {
      marginTop:40,
      flexDirection: "row-reverse",
    },
    button: { margin: 4 },
    component: { alignItems: "center", padding: 10 }
  });
