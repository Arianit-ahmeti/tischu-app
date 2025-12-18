import { IconButton, ThemedButton, ThemedText } from "@components";
import { ERROR_MESSAGES } from "@lib/constants/messages";
import { getCurrentSession, getProfile } from "@lib/userService";
import { theme } from "@theme";
import { Organization } from "@types";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

const initialProfileState: Organization = {
  id: "",
  created_at: "",
  name: null,
  street: null,
  house_number: null,
  postal_code: null,
  city: null,
  country: null,
  status: null,
};

export default function OrganizationProfile() {
  const [profile, setProfile] = useState<Organization>(initialProfileState);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  // Refresh data whenever a user returns to the profile-page
  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  async function loadProfileData() {
    setLoading(true);
    const session = await getCurrentSession();

    if (!session || !session.user) {
      Alert.alert("Fehler: ", ERROR_MESSAGES.ORG_SESSION_FAILED);
      setLoading(false);
      return;
    }
    setEmail(session.user.email || "-");
    const user_id = session.user.id;
    try {
      const profileData = await getProfile(user_id);
      if (profileData) {
        setProfile({ ...initialProfileState, ...profileData });
      } else {
        Alert.alert("Fehler:", ERROR_MESSAGES.ORG_PROFILE_LOAD_FAILED);
      }
    } catch (e) {
      Alert.alert("Fehler: ", ERROR_MESSAGES.ORG_PROFILE_LOAD_FAILED);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const streetPart = `${profile.street || ""} ${profile.house_number || ""}`;
  const cityPart = `${profile.postal_code?.toString() || ""} ${profile.city || ""}`;
  const fullAddress = `${streetPart.trim()},\n${cityPart.trim()}\n${profile.country || ""}`.trim();

  return (
    <ScrollView style={styles.scrollView}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <ThemedButton onPress={() => router.push("/Organization/Edit")} style={styles.editButton}>
              <ThemedText variant="body">BEARBEITEN</ThemedText>
            </ThemedButton>
          ),
        }}
      />
      <View style={styles.nameHeaderContainer}>
        <View style={styles.avatarPlaceholder}></View>
        <View>
          <ThemedText variant="h2" numberOfLines={2} ellipsizeMode="tail" style={styles.nameText}>
            {profile.name || "-"}
          </ThemedText>
          <ThemedText variant="body" style={styles.cityText}>
            {profile.city || "-"}
          </ThemedText>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.row}>
          <IconButton
            iconSet="Feather"
            iconName="user"
            size={22}
            iconColor={theme.colors.brand.focus}
            style={styles.iconButtonMargin}
          />
          <View style={styles.content}>
            <ThemedText variant="body" style={styles.textLight}>
              VEREINSNAME
            </ThemedText>
            <ThemedText variant="body" style={styles.textLight}>
              {profile.name || "-"}
            </ThemedText>
          </View>
        </View>

        <View style={styles.row}>
          <IconButton
            iconSet="Feather"
            iconName="mail"
            size={22}
            iconColor={theme.colors.brand.focus}
            style={styles.iconButtonMargin}
          />
          <View style={styles.content}>
            <ThemedText variant="body" style={styles.textLight}>
              E-MAIL
            </ThemedText>
            <ThemedText variant="body" style={styles.textLight}>
              {email || "-"}
            </ThemedText>
          </View>
        </View>

        <View style={styles.row}>
          <IconButton
            iconSet="Feather"
            iconName="map-pin"
            size={22}
            iconColor={theme.colors.brand.focus}
            style={styles.iconButtonMargin}
          />
          <View style={styles.content}>
            <ThemedText variant="body" style={styles.textLight}>
              ADRESSE
            </ThemedText>
            <ThemedText variant="body" style={styles.textLight}>
              {fullAddress.trim() || "-"}
            </ThemedText>
          </View>
        </View>

        <View style={styles.row}>
          <IconButton
            iconSet="Feather"
            iconName="check-circle"
            size={22}
            iconColor={theme.colors.brand.focus}
            style={styles.iconButtonMargin}
          />
          <View style={styles.content}>
            <ThemedText variant="body" style={styles.textLight}>
              STATUS
            </ThemedText>
            <ThemedText variant="body" style={styles.textLight}>
              {profile.status || "UNBEKANNT"}
            </ThemedText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background.base,
  },
  nameHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 287,
    height: 100,
    marginLeft: 24,
    marginTop: 40,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.brand.secondary,
    marginRight: 32,
  },
  cardContainer: {
    width: 327,
    marginLeft: 44,
    marginTop: 40,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 10,
  },
  iconButtonMargin: {
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  textLight: {
    color: theme.colors.text.light,
  },
  nameText: {
    color: theme.colors.brand.primary,
    marginBottom: 5,
  },
  cityText: {
    color: theme.colors.brand.secondary,
  },
  editButton: {
    marginRight: 5,
  },
});
