import { ThemedButton, ThemedText } from "@components";
import { Ionicons } from "@expo/vector-icons";
import { useSupabaseSession } from "@hooks/useSupabaseSession";
import { supabase } from "@lib/supabase";
import { theme } from "@theme";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";

interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
}

interface InfoFieldProps {
  icon: string;
  label: string;
  value: string;
  isLast?: boolean;
}

function InfoField({ icon, label, value, isLast }: InfoFieldProps) {
  return (
    <View style={[styles.infoRow, isLast && styles.infoRowLast]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon as any} size={18} color={theme.colors.brand.secondary} />
      </View>
      <View style={styles.infoContent}>
        <ThemedText variant="badge" color={theme.colors.brand.primary} style={styles.label}>
          {label}
        </ThemedText>
        <ThemedText variant="bodyLarge" color={theme.colors.text.dark}>
          {value}
        </ThemedText>
      </View>
    </View>
  );
}

export default function Account() {
  const { session, type, isLoading: isSessionLoading } = useSupabaseSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select("id, username, full_name")
        .eq("id", session?.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error loading profile:", error);
        Alert.alert("Fehler", "Profil konnte nicht geladen werden");
      }
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      getProfile();
    }
  }, [session, getProfile]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (isSessionLoading || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session || !session.user) {
    return (
      <View style={styles.center}>
        <ThemedText style={styles.content} variant="h2">
          Kein Nutzer angemeldet
        </ThemedText>
        <ThemedButton onPress={() => router.navigate({ pathname: "Auth" })}>ANMELDEN</ThemedButton>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <ThemedText variant="body">Profil nicht gefunden</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileImage} />
        <ThemedText variant="h1" color={theme.colors.text.dark}>
          {profile.full_name || profile.username || "Unbekannt"}
        </ThemedText>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <InfoField icon="person-outline" label="NAME" value={profile.full_name || "Nicht angegeben"} />
          <InfoField icon="at-outline" label="BENUTZERNAME" value={profile.username || "Nicht angegeben"} />
          <InfoField icon="mail-outline" label="E-MAIL" value={session.user.email || "Nicht angegeben"} isLast />
        </View>

        <View style={styles.card}>
          {type === "organization" && (
            <>
              <View style={styles.button}>
                <ThemedButton onPress={() => router.navigate("/Organization/Profile")}>Mein Profil</ThemedButton>
              </View>
              <View style={styles.button}>
                <ThemedButton onPress={() => router.navigate("/View/Organization/OrgAnimalList")}>
                  Meine Tiere
                </ThemedButton>
              </View>
              <View style={styles.button}>
                <ThemedButton onPress={() => router.navigate("/Organization/Verification")}>
                  Jetzt verifizieren
                </ThemedButton>
                <View style={styles.button}>
                  <ThemedButton onPress={() => router.navigate("/AdoptionForm/List")}>Kontaktanfragen</ThemedButton>
                </View>
              </View>
            </>
          )}
          <View style={styles.button}>
            <ThemedButton variant="text" onPress={handleSignOut}>
              Abmelden
            </ThemedButton>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.base,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 24,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.brand.secondary,
  },
  content: {
    padding: 20,
    paddingTop: 0,
    gap: 16,
  },
  card: {
    backgroundColor: theme.colors.background.warm,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background.base,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  button: {
    marginVertical: 4,
  },
});
