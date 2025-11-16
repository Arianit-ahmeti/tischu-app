

import { supabase } from './supabase'; 

export async function fetchAnimalDetails(animalId: string) {
  try {
    const { data: animal, error } = await supabase
      .from('animals')    
      .select(`
        id, created_at, name, origin, type, sex, size, character, status, age 
      `)
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
    console.error('Unerwarteter Fehler im fetchAnimalDetails:', err);
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
