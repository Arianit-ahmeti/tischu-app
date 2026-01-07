import { useEnum } from "@hooks/useEnum";
import {
  getGardenSizeEnum,
  getLandlordApprovalEnum,
  getPetExperienceEnum
} from "@lib/supabaseEnumHandler";

export function useUserSituationEnums() {
  const { enumObj: gardenSizes, loading: gardenSizesLoading, error: gardenSizesError } = useEnum(getGardenSizeEnum);
  const { enumObj: landlordApproval, loading: landlordApprovalLoading, error: landlordApprovalError } = useEnum(getLandlordApprovalEnum);
  const { enumObj: petExperience, loading: petExperienceLoading, error: petExperienceError } = useEnum(getPetExperienceEnum);


  const enumsAreLoading =
    gardenSizesLoading || landlordApprovalLoading || petExperienceLoading;

  const enumsError = gardenSizesError || landlordApprovalError || petExperienceError;

  const enums = {
    gardenSizes,
    landlordApproval,
    petExperience,
  };

  return {
    enums,
    enumsAreLoading,
    enumsError,
  };
}
