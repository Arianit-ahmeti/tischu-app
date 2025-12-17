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

export async function checkOrganizationAccess(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("organization").select("id").eq("id", userId);
    if (error) {
      console.error("Error checking organization status:", error.message);
      return false;
    }
    return data !== null && data.length > 0;
  } catch (error) {
    console.error("Unexpected error in checkOrganizationAccess:", error);
    return false;
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
