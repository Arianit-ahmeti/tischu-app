import { Ionicons } from "@expo/vector-icons";
import { defaultScreenOptions } from "@lib/constants/screenOptions";
import { theme } from "@theme";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={(props) => {
        const defaults = defaultScreenOptions(props);
        return {
          ...defaults,
          headerStyle: {
            backgroundColor: theme.colors.background.base,
          },
          sceneStyle: defaults.contentStyle,
          tabBarActiveTintColor: theme.colors.brand.primary,
          tabBarInactiveTintColor: theme.colors.text.muted,
          tabBarStyle: {
            backgroundColor: theme.colors.background.base,
          },
        };
      }}
    >
      <Tabs.Screen
        name="AnimalList"
        options={{
          tabBarLabel: "Tiere",
          tabBarIcon: ({ color, size, focused }) => {
            return <Ionicons name={focused ? "paw-sharp" : "paw-outline"} size={size} color={color} />;
          },
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
