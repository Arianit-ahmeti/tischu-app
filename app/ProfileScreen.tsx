import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@lib/supabase";
import { theme } from "@theme";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { ThemedText, BackButton } from "@components";

interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  email?: string;
  city?: string | null;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);

      // 1. Get current user from auth
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      // 2. Get profile data from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, full_name")
        .eq("id", user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      // 3. Combine with email from auth.users
      setProfile({
        ...profileData,
        email: user.email,
        city: null, // Wird später aus organization geladen
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Fehler", "Profil konnte nicht geladen werden");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    // TODO: Navigation zu Edit Screen implementieren
    console.log("Edit pressed");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedText variant="body" style={styles.loadingText}>
          Lade Profil...
        </ThemedText>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <ThemedText variant="body" style={styles.loadingText}>
          Profil nicht gefunden
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <ThemedText variant="h2" color={theme.colors.text.dark}>
          Accountdaten
        </ThemedText>
        <Pressable style={styles.editButton} onPress={handleEdit}>
          <ThemedText variant="badge" color={theme.colors.text.dark} style={styles.editButtonText}>
            BEARBEITEN
          </ThemedText>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profilbild und Name */}
        <View style={styles.profileSection}>
          <View style={styles.profileImage} />
          <View style={{ flex: 1 }}>
            <ThemedText variant="h1" color={theme.colors.text.dark}>
              {profile.full_name || profile.username || "Unbekannt"}
            </ThemedText>
            {/* Standort wird nur angezeigt, wenn vorhanden */}
            {profile.city && (
              <ThemedText variant="body" color={theme.colors.brand.secondary} style={styles.profileLocation}>
                {profile.city}
              </ThemedText>
            )}
          </View>
        </View>

        {/* Info-Boxen */}
        <View style={styles.infoContainer}>
          {/* Gruppe 1: Kontaktdaten */}
          <View style={styles.infoBox}>
            {/* Name */}
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="person-outline" size={18} color={theme.colors.brand.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="badge" color={theme.colors.brand.primary} style={styles.infoLabel}>
                  NAME
                </ThemedText>
                <ThemedText variant="bodyLarge" color={theme.colors.text.dark}>
                  {profile.full_name || "Nicht angegeben"}
                </ThemedText>
              </View>
            </View>

            {/* Username */}
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="at-outline" size={18} color={theme.colors.brand.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="badge" color={theme.colors.brand.primary} style={styles.infoLabel}>
                  BENUTZERNAME
                </ThemedText>
                <ThemedText variant="bodyLarge" color={theme.colors.text.dark}>
                  {profile.username || "Nicht angegeben"}
                </ThemedText>
              </View>
            </View>

            {/* E-Mail */}
            <View style={[styles.infoRow, styles.lastInfoRow]}>
              <View style={styles.iconCircle}>
                <Ionicons name="mail-outline" size={18} color={theme.colors.brand.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="badge" color={theme.colors.brand.primary} style={styles.infoLabel}>
                  E-MAIL
                </ThemedText>
                <ThemedText variant="bodyLarge" color={theme.colors.text.dark}>
                  {profile.email || "Nicht angegeben"}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Gruppe 2: Weitere Infos - Platzhalter für zukünftige Felder */}
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="information-circle-outline" size={18} color={theme.colors.brand.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="badge" color={theme.colors.brand.primary} style={styles.infoLabel}>
                  WEITERE INFORMATIONEN
                </ThemedText>
                <ThemedText variant="body" color={theme.colors.text.muted}>
                  Werden in zukünftigen Updates hinzugefügt
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.base,
    marginTop: 40,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background.base,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.brand.secondary,
    marginRight: 24,
  },
  profileLocation: {
    marginTop: 4,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  infoBox: {
    backgroundColor: theme.colors.background.warm,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.2,
    borderBottomColor: "rgba(0,0,0,0.03)",
  },
  lastInfoRow: {
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
  infoLabel: {
    marginBottom: 4,
    letterSpacing: 0.5,
  },
});
