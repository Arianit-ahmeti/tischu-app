import { Session } from "@supabase/supabase-js";
import { Organization } from "@types";
import { supabase } from "./supabase";

export async function getProfile(user_id: string): Promise<Organization | null> {
  try {
    const { data, error } = await supabase
      .from("organization")
      .select(`name, street, house_number, postal_code, city, country, status`)
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
