import { ThemedText } from "@components";
import { theme } from "@theme";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ChipProps {
  color?: string;
  text: string;
}
const colorMap = {
  relaxed: theme.colors.characterChip.relaxed,
  anxious: theme.colors.characterChip.anxious,
  aggressive: theme.colors.characterChip.aggressive,
  friendly: theme.colors.characterChip.friendly,
  shy: theme.colors.characterChip.shy,
  small: theme.colors.sizeChip.small,
  medium: theme.colors.sizeChip.medium,
  large: theme.colors.sizeChip.large,
};

export const Chip: React.FC<ChipProps> = ({ color = null, text }) => {
  if (!color) color = colorMap[text as keyof typeof colorMap] || theme.colors.brand.primary;

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
