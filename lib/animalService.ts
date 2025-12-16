import { supabase } from "@lib/supabase";
import { Animal, AnimalFilters } from "@types";

export async function addAnimal(animal: Partial<Animal>) {
  const { data, error } = await supabase
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
    .select();

  if (error) {
    console.log("Error adding animal:", error.message);
    return null;
  } else {
    console.log("Animal added successfully:", data);
    return null;
  }
}

export async function fetchAnimalDetails(animalId: string) {
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
    console.error("Fehler beim Löschen des Tiers:", error.message);
    return false;
  }

  return true;
}

export async function updateAnimal(animal: Animal) {
  try {
    const { error } = await supabase.from("animals").update(animal).select().eq("id", animal.id).single();

    if (error) {
      console.error("Supabase Error on updating animal data:", error.message);
      return null;
    }
    return true;
  } catch (err) {
    console.error("Unexpected error in updateAnimal:", err);
    return null;
  }
}
export async function fetchAnimalsForList(filters?: AnimalFilters): Promise<Animal[] | null> {
  try {
    let query = supabase.from("animals").select("*");

    if (filters) {
      if (filters.type) {
        query = (Array.isArray(filters.type))? query.in("type", filters.type) : query.eq("type", filters.type);
        }

      if (filters.sex) {
        query = (Array.isArray(filters.sex))? query.in("sex", filters.sex) : query.eq("sex", filters.sex);
      }
      if (filters.size) {
        query = (Array.isArray(filters.size))? query.in("size", filters.size) : query.eq("size", filters.size);
      }
      if (filters.character) {
        query = (Array.isArray(filters.character))? query.in("character", filters.character) : query.eq("character", filters.character);
      }
      if (filters.status) {
        query = (Array.isArray(filters.status))? query.in("status", filters.status) : query.eq("status", filters.status);
      }

      if (filters.age_min) {
        query = query.gte("age", filters.age_min);
      }
      if (filters.age_max) {
        query = query.lte("age", filters.age_max);
      }
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
