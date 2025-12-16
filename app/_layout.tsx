import Auth from "@app/Auth";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@lib/supabase";
import { Session } from "@supabase/supabase-js";
import { theme } from "@theme";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { BackButton } from "../components";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [loaded, error] = useFonts({
    Inter: require("../assets/fonts/Inter/Inter-Variable.ttf"),
    PlusJakartaSans: require("../assets/fonts/PlusJakartaSans/PlusJakartaSans-Variable.ttf"),
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if ((loaded || error) && isAuthReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, isAuthReady]);

  if (!loaded && !error) {
    return null;
  }

  if (!isAuthReady) {
    //TODO Possibly add something like a 404 screen?
    return null;
  }

  if (!session?.user) {
    return (
      <View style={{ flex: 1 }}>
        <Auth />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={({ navigation, route }) => ({
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
        name="Animal/Add"
        options={{
          title: "Tier hinzufügen",
          tabBarLabel: "hinzufügen",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "add-circle-sharp" : "add-circle-outline"} size={size} color={color} />
          ),
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
        name="Animal/[id]/index"
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
    </Tabs>
  );
}
