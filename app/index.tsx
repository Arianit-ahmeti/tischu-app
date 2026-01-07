import Auth from "@app/Auth";
import { useSupabaseSession } from "@hooks/useSupabaseSession";
import { SessionType } from "@lib/types";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function App() {
  const { session, type, isLoading } = useSupabaseSession();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


    switch (type) {
      case SessionType.user:
        return <Redirect href="/View/User/AnimalList" />;
      case SessionType.organization:
        return <Redirect href="/View/Organization/AnimalList" />;
      default:
        return <Redirect href="/View/User/AnimalList" />;
    }


  return <Auth />;
}
