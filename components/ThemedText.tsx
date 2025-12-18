import { theme, TypographyStyle } from "@theme";
import React from "react";
import { Text, TextProps, TextStyle } from "react-native";

interface ThemedTextProps extends TextProps {
  variant?: TypographyStyle;
  color?: string;
}

export const ThemedText: React.FC<ThemedTextProps> = ({ variant = "body", color, style, children, ...props }) => {
  const typographyStyle = theme.typography[variant];

  const combinedStyle: TextStyle = {
    ...typographyStyle,
    ...(color && { color }),
    ...(style as TextStyle),
  };

  return (
    <Text style={combinedStyle} {...props}>
      {children}
    </Text>
  );
};
