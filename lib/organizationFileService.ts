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

export async function uploadOrganizationFiles(userId: string, files: SelectedFile[]): Promise<void> {
  if (files.length === 0) return;

  for (let index = 0; index < files.length; index++) {
    const file = files[index];

    try {
      const arraybuffer = await fetch(file.uri).then((res) => res.arrayBuffer());
      const fileName = file.name || file.uri.split("/").pop() || "file";
      const fileExt = fileName.split(".").pop()?.toLowerCase() ?? "jpg";

      const path = `${userId}/${Date.now()}-${index}.${fileExt}`;
      const contentType = fileExt === "pdf" ? "application/pdf" : `image/${fileExt}`;

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
