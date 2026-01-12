import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "./constants/messages";
import { supabase } from "./supabase";
import { AdoptionContact, UserContact, UserSituation } from "./types";

export async function checkForForm(userId: string, animalId: string): Promise<boolean | null> {
  try {
    const { data, error } = await supabase
      .from("adoption_contact")
      .select("*")
      .eq("user_id", userId)
      .eq("animal_id", animalId);

    if (error) {
      console.error(ERROR_MESSAGES.USER_CONTACT_SAVE_FAILED, error.message);
      return null;
    } else {
      return data.length > 0;
    }
  } catch (error) {
    console.error(ERROR_MESSAGES.USER_CONTACT_SAVE_FAILED, error);
    return null;
  }
}

export async function saveUserContacts(contacts: UserContact) {
  try {
    const { data, error } = await supabase.from("user_contact").insert(contacts).select().single();

    if (error) {
      console.error(ERROR_MESSAGES.USER_CONTACT_SAVE_FAILED, error.message);
      return null;
    } else {
      console.log(SUCCESS_MESSAGES.USER_CONTACT_SAVED);
      return data;
    }
  } catch (error) {
    console.error(ERROR_MESSAGES.USER_CONTACT_SAVE_FAILED, error);
    return null;
  }
}

export async function saveUserSituation(situation: Partial<UserSituation>) {
  try {
    const { data, error } = await supabase.from("user_adoption_situation").insert(situation).select().single();

    if (error) {
      console.error(ERROR_MESSAGES.USER_SITUATION_SAVE_FAILED, error.message);
      return null;
    } else {
      console.log(SUCCESS_MESSAGES.USER_SITUATION_SAVED);
      return data;
    }
  } catch (error) {
    console.error(ERROR_MESSAGES.USER_SITUATION_SAVE_FAILED, error);
    return null;
  }
}

export async function loadUserContacts(userId: string) {
  try {
    const { data, error } = await supabase.from("user_contact").select("*").eq("user_id", userId).single();

    if (error) {
      console.error(ERROR_MESSAGES.USER_CONTACT_LOAD_FAILED, error.message);
      return null;
    } else {
      return data as UserContact;
    }
  } catch (error) {
    console.error(ERROR_MESSAGES.USER_CONTACT_LOAD_FAILED, error);
    return null;
  }
}

export async function loadUserSituation(formId: string) {
  try {
    const { data, error } = await supabase.from("user_adoption_situation").select("*").eq("form_id", formId).single();

    if (error) {
      console.error(ERROR_MESSAGES.USER_SITUATION_LOAD_FAILED, error.message);
      return null;
    } else {
      return data as UserSituation;
    }
  } catch (error) {
    console.error(ERROR_MESSAGES.USER_SITUATION_LOAD_FAILED, error);
    return null;
  }
}

export async function updateUserContacts(contacts: UserContact) {
  try {
    const { data, error } = await supabase
      .from("user_contact")
      .update(contacts)
      .select()
      .eq("user_id", contacts.user_id)
      .single();
    if (error) {
      console.error(ERROR_MESSAGES.USER_CONTACT_UPDATE_FAILED, error.message);
      return null;
    } else {
      console.log(SUCCESS_MESSAGES.USER_CONTACT_UPDATED);
      return data;
    }
  } catch (error) {
    console.error(ERROR_MESSAGES.USER_CONTACT_UPDATE_FAILED, error);
    return null;
  }
}

export async function saveAdoptionContact(userId: string, formId: string, animalId: string) {
  try {
    const { data, error } = await supabase
      .from("adoption_contact")
      .insert({
        user_id: userId,
        form_id: formId,
        animal_id: animalId,
      })
      .select()
      .single();

    if (error) {
      console.error(ERROR_MESSAGES.ADOPTION_CONTACT_SAVE_FAILED, error.message);
      return null;
    } else {
      console.log(SUCCESS_MESSAGES.ADOPTION_CONTACT_SAVED);
      return data;
    }
  } catch (error) {
    console.error(ERROR_MESSAGES.ADOPTION_CONTACT_SAVE_FAILED, error);
    return null;
  }
}

export async function fetchAdoptionContactsForList(): Promise<AdoptionContact[] | null> {
  try {

    let query = supabase.from("adoption_contact").select();

    const { data: adoptionContacts, error } = await query;

    if (error) {
      console.error(ERROR_MESSAGES.ADOPTION_CONTACT_LOAD_ALL_FAILED, error.message);
      return null;
    }
    return adoptionContacts as AdoptionContact[];

  } catch (error) {
    console.error(ERROR_MESSAGES.ADOPTION_CONTACT_LOAD_ALL_FAILED, error);
    return null;
  }
}

export async function adoptionRead(userId: string, animalId: string) {
  try {
    let date = new Date();
    const { error } = await supabase
      .from("adoption_contact")
      .update({
        read_at:
          date.toDateString()
      })
      .eq("user_id", userId)
      .eq("animal_id", animalId).single()
    if (error) throw Error(ERROR_MESSAGES.ADOPTION_CONTACT_SET_READ_FAILED)
    return true;
  } catch (error) {
    console.error(ERROR_MESSAGES.ADOPTION_CONTACT_SET_READ_FAILED, error)
    return false;
  }
}

export async function deleteAdoptionContact(userId: string, animalId: string) {
  try {
    const { error } = await supabase.from("adoption_contact").delete().eq("animal_id", animalId).eq("user_id", userId);

    if (error) {
      console.error(ERROR_MESSAGES.ADOPTION_CONTACT_DELETE_FAILED, error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error(ERROR_MESSAGES.ADOPTION_CONTACT_DELETE_FAILED, error)
    return false;
  }
}
