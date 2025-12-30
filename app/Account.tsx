import { ThemedButton, ThemedText } from "@components";
import { useSupabaseSession } from "@hooks/useSupabaseSession";
import { supabase } from "@lib/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TextInput, View } from "react-native";

export default function Account() {
  const { session, isLoading: isSessionLoading } = useSupabaseSession();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (session) {
      getProfile();
    }
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username }: { username: string }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (isSessionLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session?.user) {
    return (
      <View style={styles.center}>
        <ThemedText>Please authenticate to view your account.</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <ThemedText>Email</ThemedText>
        <TextInput value={session?.user?.email} />
      </View>
      <View style={styles.verticallySpaced}>
        <ThemedText>Username</ThemedText>
        <TextInput value={username || ""} onChangeText={(text) => setUsername(text)} />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <ThemedButton onPress={() => updateProfile({ username })} disabled={loading}>
          {loading ? "Loading ..." : "Update"}
        </ThemedButton>
      </View>
      <View style={styles.verticallySpaced}>
        <ThemedButton onPress={handleSignOut}>Sign Out</ThemedButton>
      </View>
      <View style={styles.verticallySpaced}>
        <ThemedButton onPress={() => router.navigate("/AddEdit/Add")}>Add Animal</ThemedButton>
      </View>

      <View style={styles.verticallySpaced}>
        <ThemedButton onPress={() => router.navigate("/AnimalList")}>Show AnimalList</ThemedButton>
      </View>
      <View style={styles.verticallySpaced}>
        <ThemedButton onPress={() => router.navigate("/ProfileScreen")}>Meine Daten anzeigen</ThemedButton>
      </View>
      <View style={styles.verticallySpaced}>
        <ThemedButton onPress={() => router.navigate("/Organization/Profile")}>Profile</ThemedButton>
      </View>
      <View style={styles.verticallySpaced}>
        <ThemedButton onPress={() => router.navigate("/Organization/Verification")}>Jetzt verifizieren</ThemedButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
