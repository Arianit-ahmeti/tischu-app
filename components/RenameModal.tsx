import { theme } from "@theme";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, TextInput, View } from "react-native";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";

interface RenameModalProps {
  isVisible: boolean;
  currentName: string;
  onClose: () => void;
  onConfirm: (newName: string) => void;
}

export const RenameModal: React.FC<RenameModalProps> = ({ isVisible, currentName, onClose, onConfirm }) => {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (isVisible && currentName) {
      const nameWithoutExt = currentName.substring(0, currentName.lastIndexOf(".")) || currentName;
      setName(nameWithoutExt);
    }
  }, [isVisible, currentName]);

  const handleSave = () => {
    if (name.trim() && name !== currentName) {
      onConfirm(name.trim());
    } else {
      onClose();
    }
  };

  return (
    <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ThemedText variant="h3" style={styles.title}>
            Datei umbenennen
          </ThemedText>

          <View style={styles.inputWrapper}>
            <TextInput style={styles.inputField} value={name} onChangeText={setName} autoFocus selectTextOnFocus />
            <ThemedText style={styles.extensionLabel}>
              {currentName.includes(".") ? currentName.substring(currentName.lastIndexOf(".")) : ""}
            </ThemedText>
          </View>

          <View style={styles.buttonRow}>
            <View style={styles.flex}>
              <ThemedButton variant="text" onPress={onClose} textColor={theme.colors.text.light}>
                Abbrechen
              </ThemedButton>
            </View>

            <View style={styles.flex}>
              <ThemedButton onPress={handleSave}>Speichern</ThemedButton>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  flex: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
    backgroundColor: theme.colors.text.inverted,
  },
  inputField: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: theme.colors.text.dark,
  },
  extensionLabel: {
    fontSize: 16,
    color: theme.colors.text.muted,
    fontWeight: "bold",
  },
});
