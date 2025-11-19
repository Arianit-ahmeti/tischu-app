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

export async function loadAllAnimals() {
  try {
    const { data: animal, error } = await supabase.from("animals").select("*");

    if (error) {
      console.log("Supabase Error on fetching all animal ids:", error.message);
      return null;
    }
    console.log("Loaded Animal data successfully");

    return animal;
  } catch (error) {
    error instanceof Error
      ? console.log("Error fetching Animal data: ", error.message)
      : console.log("Unexpected Error ocurred:", error);
    return null;
  }
}

export async function fetchAnimalDetails(animalId: string) {
  try {
    const { data: animal, error } = await supabase
      .from("animals")
      .select("*")
      .eq("id", animalId)
      .single();

    if (error) {
      console.error(
        `Supabase Error on fetching animal details for ${animalId}:`,
        error.message
      );
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
export async function fetchFilteredAnimals(filters: AnimalFilters): Promise<Animal[] | null> {
    try {
      let query = supabase.from("animals").select("*");

      if (filters.type) {
        if (Array.isArray(filters.type)) {
          query = query.in('type', filters.type)
        }
        else {
          query = query.eq('type', filters.type);
        }
      }
      if (filters.sex) {
            query = query.eq('sex', filters.sex);
      }
      if (filters.size) {
        if (Array.isArray(filters.size)) {
          query = query.in('size', filters.size)
        }
        else {
          query = query.eq('size', filters.size);
        }
      }
      if (filters.character) {
        if (Array.isArray(filters.character)) {
          query = query.in('character', filters.character)
        }
        else {
          query = query.eq('character', filters.character);
        }
      }
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status)
        }
        else {
          query = query.eq('status', filters.status);
        }
      }

      if (filters.age_min) {
        query = query.gte('age', filters.age_min);
      }
      if (filters.age_max) {
        query = query.lte('age', filters.age_max);
      }

    const { data: animals, error } = await query;

    if (error) {
            console.error("Supabase Error on fetching filtered animals:", error.message);
            return null;
    }

    return animals as Animal[];

    } catch (error) {
        console.error("Unexpected error in fetchFilteredAnimals:", error);
        return null;
    }
}
