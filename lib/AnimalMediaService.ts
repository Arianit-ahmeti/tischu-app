import { supabase } from "./supabase";
import { FileResponse } from "./types";

async function listAnimalMedia(animalId: string): Promise<FileResponse> {
  const { data, error } = await supabase.storage
    .from("animal-entry-media")
    .list(animalId);

  return {
    data: data || [],
    error: error?.message || null,
  };
}

export async function getAnimalMediaDownloadURls(
  animalId: string
): Promise<string[]> {
  const fileResponse = await listAnimalMedia(animalId);
  if (fileResponse.error) {
    throw new Error(fileResponse.error);
  }

  const downloadUrls: string[] = [];
  for (const file of fileResponse.data) {
    const { data } = supabase.storage
      .from("animal-entry-media")
      .getPublicUrl(`${animalId}/${file.name}`);

    if (data?.publicUrl) {
      downloadUrls.push(data.publicUrl);
    }
  }

  return downloadUrls;
}
