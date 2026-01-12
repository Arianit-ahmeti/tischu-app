import { supabase } from "@lib/supabase";
import { Animal, AnimalFilters } from "@types";

export async function addAnimal(animal: Partial<Animal>): Promise<Animal> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !sessionData.session?.user) {
    throw new Error(`Authentication error: ${sessionError?.message || "No active session"}`);
  }

  const { data: animalData, error: animalError } = await supabase
    .from("animals")
    .insert({
      name: animal.name,
      age: animal.age,
      origin: animal.origin,
      type: animal.type,
      size: animal.size,
      sex: animal.sex,
      character: animal.character,
      status: "open",
    })
    .select()
    .single<Animal>();

  if (animalError) {
    throw animalError;
  }

  if (!animalData) {
    throw new Error("No animal data returned after insert");
  }

  const { error: joinError } = await supabase.from("organization_animals").insert({
    organization_id: sessionData.session.user.id,
    animal_id: animalData.id,
  });

  if (joinError) {
    throw joinError;
  }

  return animalData;
}

export async function fetchAnimalDetails(animalId: string): Promise<Animal | null> {
  try {
    const { data: animal, error } = await supabase.from("animals").select("*").eq("id", animalId).single();

    if (error) {
      console.error(`Supabase Error on fetching animal details for ${animalId}:`, error.message);
      return null;
    }

    if (!animal) {
      console.warn(`Animal with id ${animalId} not found.`);
      return null;
    }

    return animal;
  } catch (err) {
    console.error("Unexpected error on fetchAnimalDetails:", err);
    return null;
  }
}

export async function deleteAnimal(animalId: string) {
  const { error } = await supabase.from("animals").delete().eq("id", animalId);

  if (error) {
    console.error("Error deleting animal:", error.message);
    return false;
  }

  return true;
}

export async function updateAnimal(animal: Partial<Animal>) {
  const { error } = await supabase.from("animals").update(animal).select().eq("id", animal.id).single();

  if (error) {
    throw error;
  }
}

export async function fetchAnimalsForList(filters?: AnimalFilters): Promise<Animal[] | null> {
  try {
    let query = supabase.from("animals").select("*");

    if (filters) {
      if (filters.type) query = query.in("type", filters.type);

      if (filters.sex) query = query.in("sex", filters.sex);

      if (filters.size) query = query.in("size", filters.size);

      if (filters.character) query = query.in("character", filters.character);

      if (filters.status) query = query.in("status", filters.status);

      if (filters.age_min) query = query.gte("age", filters.age_min);

      if (filters.age_max) query = query.lte("age", filters.age_max);
    }

    const { data: animals, error } = await query;

    if (error) {
      console.error("Supabase Error on fetching filtered animals:", error.message);
      return null;
    }

    return animals as Animal[];
  } catch (error) {
    console.error("Unexpected error in fetching filtered animals:", error);
    return null;
  }
}

export async function fetchOrganizationAnimals(organizationId: string): Promise<Animal[]> {
  const { data: organizationAnimals, error: joinError } = await supabase
    .from("organization_animals")
    .select("animal_id")
    .eq("organization_id", organizationId);

  if (joinError) {
    throw joinError;
  }

  if (!organizationAnimals || organizationAnimals.length === 0) {
    return [];
  }

  const animalIds = organizationAnimals.map((oa) => oa.animal_id);

  const { data: animalsData, error: animalError } = await supabase
    .from("animals")
    .select("*")
    .in("id", animalIds)
    .overrideTypes<Animal[]>();

  if (animalError) {
    throw animalError;
  }

  return animalsData;
}

export async function addFavorite(animalID: string, userID: string) {
  const { error } = await supabase.from("favorites").insert({ user_id: userID, animal_id: animalID });

  if (error) {
    throw error;
  }
}

export async function isFavorite(animalID: string, userID: string): Promise<boolean> {
  const { data, error } = await supabase.from("favorites").select().eq("user_id", userID).eq("animal_id", animalID);

  if (error) {
    throw error;
  }

  if (data && data.length > 0) return true;

  return false;
}

export async function removeFavorite(animalID: string, userID: string) {
  const { error } = await supabase.from("favorites").delete().match({ user_id: userID, animal_id: animalID });

  if (error) {
    throw error;
  }
}

export async function fetchUserFavorites(userID: string): Promise<Animal[]> {
  const { data, error } = await supabase.from("favorites").select("animals(*)").eq("user_id", userID);

  if (error) throw error;
  return data?.map((f: any) => f.animals).filter(Boolean) || [];
}
