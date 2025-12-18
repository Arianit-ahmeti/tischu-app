import Auth from "@app/Auth";
import { useSupabaseSession } from "@hooks/useSupabaseSession";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function App() {
  const { session, isLoading } = useSupabaseSession();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (session?.user) {
    return <Redirect href="/(tabs)/AnimalList" />;
  }

  return <Auth />;
}
