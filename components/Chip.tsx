import { theme } from "@theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface ChipProps {
  color?: string;
  text: string;
}

export const Chip: React.FC<ChipProps> = ({ color = null, text }) => {
  if (!color) {
    color =
      text == "relaxed"
        ? theme.colors.characterChip.relaxed
        : text == "anxious"
          ? theme.colors.characterChip.anxious
          : text == "aggressive"
            ? theme.colors.characterChip.aggressive
            : text == "friendly"
              ? theme.colors.characterChip.friendly
              : text == "shy"
                ? theme.colors.characterChip.shy
                : text == "small"
                  ? theme.colors.sizeChip.small
                  : text == "medium"
                    ? theme.colors.sizeChip.medium
                    : text == "large"
                      ? theme.colors.sizeChip.large
                      : theme.colors.brand.primary;
  }
  return (
    <View style={[styles.chip, { backgroundColor: color }]}>
      <ThemedText style={styles.text} variant="buttonSecondary" color={theme.colors.text.inverted}>
        {text}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    padding: 2,
  },
  chip: {
    borderRadius: 30,
    margin: 2,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
});
