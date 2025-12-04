import { theme } from "@theme";
import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

interface ThemedTextInputProps extends TextInputProps {
  backgroundColor?: string;
  borderColor?: string;
  inputTextColor?: string;
}

export const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
  backgroundColor = theme.colors.background.warm,
  borderColor = theme.colors.border.light,
  inputTextColor = theme.colors.text.dark,
  style,
  ...props
}) => {
  return (
    <TextInput
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          color: inputTextColor,
        },
        theme.typography.body,
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 16,
    marginVertical: 8,
    width: "100%",
  },
});
