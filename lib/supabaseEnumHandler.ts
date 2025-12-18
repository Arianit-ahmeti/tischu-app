import { supabase } from "./supabase";
import { parsePostgresArray } from "./utils/postgresArrayHelper";

export type EnumObject<T extends string> = {
  readonly [K in T]: K;
} & { readonly values: readonly T[] };

export async function getAnimalTypesEnum() {
  const values = await enumHelper("get_animal_type_enum");
  return createEnumObject(values);
}

export async function getSexesEnum() {
  const values = await enumHelper("get_sex_enum");
  return createEnumObject(values);
}

export async function getCharacterTypesEnum() {
  const values = await enumHelper("get_character_type_enum");
  return createEnumObject(values);
}

export async function getAdoptionStatusesEnum() {
  const values = await enumHelper("get_adoption_status_enum");
  return createEnumObject(values);
}

export async function getAnimalSizesEnum() {
  const values = await enumHelper("get_animal_size_enum");
  return createEnumObject(values);
}

export async function getVerificationStatusesEnum() {
  const values = await enumHelper("get_verification_status_enum");
  return createEnumObject(values);
}

function createEnumObject<T extends string>(values: T[]): EnumObject<T> {
  const enumObj = values.reduce(
    (acc, value) => {
      acc[value as T] = value;
      return acc;
    },
    {} as Record<T, T>
  );

  return Object.freeze({
    ...enumObj,
    values: Object.freeze(values),
  }) as EnumObject<T>;
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
