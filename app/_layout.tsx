import { Ionicons } from "@expo/vector-icons";
import type { NavigationProp, RouteProp } from "@react-navigation/native";
import { theme } from "@theme";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import { BackButton } from "../components";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require("../assets/fonts/Inter/Inter-Variable.ttf"),
    PlusJakartaSans: require("../assets/fonts/PlusJakartaSans/PlusJakartaSans-Variable.ttf"),
  });

  if (!loaded && !error) {
    return null;
  }

  return (
    <Tabs
      screenOptions={({ navigation, route }: { navigation: NavigationProp<any>; route: RouteProp<any> }) => ({
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
        headerLeft: () => {
          const mainTabScreens = ["AnimalList", "Account", "Animal/Add"];
          if (mainTabScreens.includes(route.name)) {
            return null;
          }
          if (navigation.canGoBack()) {
            return <BackButton />;
          }
          return null;
        },
      })}
    >
      <Tabs.Screen
        name="AnimalList"
        options={{
          title: "TischuApp",
          tabBarLabel: "Tiere",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "paw-sharp" : "paw-outline"} size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="AddEdit/Add"
        options={{
          title: "Tier hinzufügen",
          tabBarLabel: "hinzufügen",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "add-circle-sharp" : "add-circle-outline"} size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="AddEdit/Edit"
        options={{
          title: "Tier bearbeiten",
          href: null,
        }}
      />

      <Tabs.Screen
        name="AddEdit/Base"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="Account"
        options={{
          title: "Account",
          tabBarLabel: "Account",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "person-sharp" : "person-outline"} size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Animal/[id]"
        options={{
          title: "Tierprofil",
          href: null,
        }}
      />
      <Tabs.Screen
        name="Animal/[id]/Edit"
        options={{
          title: "Tier bearbeiten",
          href: null,
        }}
      />
      <Tabs.Screen
        name="OrganizationProfile"
        options={{
          title: "Vereinsprofil",
          href: null,
        }}
      />
      <Tabs.Screen
        name="OrganizationSignUp"
        options={{
          title: "Organisation Registrierung",
          href: null,
        }}
      />
      <Tabs.Screen
        name="Auth"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
