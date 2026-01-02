import { BackButton } from "@components";
import { theme } from "@theme";

export const defaultScreenOptions = ({ navigation }: { navigation: any }) => ({
  headerTintColor: theme.colors.text.dark,
  headerShadowVisible: false,
  headerTitleAlign: "center" as const,
  headerTitleStyle: theme.typography.h2,
  contentStyle: { backgroundColor: theme.colors.background.base },

  headerLeft: () => {
    if (navigation.canGoBack()) {
      return <BackButton />;
    }
    return null;
  },
});
