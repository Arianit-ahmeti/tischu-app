import { AlertDialog, FileItem, IconButton, PreviewModal, RenameModal, ThemedButton, ThemedText } from "@components";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useOrganizationFiles } from "@hooks/useOrganizationFiles";
import { theme } from "@theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function OrganizationVerification() {
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const [alertVisible, setAlertVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  const { files, uploadedFiles, userId, loadingFiles, saving, actions } = useOrganizationFiles(() =>
    setAlertVisible(true)
  );

  const onFilesSelection = () => {
    const options = ["Fotos", "Dateien", "Kamera", "Abbrechen"];
    showActionSheetWithOptions({ options, cancelButtonIndex: 3 }, async (index) => {
      if (index !== undefined && index !== 3) {
        await actions.handleSelection(index);
      }
    });
  };

  const onConfirmDelete = async () => {
    if (fileToDelete) {
      setDeleteModalVisible(false);
      await actions.handleDelete(fileToDelete);
      setFileToDelete(null);
    }
  };

  const onConfirmRename = async (newName: string) => {
    setIsRenameModalVisible(false);
    await actions.handleRename(selectedFileName, newName);
  };

  const triggerSave = () => {
    if (files.length > 0) setConfirmVisible(true);
  };

  const onFinalSave = async () => {
    setConfirmVisible(false);
    await actions.handleUpload();
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
            onPress: onFinalSave,
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

      <AlertDialog
        visible={deleteModalVisible}
        title="Datei löschen"
        message={`Möchten Sie "${fileToDelete}" wirklich löschen?`}
        buttons={[
          { text: "Abbrechen", onPress: () => setDeleteModalVisible(false) },
          { text: "Löschen", onPress: onConfirmDelete },
        ]}
        onDismiss={() => setDeleteModalVisible(false)}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.flexGrow}>
        <TouchableOpacity onPress={onFilesSelection} style={styles.uploadContainer} activeOpacity={0.7}>
          <IconButton
            iconSet="FontAwesome5"
            iconName="upload"
            size={32}
            onPress={onFilesSelection}
            iconColor={theme.colors.brand.primary}
          />
          <ThemedText variant="bodyLarge" style={styles.uploadTitle}>
            Datei auswählen
          </ThemedText>
        </TouchableOpacity>

        <ThemedText variant="body" style={styles.infoText}>
          Unterstützte Formate: PDF und gängige Bildformate (JPG, PNG, HEIC, WebP u. v. m.)
        </ThemedText>

        <View>
          {files.map((file, index) => (
            <FileItem
              key={`new-${index}`}
              name={file.name}
              uri={file.uri}
              type={file.type}
              isUploaded={false}
              onDelete={() => actions.removeLocalFile(index)}
              onRename={(name) => {
                setSelectedFileName(name);
                setIsRenameModalVisible(true);
              }}
              onPreview={(uri, name, type) => setPreviewFile({ uri, name, type })}
            />
          ))}
        </View>
        {loadingFiles ? (
          <ActivityIndicator color={theme.colors.brand.primary} />
        ) : (
          <View>
            {uploadedFiles.map((file) => (
              <FileItem
                key={file.id}
                name={file.name}
                userId={userId!}
                isUploaded={true}
                onDelete={() => {
                  setFileToDelete(file.name);
                  setDeleteModalVisible(true);
                }}
                onRename={(name) => {
                  setSelectedFileName(name);
                  setIsRenameModalVisible(true);
                }}
                onPreview={(uri, name, type) => setPreviewFile({ uri, name, type })}
              />
            ))}
          </View>
        )}
        <View style={styles.flex} />
        {files.length > 0 && (
          <View style={styles.saveButton}>
            <ThemedButton onPress={triggerSave} disabled={saving}>
              {saving ? "Wird gesendet..." : "Dokumente senden"}
            </ThemedButton>
          </View>
        )}
      </ScrollView>

      <PreviewModal
        isVisible={!!previewFile}
        uri={previewFile?.uri}
        name={previewFile?.name}
        type={previewFile?.type}
        onClose={() => setPreviewFile(null)}
      />

      <RenameModal
        isVisible={isRenameModalVisible}
        currentName={selectedFileName}
        onClose={() => setIsRenameModalVisible(false)}
        onConfirm={onConfirmRename}
      />
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
  saveButton: {
    marginTop: "auto",
    marginBottom: 30,
  },
  flexGrow: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
});
