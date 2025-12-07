import { theme } from "@theme";
import React from "react";
import { StyleSheet, TextProps, View } from "react-native";
import { RowView } from './RowView';
import { ThemedText } from './ThemedText';


interface ChipProps extends TextProps {
  color?: string;
}

export const Chip: React.FC<ChipProps> = ({
  color = theme.colors.brand.primary,
  children,
  ...props
}) => {
  return (
    <RowView>
      <View style={[styles.chip, {backgroundColor: color}]}>
        <ThemedText variant="buttonSecondary" color={theme.colors.text.inverted}> {children}</ThemedText>
      </View>
    </RowView>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: 30,
    margin: 1,
    paddingHorizontal: 10,
  },
});
