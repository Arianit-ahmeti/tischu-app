import { supabase } from "./supabase";
import { parsePostgresArray } from "./utils/postgresArrayHelper";

export async function getAnimalTypesEnum(): Promise<string[]> {
  return enumHelper("get_animal_type_enum");
}

export async function getSexesEnum(): Promise<string[]> {
  return enumHelper("get_sex_enum");
}

export async function getCharacterTypesEnum(): Promise<string[]> {
  return enumHelper("get_character_type_enum");
}

export function getAdoptionStatusesEnum(): Promise<string[]> {
  return enumHelper("get_adoption_status_enum");
}

export function getAnimalSizesEnum(): Promise<string[]> {
  return enumHelper("get_animal_size_enum");
}

export function getVerificationStatusesEnum(): Promise<string[]> {
  return enumHelper("get_verification_status_enum");
}

async function enumHelper(rpcFunctionName: string): Promise<string[]> {
  const { data, error } = await supabase.rpc(rpcFunctionName);

  if (error) {
    throw error;
  }

  if (data) {
    if (typeof data === "string") {
      return parsePostgresArray(data);
    }
  }

  return [];
}
