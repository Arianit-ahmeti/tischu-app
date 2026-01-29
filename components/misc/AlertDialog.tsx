import { theme } from "@theme";
import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { ThemedButton } from "../ui/ThemedButton";
import { ThemedText } from "../ui/ThemedText";

interface AlertDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: {
    text: string;
    onPress?: () => void;
    variant?: "filled" | "text";
  }[];
  onDismiss?: () => void;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: "OK" }],
  onDismiss,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <View style={styles.dialog}>
          <ThemedText variant="h1" style={styles.title}>
            {title}
          </ThemedText>
          {message && (
            <ThemedText variant="body" style={styles.message}>
              {message}
            </ThemedText>
          )}

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <ThemedButton
                key={index}
                variant={button.variant || "filled"}
                onPress={() => {
                  button.onPress?.();
                  onDismiss?.();
                }}
              >
                {button.text}
              </ThemedButton>
            ))}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    backgroundColor: theme.colors.background.base,
    borderRadius: 12,
    padding: 24,
    width: "80%",
    maxWidth: 400,
  },
  title: {
    color: theme.colors.brand.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    color: theme.colors.text.light,
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 10,
  },
  button: {
    flex: 1,
  },
});
