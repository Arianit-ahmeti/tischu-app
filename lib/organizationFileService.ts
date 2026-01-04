import { supabase } from "@lib/supabase";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

export interface SelectedFile {
  uri: string;
  name: string;
  type: string;
}

export async function pickImage(): Promise<SelectedFile[]> {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsMultipleSelection: true,
    quality: 1,
  });

  if (result.canceled || !result.assets) return [];

  return result.assets.map((asset) => ({
    uri: asset.uri,
    name: asset.fileName ?? `upload-${Date.now()}.jpg`,
    type: asset.mimeType ?? "image/jpeg",
  }));
}

export async function pickDocument(): Promise<SelectedFile[]> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ["image/*", "application/pdf"],
    multiple: true,
  });

  if (result.canceled || !result.assets) return [];

  return result.assets.map((asset) => ({
    uri: asset.uri,
    name: asset.name,
    type: asset.mimeType ?? "application/octet-stream",
  }));
}

export async function pickCameraImage(): Promise<SelectedFile[]> {
  await ImagePicker.requestCameraPermissionsAsync();
  const result = await ImagePicker.launchCameraAsync({
    cameraType: ImagePicker.CameraType.back,
    allowsEditing: false,
    quality: 1,
  });

  if (result.canceled || !result.assets) return [];
  return result.assets.map((asset) => {
    const fileExtension = asset.uri.split(".").pop() || "jpg";
    return {
      uri: asset.uri,
      name: `cam-${Date.now()}.${fileExtension}`,
      type: asset.mimeType ?? `image/${fileExtension}`,
    };
  });
}

export async function uploadOrganizationFiles(
  userId: string,
  files: SelectedFile[],
  existingFiles: any[]
): Promise<void> {
  if (files.length === 0) return;
  let currentNames = existingFiles.map((f) => f.name);

  for (let index = 0; index < files.length; index++) {
    const file = files[index];

    try {
      const arraybuffer = await fetch(file.uri).then((res) => res.arrayBuffer());
      const fileName = file.name || `file-${index}`;
      const finalName = getNextAvailableName(fileName, currentNames);
      currentNames.push(finalName);
      const fileExt = finalName.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${userId}/${finalName}`;
      const contentType =
        file.type || (fileExt === "pdf" ? "application/pdf" : `image/${fileExt === "jpg" ? "jpeg" : fileExt}`);

      const { error } = await supabase.storage.from("organization-verification").upload(path, arraybuffer, {
        contentType: contentType,
        upsert: true,
      });

      if (error) throw error;
    } catch (error) {
      console.error(`File upload failed at index ${index}:`, error);
      throw error;
    }
  }
}

export async function getFilesFromPicker(index: number): Promise<SelectedFile[]> {
  switch (index) {
    case 0:
      return await pickImage();
    case 1:
      return await pickDocument();
    case 2:
      return await pickCameraImage();
    default:
      return [];
  }
}

export async function getOrganizationFiles(orgId: string) {
  const { data, error } = await supabase.storage.from("organization-verification").list(orgId);
  if (error) {
    console.error("Error fetching files", error);
    throw error;
  }
  return (data || []).filter((file) => file.name !== ".emptyFolderPlaceholder");
}

export const getFilePreviewUrl = (userId: string, fileName: string) => {
  const { data } = supabase.storage.from("organization-verification").getPublicUrl(`${userId}/${fileName}`);

  if (!data?.publicUrl) return null;
  const baseUrl = data.publicUrl.substring(0, data.publicUrl.lastIndexOf("/") + 1);
  return `${baseUrl}${encodeURIComponent(fileName)}`;
};

export async function deleteOrganizationFile(userId: string, fileName: string) {
  const { data, error } = await supabase.storage.from("organization-verification").remove([`${userId}/${fileName}`]);
  if (error) throw error;
  return data;
}

export async function renameOrganizationFile(userId: string, oldName: string, newName: string, existingFiles: any[]) {
  const dotIndex = oldName.lastIndexOf(".");
  const extension = dotIndex !== -1 ? oldName.substring(dotIndex) : "";
  const desiredName = `${newName.trim()}${extension}`;
  const existingNames = existingFiles.map((f) => f.name).filter((name) => name !== oldName);
  const finalName = getNextAvailableName(desiredName, existingNames);
  if (finalName === oldName) return oldName;
  const { error } = await supabase.storage
    .from("organization-verification")
    .move(`${userId}/${oldName}`, `${userId}/${finalName}`);

  if (error) throw error;
  return finalName;
}

export const formatFileNameWithExtension = (oldName: string, newName: string): string => {
  const extension = oldName.substring(oldName.lastIndexOf("."));
  return `${newName.trim()}${extension}`;
};

export const getNextAvailableName = (newName: string, existingNames: string[]) => {
  let cleanName = newName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._() -]/g, "");

  if (!existingNames.includes(cleanName)) return cleanName;

  const dotIndex = cleanName.lastIndexOf(".");
  const baseName = dotIndex !== -1 ? cleanName.substring(0, dotIndex) : cleanName;
  const extension = dotIndex !== -1 ? cleanName.substring(dotIndex) : "";

  let counter = 1;
  let finalName = `${baseName}(${counter})${extension}`;

  while (existingNames.includes(finalName)) {
    counter++;
    finalName = `${baseName}(${counter})${extension}`;
  }
  return finalName;
};
