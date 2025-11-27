import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SelectableButton({
  isSelected,
  title,
  onPress,
}: {
  isSelected: boolean;
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.button,
          isSelected ? styles.selectedButton : styles.deselectedButton,
        ]}
      >
        <Text>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  selectedButton: {
    backgroundColor: "#007AFF",
  },
  deselectedButton: {
    backgroundColor: "#DDDDDD",
  },
});
