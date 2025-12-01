import { theme } from "@theme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require("../assets/fonts/Inter/Inter-Variable.ttf"),
    PlusJakartaSans: require("../assets/fonts/PlusJakartaSans/PlusJakartaSans-Variable.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerTintColor: "#333",
        headerShadowVisible: false,
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: theme.colors.background.base },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Account" }} />
      <Stack.Screen name="Animal/[id]" options={{ title: "Tierprofil" }} />
      <Stack.Screen name="Animal/edit" options={{ title: "Tier bearbeiten" }} />
      <Stack.Screen name="Animal/Add" options={{ title: "Tier hinzufügen" }} />
      <Stack.Screen
        name="OrganizationProfile"
        options={{ title: "Vereinsprofil" }}
      />
      <Stack.Screen
        name="OrganizationSignUp"
        options={{ title: "Organisation Registrierung" }}
      />
    </Stack>
  );
}
