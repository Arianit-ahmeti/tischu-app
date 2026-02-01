import { Feather } from "@expo/vector-icons";
import { theme } from "@theme";
import { router } from "expo-router";
import React from "react";
import { Pressable, PressableProps, StyleSheet, ViewStyle } from "react-native";

interface BackButtonProps extends PressableProps {
  color?: string;
  size?: number;
}

export const BackButton: React.FC<BackButtonProps> = ({
  color = theme.colors.brand.primary,
  size = 24,
  style,
  ...props
}) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }, style as ViewStyle]}
      onPress={() => router.back()}
      {...props}
    >
      <Feather name="chevron-left" size={size} color={color} style={{ marginRight: 2 }} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.warm,
    justifyContent: "center",
    alignItems: "center",
  },
});
