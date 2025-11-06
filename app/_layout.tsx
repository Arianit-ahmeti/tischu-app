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
      {/* Individual Screens */}
      <Stack.Screen
        name="index"
        options={{
          title: "Account",
        }}
      />
      <Stack.Screen name="Animal/Add" options={{ title: "Tier hinzufügen" }} />
    </Stack>
  );
}
