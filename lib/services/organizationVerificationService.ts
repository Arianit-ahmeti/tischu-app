import { supabase } from "@lib/supabase";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

const STORAGE_BUCKET = "organization-verification";

export interface SelectedFile {
  uri: string;
  name: string;
  type: string;
}

export interface UploadedFile {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  metadata?: Record<string, any>;
}

function getFileExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex !== -1 ? fileName.substring(dotIndex) : "";
}

function getNextAvailableName(desiredName: string, existingNames: string[]): string {
  const cleanName = desiredName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._() -]/g, "");
  if (!existingNames.includes(cleanName)) return cleanName;

  const extension = getFileExtension(cleanName);
  const baseName = extension ? cleanName.substring(0, cleanName.lastIndexOf(".")) : cleanName;

  let counter = 1;
  let finalName = `${baseName}(${counter})${extension}`;
  while (existingNames.includes(finalName)) {
    counter++;
    finalName = `${baseName}(${counter})${extension}`;
  }
  return finalName;
}

function getContentType(fileExtension: string, fileType?: string): string {
  if (fileType) return fileType;

  const ext = fileExtension.toLowerCase();
  const typeMap: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  };

  return typeMap[ext] || "application/octet-stream";
}

function mapAssets<T extends { uri: string; mimeType?: string | null }>(
  assets: T[],
  getName: (asset: T) => string
): SelectedFile[] {
  return assets.map((asset) => ({
    uri: asset.uri,
    name: getName(asset),
    type: asset.mimeType ?? "application/octet-stream",
  }));
}

async function pickImage(): Promise<SelectedFile[]> {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsMultipleSelection: true,
    quality: 1,
  });
  if (result.canceled || !result.assets) return [];
  return mapAssets(result.assets, (asset) => asset.fileName ?? `upload-${Date.now()}.jpg`);
}

async function pickDocument(): Promise<SelectedFile[]> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ["image/*", "application/pdf"],
    multiple: true,
  });
  if (result.canceled || !result.assets) return [];
  return mapAssets(result.assets, (asset) => asset.name);
}

async function pickCameraImage(): Promise<SelectedFile[]> {
  await ImagePicker.requestCameraPermissionsAsync();
  const result = await ImagePicker.launchCameraAsync({
    cameraType: ImagePicker.CameraType.back,
    allowsEditing: false,
    quality: 1,
  });
  if (result.canceled || !result.assets) return [];
  return mapAssets(result.assets, (asset) => {
    const ext = asset.uri.split(".").pop() || "jpg";
    return `cam-${Date.now()}.${ext}`;
  });
}

const pickers = [pickImage, pickDocument, pickCameraImage];

function prepareRename(oldName: string, newName: string, excludeNames: string[] = []): string {
  const extension = getFileExtension(oldName);
  const desiredName = `${newName.trim()}${extension}`;
  return getNextAvailableName(desiredName, excludeNames);
}

export const organizationVerificationService = {
  async loadFiles(userId: string): Promise<UploadedFile[]> {
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).list(userId);
    if (error) throw error;
    return (data || []).filter((file) => file.name !== ".emptyFolderPlaceholder");
  },

  async selectFiles(
    index: number,
    currentFiles: SelectedFile[],
    uploadedFiles: UploadedFile[]
  ): Promise<SelectedFile[]> {
    const picker = pickers[index];
    if (!picker) return currentFiles;

    const newFiles = await picker();
    const allNames = [...currentFiles.map((f) => f.name), ...uploadedFiles.map((f) => f.name)];
    const processedFiles = newFiles.map((file) => ({
      ...file,
      name: getNextAvailableName(file.name, allNames),
    }));

    return [...currentFiles, ...processedFiles];
  },

  async uploadFiles(userId: string, files: SelectedFile[], uploadedFiles: UploadedFile[]): Promise<void> {
    if (files.length === 0) return;

    const currentNames = uploadedFiles.map((f) => f.name);

    for (const [index, file] of files.entries()) {
      const arraybuffer = await fetch(file.uri).then((res) => res.arrayBuffer());
      const fileName = file.name || `file-${index}`;
      const finalName = getNextAvailableName(fileName, currentNames);
      currentNames.push(finalName);

      const fileExt = getFileExtension(finalName).replace(".", "") || "jpg";
      const contentType = getContentType(fileExt, file.type);

      const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(`${userId}/${finalName}`, arraybuffer, {
        contentType,
        upsert: true,
      });

      if (error) throw new Error(`Upload failed for "${fileName}": ${error.message}`);
    }
  },

  async deleteFile(userId: string, fileName: string): Promise<void> {
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([`${userId}/${fileName}`]);
    if (error) throw error;
  },

  async renameFile(
    userId: string,
    oldName: string,
    newName: string,
    currentFiles: SelectedFile[],
    uploadedFiles: UploadedFile[]
  ): Promise<{ updatedFiles?: SelectedFile[]; isLocal: boolean }> {
    const localIndex = currentFiles.findIndex((f) => f.name === oldName);

    if (localIndex !== -1) {
      const otherNames = [
        ...currentFiles.filter((_, i) => i !== localIndex).map((f) => f.name),
        ...uploadedFiles.map((f) => f.name),
      ];
      const finalName = prepareRename(oldName, newName, otherNames);
      const updatedFiles = currentFiles.map((f, i) => (i === localIndex ? { ...f, name: finalName } : f));
      return { updatedFiles, isLocal: true };
    }

    const existingNames = uploadedFiles.map((f) => f.name).filter((name) => name !== oldName);
    const finalName = prepareRename(oldName, newName, existingNames);

    if (finalName !== oldName) {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .move(`${userId}/${oldName}`, `${userId}/${finalName}`);
      if (error) throw error;
    }

    return { isLocal: false };
  },

  removeLocalFile(index: number, files: SelectedFile[]): SelectedFile[] {
    return files.filter((_, i) => i !== index);
  },

  getFilePreviewUrl(userId: string, fileName: string): string | null {
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(`${userId}/${fileName}`);
    if (!data?.publicUrl) return null;

    const baseUrl = data.publicUrl.substring(0, data.publicUrl.lastIndexOf("/") + 1);
    return `${baseUrl}${encodeURIComponent(fileName)}`;
  },
};
