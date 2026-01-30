import { ThemedButton, ThemedText, ThemedTextInput } from "@components";
import { supabase } from "@lib/supabase";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, AppState, Image, StyleSheet, View } from "react-native";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    setLoading(false);
    error ? Alert.alert(error.message) : router.replace("/");
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    setLoading(false);
    error ? Alert.alert(error.message) : router.replace("/");
    if (!session) Alert.alert("Please check your inbox for email verification!");
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/tischu-logo.png")} style={styles.logo} resizeMode="contain" />
      </View>
      <ThemedText variant="h3">E-Mail-Adresse</ThemedText>
      <ThemedTextInput
        testID="auth/email-input"
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="E-Mail Adresse eingeben"
        autoCapitalize={"none"}
      />
      <ThemedText variant="h3">Passwort</ThemedText>
      <ThemedTextInput
        testID="auth/password-input"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        placeholder="Passwort eingeben"
        autoCapitalize={"none"}
      />
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <ThemedButton
          testID="auth/sign-in-button"
          textStyle={{ fontWeight: "bold" }}
          disabled={loading}
          onPress={() => signInWithEmail()}
        >
          EINLOGGEN
        </ThemedButton>
      </View>
      <View style={styles.verticallySpaced}>
        <ThemedButton testID="auth/sign-up-button" variant="text" disabled={loading} onPress={() => signUpWithEmail()}>
          Als Nutzer registrieren
        </ThemedButton>
      </View>
      <View style={[styles.bottomContainer]}>
        <ThemedButton
          testID="auth/organization-sign-up-button"
          variant="text"
          disabled={loading}
          onPress={() => router.navigate("/Organization/SignUp")}
        >
          Als Organisation registrieren
        </ThemedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 12,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 100,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
