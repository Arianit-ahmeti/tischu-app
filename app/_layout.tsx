import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: "#333",
        headerShadowVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Account" }} />
      <Stack.Screen name="Animal/[id]" options={{ title: "Tierprofil" }} />
      <Stack.Screen name="Animal/edit" options={{ title: "Tier bearbeiten" }} />
      <Stack.Screen name="Animal/Add" options={{ title: "Tier hinzufügen" }} />
      <Stack.Screen name="AnimalList" options={{ title: "Tier-Liste" }} />
    </Stack>
  );
}
