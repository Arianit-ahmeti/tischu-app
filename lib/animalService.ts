

import { supabase } from './supabase';
import { Animal } from './types';

async function handleAddAnimal(animal: Animal) {
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
    } else {
        console.log("Animal added successfully:", data);
    }
}

export async function loadAllAnimals() {
    try {
        const { data: animal, error } = await supabase
            .from('animals')
            .select('*')


        console.log("Loaded Animal data successfully");

        return animal

    } catch (error) {
        (error instanceof Error ? console.log("Error fetching Animal data: ", error.message) : "Unexpected Error ocurred");
        return null
    }
}

export async function fetchAnimalDetails(animalId: string) {
    try {
        const { data: animal, error } = await supabase
            .from('animals')
            .select('*')
            .eq('id', animalId)
            .single();

        if (error) {
            console.error('Supabase Error beim Abrufen der Tierdetails:', error.message);
            return null;
        }

        if (!animal) {
            console.warn(`Tier mit ID ${animalId} nicht gefunden.`);
            return null;
        }

        return animal;

    } catch (err) {
        console.error('Unerwarteter Fehler in fetchAnimalDetails:', err);
        return null;
    }
}

export async function updateAnimal(animalId: string, updates: any) {
    try {
        const { data: animal, error } = await supabase
            .from('animals')
            .update(updates)
            .select()
            .eq('id', animalId)
            .single();

        if (error) {
            console.error('Supabase Error beim Aktualisieren des Tiers:', error.message);
            return null;
        }
        return animal;

    } catch (err) {
        console.error('Unerwarteter Fehler im updateAnimal:', err);
        return null;
    }
}
