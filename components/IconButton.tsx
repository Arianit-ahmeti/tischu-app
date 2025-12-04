import React from "react";
import {
  ColorValue,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

import * as IconLibs from "@expo/vector-icons";
import { theme } from "@theme";

type IconSet = keyof typeof IconLibs;

export interface IconButtonProps extends PressableProps {
  iconSet: IconSet; //Feather, FontAwesome5, Ionicons etc.
  iconName: string; //"filter", "dog", "log-out-outline" etc.
  size?: number;
  iconColor?: ColorValue;

  backgroundColor?: ColorValue;
  style?: ViewStyle | ViewStyle[];
}

export const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  iconSet,
  iconName,
  size = 24,
  iconColor = theme.colors.text.dark,
  backgroundColor = "transparent",
  style,
  disabled = false,
  ...props
}) => {
  const IconComponent = IconLibs[iconSet];

  if (!IconComponent) {
    console.error(
      `IconButton: Angefordertes Icon-Set nicht gefunden: ${iconSet}`,
    );
    return <Text style={{ color: theme.colors.error, fontSize: 10 }}>ERR</Text>;
  }

  const defaultSize = size * 1.8; //pressable size

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          width: defaultSize,
          height: defaultSize,
          borderRadius: defaultSize / 2,
          backgroundColor: backgroundColor,
          opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
        },
        style,
      ]}
      {...props}
    >
      <IconComponent name={iconName} size={size} color={iconColor} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    justifyContent: "center",
    alignItems: "center",
  },
});
