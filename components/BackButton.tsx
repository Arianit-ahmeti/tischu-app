import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, PressableProps, ViewStyle } from "react-native";
import { theme } from "@theme";

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
      <Ionicons name="chevron-back" size={size} color={color} style={{ marginRight: 2 }} />
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
