import { theme } from "@theme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { BackButton } from "../components";

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
      screenOptions={({ navigation }) => ({
        headerTintColor: "#333",
        headerShadowVisible: false,
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: theme.colors.background.base },

        headerLeft: () => {
          if (navigation.canGoBack()) {
            return <BackButton style={{ marginLeft: -8 }} />;
          }
          return null;
        },
      })}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="Animal/[id]/index" options={{ title: "Tierprofil" }} />
      <Stack.Screen name="Animal/[id]/Edit" options={{ title: "Tier bearbeiten" }} />
      <Stack.Screen name="Animal/Add" options={{ title: "Tier hinzufügen" }} />
      <Stack.Screen name="OrganizationProfile" options={{ title: "Vereinsprofil" }} />
      <Stack.Screen name="OrganizationSignUp" options={{ title: "Organisation Registrierung" }} />
      <Stack.Screen name="OrganizationEdit" options={{ title: "Vereinsdaten bearbeiten" }} />
    </Stack>
  );
}
