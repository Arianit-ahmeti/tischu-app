import { ThemedText } from "@components";
import { theme } from "@theme";
import React from "react";
import { Pressable, PressableProps, StyleSheet } from "react-native";

interface ButtonProps extends PressableProps {
  borderRadius?: number;
  backgroundColor?: string;
  textColor?: string;
}

export const ThemedButton: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  borderRadius = 12,
  backgroundColor = theme.colors.brand.focus,
  textColor = theme.colors.text.inverted,
  children,
  ...props
}) => {
  if (props.disabled) {
    backgroundColor = theme.colors.disabled;
    textColor = theme.colors.text.muted;
  }

  const interactionColor = theme.colors.brand.hover;

  const content =
    typeof children === "string" ? (
      <ThemedText variant="buttonPrimary" color={textColor}>
        {children}
      </ThemedText>
    ) : (
      children
    );

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          borderRadius,
          backgroundColor: pressed ? interactionColor : backgroundColor,
        },
      ]}
      {...props}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    margin: 4,
  },
});
