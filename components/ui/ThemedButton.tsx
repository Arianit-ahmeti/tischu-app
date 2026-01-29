import { theme } from "@theme";
import React from "react";
import { Pressable, PressableProps, StyleSheet, TextStyle } from "react-native";
import { ThemedText } from "./ThemedText";

interface ButtonProps extends PressableProps {
  variant?: "filled" | "text";
  borderRadius?: number;
  backgroundColor?: string;
  textColor?: string;
  disabledTextColor?: string;
  textStyle?: TextStyle;
}

export const ThemedButton: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  variant = "filled",
  borderRadius = 12,
  backgroundColor = theme.colors.brand.focus,
  textColor = theme.colors.text.inverted,
  disabledTextColor = theme.colors.text.muted,
  children,
  disabled,
  textStyle,
  ...props
}) => {
  let finalBackgroundColor = backgroundColor;
  let finalTextColor = textColor;
  let containerStyle = styles.filledContainer;
  let interactionColor = theme.colors.brand.hover;

  if (variant === "text") {
    finalBackgroundColor = "transparent";
    finalTextColor = disabled ? disabledTextColor : theme.colors.brand.focus;
    containerStyle = styles.textContainer;
  } else {
    if (disabled) {
      finalBackgroundColor = theme.colors.disabled;
      finalTextColor = disabledTextColor;
    }
  }

  const content =
    typeof children === "string" ? (
      <ThemedText variant="buttonPrimary" style={textStyle} color={finalTextColor} numberOfLines={1}>
        {children}
      </ThemedText>
    ) : (
      children
    );

  return (
    <Pressable
      style={({ pressed }) => [
        containerStyle,
        variant === "filled" && {
          borderRadius,
          backgroundColor: pressed ? interactionColor : finalBackgroundColor,
        },
        variant === "text" && {
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
  filledContainer: {
    padding: 20,
    alignItems: "center",
  },
  textContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
