import { ColumnView, RowView, ThemedText } from "components";
import { ReactNode } from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

interface ListTileProps {
  onPress?: (event: GestureResponderEvent) => void;
  title?: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  style?: ViewStyle;
}

export const ListTile: React.FC<ListTileProps> = (props) => {
  const hasSubtitle = !!props.subtitle;

  const minHeight = hasSubtitle ? 64 : 48;

  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.container,
        { minHeight, opacity: pressed ? 0.6 : 1 },
        props.style,
      ]}
    >
      <RowView style={styles.row}>
        {props.leading && <View style={styles.leading}>{props.leading}</View>}

        <ColumnView
          style={[styles.content, { marginLeft: props.leading ? 16 : 0 }]}
        >
          {props.title && (
            <ThemedText variant="body" numberOfLines={1}>
              {props.title}
            </ThemedText>
          )}
          {hasSubtitle && (
            <ThemedText
              variant="bodySmall"
              numberOfLines={1}
              style={styles.subtitle}
            >
              {props.subtitle}
            </ThemedText>
          )}
        </ColumnView>

        {props.trailing && (
          <View style={styles.trailing}>{props.trailing}</View>
        )}
      </RowView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  row: {
    flex: 1,
    alignItems: "center",
  },
  leading: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 24,
    minHeight: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  subtitle: {
    marginTop: 2,
    opacity: 0.7,
  },
  trailing: {
    marginLeft: 16,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 24,
    minHeight: 24,
  },
});
