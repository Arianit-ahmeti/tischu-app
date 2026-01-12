import { ThemedButton, ThemedText, ThemedTextInput } from "@components";
import { supabase } from "@lib/supabase";
import { saveOrganization } from "@lib/userService";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

export default function OrganizationSignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [house_number, setHouseNumber] = useState("");
  const [postal_code, setPostalCode] = useState<string>("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  async function handleOrganizationSignUp() {
    setLoading(true);

    if (!email || !password) {
      return Alert.alert("You need an email or password");
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) return Alert.alert(error.message);
    if (!session) Alert.alert("Please check your inbox for email verification!");

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
    <ScrollView style={styles.scrollview}>
      <View style={styles.container}>
        <ThemedText variant="h3">E-Mail Adresse</ThemedText>
        <ThemedTextInput onChangeText={(text) => setEmail(text)} value={email} placeholder="E-Mail Adresse" />

        <ThemedText variant="h3">Passwort</ThemedText>
        <ThemedTextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Passwort"
          secureTextEntry
        />

        <ThemedText variant="h3">Vereinsname</ThemedText>
        <ThemedTextInput onChangeText={(text) => setName(text)} value={name} placeholder="Name der Organization" />

        <ThemedText variant="h3">Straße</ThemedText>
        <ThemedTextInput onChangeText={(text) => setStreet(text)} value={street} placeholder="Straße" />

        <ThemedText variant="h3">Hausnummer</ThemedText>
        <ThemedTextInput onChangeText={(text) => setHouseNumber(text)} value={house_number} placeholder="Hausnummer" />

        <ThemedText variant="h3">PLZ</ThemedText>
        <ThemedTextInput
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, "");
            setPostalCode(numericText);
          }}
          value={postal_code}
          placeholder="Postleitzahl"
          keyboardType="numeric"
        />

        <ThemedText variant="h3">Stadt</ThemedText>
        <ThemedTextInput onChangeText={(text) => setCity(text)} value={city} placeholder="Stadt" />

        <ThemedText variant="h3">Land</ThemedText>
        <ThemedTextInput onChangeText={(text) => setCountry(text)} value={country} placeholder="Land" />

        <View style={styles.buttonSpacing}>
          <ThemedButton textStyle={{ fontWeight: "bold" }} onPress={async () => handleOrganizationSignUp()}>
            REGISTRIEREN
          </ThemedButton>
        </View>
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
    alignSelf: "stretch",
    marginTop: 20,
  },
  scrollview: {
    flex: 1,
  },
});
