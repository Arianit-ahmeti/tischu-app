import { getAdoptionStatusesEnum, getAnimalSizesEnum, getAnimalTypesEnum, getCharacterTypesEnum, getSexesEnum } from "@lib/supabaseEnumHandler";
import { useEnum } from './useEnum';

export function useAnimalFieldEnums() {
  const { enumObj: animalTypes, loading: animalTypesLoading, error: animalTypesError } = useEnum(getAnimalTypesEnum);
  const { enumObj: animalSizes, loading: animalSizesLoading, error: animalSizesError } = useEnum(getAnimalSizesEnum);
  const { enumObj: sexes, loading: sexesLoading, error: sexesError } = useEnum(getSexesEnum);
  const {
    enumObj: characterTypes,
    loading: characterTypesLoading,
    error: characterTypesError,
  } = useEnum(getCharacterTypesEnum);
  const {
    enumObj: adoptionStatuses,
    loading: adoptionStatusesLoading,
    error: adoptionStatusesError,
  } = useEnum(getAdoptionStatusesEnum);

  const enumsAreLoading =
    animalTypesLoading ||
    animalSizesLoading ||
    sexesLoading ||
    characterTypesLoading ||
    adoptionStatusesLoading;

  const enumsError =
    animalTypesError ||
    animalSizesError ||
    sexesError ||
    characterTypesError ||
    adoptionStatusesError;

  const enums = {
    animalTypes,
    animalSizes,
    sexes,
    characterTypes,
    adoptionStatuses,
  };

  return {
    enums,
    enumsAreLoading,
    enumsError,
  };
}
