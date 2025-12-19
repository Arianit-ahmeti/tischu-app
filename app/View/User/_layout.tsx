import { Ionicons } from "@expo/vector-icons";
import { theme } from "@theme";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: "center",
        tabBarActiveTintColor: theme.colors.brand.primary,
        tabBarInactiveTintColor: theme.colors.text.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.background.base,
        },
        headerStyle: {
          backgroundColor: theme.colors.background.base,
        },
        sceneStyle: {
          backgroundColor: theme.colors.background.base,
        },
      }}
    >
      <Tabs.Screen
        name="AnimalList"
        options={{
          tabBarLabel: "Tiere",
          tabBarIcon: ({ color, size, focused }) => {
            return <Ionicons name={focused ? "paw-sharp" : "paw-outline"} size={size} color={color} />;
          },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Account"
        options={{
          tabBarLabel: "Profil",
          tabBarIcon: ({ color, size, focused }) => {
            return <Ionicons name={focused ? "person-sharp" : "person-outline"} size={size} color={color} />;
          },
          headerTitle: "Account",
        }}
      />
    </Tabs>
  );
}
