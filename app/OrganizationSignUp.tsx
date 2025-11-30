import { supabase } from "@lib/supabase";
import { Organization } from "@types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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
    console.error(
      "Error: No user is currently logged in. Organization signup requires a logged-in user.",
    );
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
        <Text style={{ fontWeight: "bold" }}>Name:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setName(text)}
          value={name}
          placeholder="Name der Organization"
        />

        <Text style={{ fontWeight: "bold" }}>Straße:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setStreet(text)}
          value={street}
          placeholder="Straße"
        />

        <Text style={{ fontWeight: "bold" }}>Hausnummer:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setHouseNumber(text)}
          value={house_number}
          placeholder="Hausnummer"
        />

        <Text style={{ fontWeight: "bold", marginTop: 10 }}>PLZ:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, "");
            setPostalCode(numericText);
          }}
          value={postal_code}
          placeholder="Postleitzahl"
          keyboardType="numeric"
        />

        <Text style={{ fontWeight: "bold", marginTop: 10 }}>Stadt:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setCity(text)}
          value={city}
          placeholder="Stadt"
        />

        <Text style={{ fontWeight: "bold", marginTop: 10 }}>Land:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setCountry(text)}
          value={country}
          placeholder="Land"
        />

        <Button
          title="Registrieren"
          onPress={async () => handleOrganizationSignUp()}
        />
        <View style={{ height: 20 }}></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  name: { fontSize: 28, fontWeight: "bold", marginBottom: 30 },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#5f5f5fff",
    borderWidth: 1,
    borderRadius: 5,
    height: 45,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  buttonContainer: { marginTop: 30, overflow: "hidden", width: "30%" },
  button: { marginVertical: 8, overflow: "hidden" },
});
