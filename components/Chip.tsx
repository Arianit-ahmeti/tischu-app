import { theme } from "@theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface ChipProps {
  color?: string;
  text: string;
}

export const Chip: React.FC<ChipProps> = ({ color = theme.colors.brand.primary, text, ...props }) => {
  return (
    <View style={[styles.chip, { backgroundColor: color }]}>
      <ThemedText style={styles.text} variant="buttonSecondary" color={theme.colors.text.inverted}>
        {" "}
        {text}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    padding: 2,
  },
  chip: {
    borderRadius: 30,
    margin: 2,
    paddingHorizontal: 10,
    paddingRight: 13,
  },
});
