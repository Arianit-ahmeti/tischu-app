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
      {/* TASK #29: Registrierung des Tier-Detail-Endpunkts */}
            <Stack.Screen 
                name="Animal/[id]" 
                options={{ 
                    title: "Tierprofil",
                }}
            />
            {/* TASK #17: Route für Tier bearbeiten */}
            <Stack.Screen 
                name="Animal/edit" 
                options={{ 
                    title: "Tier bearbeiten",
                }}
            />

           
      <Stack.Screen name="Animal/Add" options={{ title: "Tier hinzufügen" }} />
      <Stack.Screen name="AnimalList" options={{ title: "Tier-Liste" }} />
    </Stack>
  );
}
