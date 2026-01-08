import { Session } from "@supabase/supabase-js";
import { Organization } from "@types";
import { supabase } from "./supabase";

export async function getProfile(user_id: string): Promise<Organization | null> {
  try {
    const { data, error } = await supabase
      .from("organization")
      .select(`id, name, street, house_number, postal_code, city, country, status`)
      .eq("id", user_id)
      .single();

    if (error) {
      console.log("Error loading profile:", error.message);
      return null;
    }
    if (data) {
      console.log("Profile loaded successfully.");
      return data as Organization;
    }
    return null;
  } catch (e) {
    console.error("Unexpected error in loadProfile:", e);
    return null;
  }
}

export async function getCurrentSession(): Promise<Session | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function updateProfile(user_id: string, updates: Partial<Organization>) {
  try {
    const { data, error } = await supabase.from("organization").update(updates).eq("id", user_id).select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { data: null, error };
  }
}

export async function saveOrganization(organization: Partial<Organization>) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Authentication Error:", authError.message);
    return null;
  }

  if (!user) {
    console.error("Error: No user is currently logged in. Organization signup requires a logged-in user.");
    return null;
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .update({
      type: "organization",
    })
    .eq("id", user.id);

  if (profileError) {
    console.error("Error updating profile type:", profileError.message);
    return { data: null, error: profileError };
  }

  console.log("Profile type updated successfully:", profileData);

  const { data, error } = await supabase
    //TODO replace with "organization" once supabase tables have been updated
    .from("organization")
    .insert({
      id: user.id,
      name: organization.name,
      street: organization.street,
      house_number: organization.house_number,
      postal_code: organization.postal_code,
      city: organization.city,
      country: organization.country,
      status: "unverified",
    })
    .select();

  if (error) {
    console.log("Error saving organization:", error.message);
    return { data: null, error };
  } else {
    console.log("Organization saved successfully:", data);
    return { data, error: null };
  }
}

export async function getCurrentUserId(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  let userId = session?.user?.id;

  if (!userId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id;
  }

  if (!userId) throw new Error("Keine aktive Sitzung gefunden.");
  return userId;
}
