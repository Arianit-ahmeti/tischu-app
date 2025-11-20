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

export async function getAnimalMediaDownloadURls(animalId: string): Promise<string[]> {
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

export async function uploadAnimalMedia(animalId: string): Promise<string> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsMultipleSelection: false,
    allowsEditing: true,
    quality: 1,
    exif: false,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    throw new Error("User cancelled image picker.");
  }

  const image = result.assets[0];

  if (!image.uri) {
    throw new Error("No image uri!");
  }

  const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());

  const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
  const path = `${animalId}/${Date.now()}.${fileExt}`;
  const { data, error: uploadError } = await supabase.storage.from("animal-entry-media").upload(path, arraybuffer, {
    contentType: image.mimeType ?? "image/jpeg",
  });

  if (uploadError) {
    throw uploadError;
  }

  return data.path;
}
