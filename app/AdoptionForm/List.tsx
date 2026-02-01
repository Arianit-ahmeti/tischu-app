import { MessageCard, ThemedText } from "@components";
import { useSupabaseSession } from "@hooks/useSupabaseSession";
import { ERROR_MESSAGES } from "@lib/constants/messages";
import { fetchAdoptionContactsForList } from "@lib/services/adoptionService";
import { FlashList } from "@shopify/flash-list";
import type { AdoptionContact } from "@types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdoptionContactList() {
  const [messages, setMessages] = useState<AdoptionContact[]>([]);
  const [loading, setLoading] = useState(true);
  const { session, isLoading: sessionLoading } = useSupabaseSession();

  async function load() {
    setLoading(true);
    try {
      let userId = session?.user?.id;
      if (!userId) throw Error(ERROR_MESSAGES.NO_USER_ON_SESSION);
      let data = await fetchAdoptionContactsForList(userId);
      setMessages(data ?? []);
    } catch (err) {
      console.error(ERROR_MESSAGES.ADOPTION_CONTACT_LOAD_ALL_FAILED, err);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!sessionLoading) {
      load();
    }
  }, [session]);

  if (loading || sessionLoading) {
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
        renderItem={({ item }) => <MessageCard message={item} />}
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
  component: { alignItems: "center", padding: 10 },
});
