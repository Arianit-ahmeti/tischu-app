import { ThemedText } from "@components";
import { theme } from "@theme";
import React from "react";
import { Pressable, PressableProps, StyleSheet } from "react-native";

interface ButtonProps extends PressableProps {
  variant?: "filled" | "text";
  borderRadius?: number;
  backgroundColor?: string;
  textColor?: string;
  disabledTextColor?: string;
}

export const ThemedButton: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  variant = "filled",
  borderRadius = 12,
  backgroundColor = theme.colors.brand.focus,
  textColor = theme.colors.text.inverted,
  disabledTextColor = theme.colors.text.muted,
  children,
  disabled,
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
      <ThemedText variant="buttonPrimary" color={finalTextColor}>
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
