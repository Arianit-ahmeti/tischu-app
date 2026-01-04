import {
  deleteOrganizationFile,
  getFilesFromPicker,
  getNextAvailableName,
  getOrganizationFiles,
  renameOrganizationFile,
  SelectedFile,
  uploadOrganizationFiles,
} from "@lib/organizationFileService";
import { getCurrentUserId } from "@lib/userService";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useOrganizationFiles = (onUploadSuccess: () => void) => {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadFiles = async () => {
    try {
      setLoadingFiles(true);
      const id = await getCurrentUserId();
      setUserId(id);
      const fetched = await getOrganizationFiles(id);
      setUploadedFiles(fetched);
    } catch (error) {
      console.error("Load Error:", error);
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleSelection = async (index: number) => {
    const newFiles = await getFilesFromPicker(index);

    const processedFiles = newFiles.map((newFile) => {
      const allNames = [...files.map((f) => f.name), ...uploadedFiles.map((f) => f.name)];
      const finalName = getNextAvailableName(newFile.name, allNames);
      return { ...newFile, name: finalName };
    });
    setFiles((prev) => [...prev, ...processedFiles]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setSaving(true);
    try {
      const id = await getCurrentUserId();
      await uploadOrganizationFiles(id, files, uploadedFiles);
      onUploadSuccess?.();
      setFiles([]);
      await loadFiles();
    } catch (error: any) {
      Alert.alert("Fehler", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!userId) return;
    try {
      setLoadingFiles(true);
      await deleteOrganizationFile(userId, fileName);
      await loadFiles();
    } catch (error) {
      Alert.alert("Fehler", "Datei konnte nicht gelöscht werden.");
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleRename = async (oldName: string, newName: string) => {
    const localIndex = files.findIndex((f) => f.name === oldName);
    if (localIndex !== -1) {
      const extension = oldName.substring(oldName.lastIndexOf("."));
      const desiredName = `${newName.trim()}${extension}`;

      const otherLocalNames = files.filter((_, i) => i !== localIndex).map((f) => f.name);
      const remoteNames = uploadedFiles.map((f) => f.name);
      const allNames = [...otherLocalNames, ...remoteNames];

      const finalName = getNextAvailableName(desiredName, allNames);

      setFiles((prev) => prev.map((f, i) => (i === localIndex ? { ...f, name: finalName } : f)));
      return;
    }

    try {
      setLoadingFiles(true);
      await renameOrganizationFile(userId!, oldName, newName, uploadedFiles);
      await loadFiles();
    } catch (error) {
      Alert.alert("Fehler", "Umbenennen fehlgeschlagen.");
    } finally {
      setLoadingFiles(false);
    }
  };

  const removeLocalFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    files,
    uploadedFiles,
    userId,
    loadingFiles,
    saving,
    actions: {
      handleSelection,
      handleUpload,
      handleDelete,
      handleRename,
      removeLocalFile,
      refresh: loadFiles,
    },
  };
};
