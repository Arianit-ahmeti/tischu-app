import { ThemedText } from "@components";
import { theme } from "@theme";
import React from "react";
import { Pressable, PressableProps, StyleSheet } from "react-native";

interface TextButtonProps extends PressableProps {
  textColor?: string;
  disabledTextColor?: string;
}

export const TextButton: React.FC<React.PropsWithChildren<TextButtonProps>> = ({
  textColor = theme.colors.brand.focus,
  disabledTextColor = theme.colors.text.muted,
  children,
  disabled,
  ...props
}) => {
  const content =
    typeof children === "string" ? (
      <ThemedText
        variant="buttonPrimary"
        color={disabled ? disabledTextColor : textColor}
      >
        {children}
      </ThemedText>
    ) : (
      children
    );

  const interactionColor = theme.colors.brand.hover;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      disabled={disabled}
      {...props}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
