import { ERROR_MESSAGES } from "@lib/constants/messages";
import { addFavorite, isFavorite, removeFavorite } from "@lib/services/animalService";
import { Alert } from "react-native";

export const favoriteService = {
  async getFavoriteStatus(animalId: string, userId: string): Promise<boolean> {
    try {
      return await isFavorite(animalId, userId);
    } catch (error) {
      Alert.alert(ERROR_MESSAGES.ANIMAL_LOAD_FAILED);
      console.error("Error fetching favorite status", error);
      throw error;
    }
  },

  async toggleFavorite(animalId: string, userId: string, currentIsFavorite: boolean): Promise<boolean> {
    try {
      if (currentIsFavorite) {
        await removeFavorite(animalId, userId);
        return false;
      } else {
        await addFavorite(animalId, userId);
        return true;
      }
    } catch (error) {
      console.error("Error toggling favorite status", error);
      throw error;
    }
  },

  async addToFavorites(animalId: string, userId: string): Promise<void> {
    try {
      await addFavorite(animalId, userId);
    } catch (error) {
      console.error("Error adding favorite", error);
      throw error;
    }
  },

  async removeFromFavorites(animalId: string, userId: string): Promise<void> {
    try {
      await removeFavorite(animalId, userId);
    } catch (error) {
      console.error("Error removing favorite", error);
      throw error;
    }
  },
};
