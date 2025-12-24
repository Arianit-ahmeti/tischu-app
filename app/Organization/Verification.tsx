import { AlertDialog, IconButton, ThemedText } from "@components";
import { useActionSheet } from "@expo/react-native-action-sheet";
import {
  getCurrentUserId,
  getFilesFromPicker,
  SelectedFile,
  uploadOrganizationFiles,
} from "@lib/organizationFileService";
import { theme } from "@theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function OrganizationVerification() {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const [confirmVisible, setConfirmVisible] = useState(false);

  async function handleFilesSelection() {
    const options = ["Fotos", "Dateien", "Kamera", "Abbrechen"];

    showActionSheetWithOptions({ options, cancelButtonIndex: 3 }, async (index) => {
      if (index !== undefined && index !== 3) {
        const newFiles = await getFilesFromPicker(index);
        setFiles((prev) => [...prev, ...newFiles]);
      }
    });
  }

  const triggerSave = () => {
    if (files.length === 0) return;
    setConfirmVisible(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const userId = await getCurrentUserId();
      await uploadOrganizationFiles(userId, files);
      setAlertVisible(true);
      setFiles([]);
    } catch (error: any) {
      Alert.alert("Fehler", error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AlertDialog
        visible={confirmVisible}
        title="Bestätigung"
        message="Möchten Sie die Dokumente zur Verifizierung senden?"
        buttons={[
          {
            text: "Abbrechen",
            onPress: () => setConfirmVisible(false),
          },
          {
            text: "Senden",
            onPress: handleSave,
          },
        ]}
        onDismiss={() => setConfirmVisible(false)}
      />

      <AlertDialog
        visible={alertVisible}
        title="Erfolg"
        message="Ihre Dokumente wurden erfolgreich hochgeladen und werden geprüft."
        buttons={[
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]}
        onDismiss={() => setAlertVisible(false)}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.flexGrow}>
        <TouchableOpacity onPress={handleFilesSelection} style={styles.uploadContainer} activeOpacity={0.7}>
          <IconButton
            iconSet="FontAwesome5"
            iconName="upload"
            size={32}
            onPress={handleFilesSelection}
            iconColor={theme.colors.brand.primary}
          />
          <ThemedText variant="bodyLarge" style={styles.uploadTitle}>
            Datei auswählen
          </ThemedText>
        </TouchableOpacity>

        <ThemedText variant="body" style={styles.infoText}>
          Unterstützte Formate: PDF und gängige Bildformate (JPG, PNG, HEIC, WebP u. v. m.)
        </ThemedText>

        <View style={styles.fileList}>
          {files.map((file, index) => (
            <View key={index} style={styles.fileRow}>
              <IconButton
                iconSet="FontAwesome5"
                iconName={file.type?.includes("pdf") ? "file-pdf" : "file-image"}
                size={20}
                iconColor={theme.colors.brand.primary}
                onPress={() => {}}
              />
              <ThemedText variant="body" style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                {file.name}
              </ThemedText>
            </View>
          ))}
        </View>
        <View style={styles.flex} />
        {files.length > 0 && (
          <TouchableOpacity onPress={triggerSave} style={styles.saveButton} disabled={saving}>
            {saving ? (
              <ActivityIndicator color={theme.colors.background.base} />
            ) : (
              <ThemedText variant="bodyLarge" style={styles.saveButtonText}>
                Dokumente senden
              </ThemedText>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background.base,
  },
  uploadContainer: {
    height: 120,
    backgroundColor: theme.colors.background.light,
    borderRadius: 15,
    borderStyle: "dashed",
    borderWidth: 3,
    borderColor: theme.colors.brand.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  uploadTitle: {
    color: theme.colors.brand.primary,
    marginTop: 8,
  },
  infoText: {
    textAlign: "center",
    color: theme.colors.text.light,
    marginBottom: 20,
  },
  fileList: {
    marginTop: 10,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: theme.colors.background.base,
    borderRadius: 8,
    marginBottom: 8,
  },
  fileName: {
    flex: 1,
    marginLeft: 10,
    color: theme.colors.brand.secondary,
  },
  saveButton: {
    backgroundColor: theme.colors.brand.focus,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 30,
  },
  saveButtonText: {
    color: theme.colors.background.base,
  },
  flexGrow: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
});
