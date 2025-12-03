import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";

// Farb- und Schriftkonstanten basierend auf CI
const COLORS = {
  textDark: "#242424",
  bgBase: "#FFF",
  primary: "#2B1A47", // primary-violet
  secondary: "#B96D7A", // secondary-violet für Icons
  focusPeach: "#FF5E6C", // focus-peach
  lightPink: "#FFF5F6", // Heller rosa Hintergrund für Info-Boxen
  lightGrey: "#E5E0DE",
};

const FONT_STYLES = {
  header: {
    fontSize: 26,
    fontWeight: "bold" as const,
    color: COLORS.textDark,
  },
  bodyText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
};

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Header mit Zurück-Button */}
      <View style={styles.header}>
        <Pressable style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Meine Daten</Text>
        <Pressable style={styles.editButton}>
          <Text style={styles.editButtonText}>BEARBEITEN</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profilbild und Name */}
        <View style={styles.profileSection}>
          <View style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Johanna Richter</Text>
            <Text style={styles.profileLocation}>Wiesbaden</Text>
          </View>
        </View>

        {/* Info-Boxen */}
        <View style={styles.infoContainer}>
          {/* Gruppe 1: Kontaktdaten */}
          <View style={styles.infoBox}>
            {/* Name */}
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={COLORS.secondary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>NAME</Text>
                <Text style={styles.infoValue}>Johanna Richter</Text>
              </View>
            </View>

            {/* E-Mail */}
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={COLORS.secondary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>E-MAIL</Text>
                <Text style={styles.infoValue}>hello@johanna.de</Text>
              </View>
            </View>

            {/* Telefon */}
            <View style={[styles.infoRow, styles.lastInfoRow]}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={COLORS.secondary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>TELEFON</Text>
                <Text style={styles.infoValue}>408-841-0926</Text>
              </View>
            </View>
          </View>

          {/* Gruppe 2: Weitere Infos */}
          <View style={styles.infoBox}>
            {/* Tiere im Haushalt */}
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="paw-outline"
                  size={18}
                  color={COLORS.secondary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>TIERE IM HAUSHALT</Text>
                <Text style={styles.infoValue}>Keine</Text>
              </View>
            </View>

            {/* Vorerfahrung */}
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={COLORS.secondary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>VORERFAHRUNG</Text>
                <Text style={styles.infoValue}>Erfahren</Text>
              </View>
            </View>

            {/* Aktiv */}
            <View style={[styles.infoRow, styles.lastInfoRow]}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color={COLORS.secondary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>AKTIV</Text>
                <Text style={styles.infoValue}>Ja</Text>
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
    backgroundColor: COLORS.bgBase,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.bgBase,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    ...FONT_STYLES.header,
    fontSize: 20,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
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
     backgroundColor: COLORS.secondary,
    marginRight: 24,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...FONT_STYLES.header,
    fontSize: 24,
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 16,
    color: COLORS.secondary,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  infoBox: {
    backgroundColor: COLORS.lightPink,
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
    backgroundColor: COLORS.bgBase,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  infoValue: {
    ...FONT_STYLES.bodyText,
    fontSize: 15,
  },
});