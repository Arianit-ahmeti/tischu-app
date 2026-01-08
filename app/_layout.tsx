import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { defaultScreenOptions } from "@lib/constants/screenOptions";
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
    <ActionSheetProvider>
      <Stack screenOptions={defaultScreenOptions}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="View/User" options={{ headerShown: false }} />
        <Stack.Screen name="View/Organization" options={{ headerShown: false }} />
        <Stack.Screen name="Animal/[id]" options={{ title: "Tierprofil" }} />
        <Stack.Screen name="AddEdit/Edit" options={{ title: "Tier bearbeiten" }} />
        <Stack.Screen name="AddEdit/Add" options={{ title: "Tier hinzufügen" }} />
        <Stack.Screen name="Organization/Profile" options={{ title: "Vereinsprofil" }} />
        <Stack.Screen name="Organization/SignUp" options={{ title: "Organisation Registrierung" }} />
        <Stack.Screen name="Organization/Edit" options={{ title: "Vereinsdaten bearbeiten" }} />
        <Stack.Screen name="Organization/Verification" options={{ title: "Verein verifizieren" }} />
        <Stack.Screen name="OrgAnimalList" options={{ title: "Vereinstiere" }} />
      </Stack>
    </ActionSheetProvider>
  );
}
