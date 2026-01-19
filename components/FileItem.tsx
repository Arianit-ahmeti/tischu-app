import { useActionSheet } from "@expo/react-native-action-sheet";
import { organizationVerificationService } from "@lib/services/organizationVerificationService";
import { theme } from "@theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "./IconButton";
import { ThemedText } from "./ThemedText";

interface FileItemProps {
  name: string;
  uri?: string;
  type?: string;
  userId?: string;
  isUploaded: boolean;
  onDelete: () => void;
  onRename?: (newName: string) => void;
  onPreview: (uri: string, name: string, type: string) => void;
}

export const FileItem: React.FC<FileItemProps> = ({
  name,
  uri,
  type,
  userId,
  isUploaded,
  onDelete,
  onRename,
  onPreview,
}) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const isPdf = type?.includes("pdf") || name.toLowerCase().endsWith(".pdf");

  const handleOptions = () => {
    const options = ["Vorschau", "Umbenennen", "Löschen", "Abbrechen"];
    const destructiveButtonIndex = 2;
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title: name,
      },
      async (index) => {
        if (index === cancelButtonIndex) return;

        switch (index) {
          case 0: // Vorschau
            const previewUri = isUploaded ? organizationVerificationService.getFilePreviewUrl(userId!, name) : uri;
            if (previewUri) {
              onPreview(previewUri, name, type || "");
            }
            break;
          case 1: // Umbenenen
            onRename?.(name);
            break;
          case 2: // Löschen
            onDelete();
            break;
        }
      }
    );
  };

  return (
    <View style={styles.fileRow}>
      <IconButton
        iconSet="FontAwesome5"
        iconName={isPdf ? "file-pdf" : "file-image"}
        size={20}
        iconColor={theme.colors.brand.primary}
      />

      <ThemedText
        variant="body"
        style={styles.fileName}
        color={!isUploaded ? theme.colors.brand.secondary : theme.colors.text.light}
        numberOfLines={1}
        ellipsizeMode="middle"
      >
        {name}
      </ThemedText>

      <IconButton
        iconSet="Entypo"
        iconName="dots-three-horizontal"
        size={24}
        iconColor={theme.colors.brand.primary}
        onPress={handleOptions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: theme.colors.background.base,
    color: theme.colors.text.light,
    borderRadius: 10,
    marginBottom: 8,
  },
  fileName: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
});
