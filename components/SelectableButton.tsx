import { theme } from "@theme";
import React from "react";
import { Pressable, PressableProps, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";

interface SelectableButtonProps extends PressableProps {
  backgroundColor?: string;
  borderColor?: string;
  isSelected: boolean;
}

export const SelectableButton: React.FC<React.PropsWithChildren<SelectableButtonProps>> = ({
  backgroundColor = theme.colors.brand.primary,
  borderColor = theme.colors.brand.primary,
  isSelected = false,
  children,
  ...props
}) => {
  let textColor = theme.colors.text.inverted;

  if (!isSelected) {
    textColor = theme.colors.text.dark;
    backgroundColor = "transparent";
    borderColor = theme.colors.brand.secondary;
  }

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
          borderColor,
          borderWidth: 1,
        },
      ]}
      {...props}
    >
      <ThemedText color={textColor} variant="buttonSecondary" numberOfLines={1}>
        {children}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 32,
    margin: 4,
  },
});
