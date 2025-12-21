import { supabase } from "@lib/supabase";
import { FileResponse } from "@types";
import * as ImagePicker from "expo-image-picker";

async function listAnimalMedia(animalId: string): Promise<FileResponse> {
  const { data, error } = await supabase.storage.from("animal-entry-media").list(animalId);

  return {
    data: data || [],
    error: error?.message || null,
  };
}

export async function getAnimalMediaDownloadURLs(animalId: string): Promise<string[]> {
  const fileResponse = await listAnimalMedia(animalId);
  if (fileResponse.error) {
    throw new Error(fileResponse.error);
  }

  const downloadUrls: string[] = [];
  for (const file of fileResponse.data) {
    const { data } = supabase.storage.from("animal-entry-media").getPublicUrl(`${animalId}/${file.name}`);

    if (data?.publicUrl) {
      downloadUrls.push(data.publicUrl);
    }
  }

  return downloadUrls;
}

interface SelectImagesOptions {
  allowMultiple?: boolean;
  allowEditing?: boolean;
}

export async function selectImages(options: SelectImagesOptions = {}): Promise<string[]> {
  const { allowMultiple = true, allowEditing = false } = options;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsMultipleSelection: allowMultiple,
    allowsEditing: allowEditing,
    quality: 1,
    exif: false,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return [];
  }

  return result.assets.map((asset) => asset.uri);
}

export async function uploadLocalImages(animalId: string, localImageUris: string[]): Promise<void> {
  if (localImageUris.length === 0) return;

  for (let index = 0; index < localImageUris.length; index++) {
    const uri = localImageUris[index];
    const arraybuffer = await fetch(uri).then((res) => res.arrayBuffer());
    const fileExt = uri.split(".").pop()?.toLowerCase() ?? "jpeg";
    const path = `${animalId}/${index}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from("animal-entry-media").upload(path, arraybuffer, {
      contentType: `image/${fileExt}`,
    });

    if (error) {
      throw Error("Error uploading image:", error);
    }
  }
}
