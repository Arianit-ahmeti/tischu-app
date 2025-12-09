import { ThemedButton, ThemedText } from "@components";
import { ThemedTextInput } from "@components/ThemedTextInput";
import { supabase } from "@lib/supabase";
import { Organization } from "@types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

export async function saveOrganization(organization: Partial<Organization>) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Authentication Error:", authError.message);
    return null;
  }

  if (!user) {
    console.error("Error: No user is currently logged in. Organization signup requires a logged-in user.");
    return null;
  }

  const { data, error } = await supabase
    .from("organization")
    .insert({
      id: user.id,
      name: organization.name,
      street: organization.street,
      house_number: organization.house_number,
      postal_code: organization.postal_code,
      city: organization.city,
      country: organization.country,
      status: "unverified",
    })
    .select();

  if (error) {
    console.log("Error saving organization:", error.message);
    return { data: null, error };
  } else {
    console.log("Organization saved successfully:", data);
    return { data, error: null };
  }
}

export default function OrganizationSignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [house_number, setHouseNumber] = useState("");
  const [postal_code, setPostalCode] = useState<string>("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  async function handleOrganizationSignUp() {
    setLoading(true);
    const postalCodeAsNumber = postal_code ? parseInt(postal_code) : undefined;
    const result = await saveOrganization({
      name,
      street,
      house_number,
      postal_code: postalCodeAsNumber,
      city,
      country,
      status: "unverified",
    });
    setLoading(false);
    if (result && result.error) {
      Alert.alert("Sign Up failed", result.error.message);
    }
    if (result && result.data) {
      router.replace("/");
    }
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ThemedText variant="h3">Vereinsname:</ThemedText>
        <ThemedTextInput onChangeText={(text) => setName(text)} value={name} placeholder="Name der Organization" />

        <ThemedText variant="h3">Straße:</ThemedText>
        <ThemedTextInput onChangeText={(text) => setStreet(text)} value={street} placeholder="Straße" />

        <ThemedText variant="h3">Hausnummer:</ThemedText>
        <ThemedTextInput onChangeText={(text) => setHouseNumber(text)} value={house_number} placeholder="Hausnummer" />

        <ThemedText variant="h3">PLZ:</ThemedText>
        <ThemedTextInput
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, "");
            setPostalCode(numericText);
          }}
          value={postal_code}
          placeholder="Postleitzahl"
          keyboardType="numeric"
        />

        <ThemedText variant="h3">Stadt:</ThemedText>
        <ThemedTextInput onChangeText={(text) => setCity(text)} value={city} placeholder="Stadt" />

        <ThemedText variant="h3">Land:</ThemedText>
        <ThemedTextInput onChangeText={(text) => setCountry(text)} value={country} placeholder="Land" />

        <ThemedButton onPress={async () => handleOrganizationSignUp()} style={styles.buttonSpacing}>
          Registrieren
        </ThemedButton>

        <View style={{ height: 20 }}></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    paddingVertical: 5,
  },
  buttonSpacing: {
    marginTop: 20,
  },
});
