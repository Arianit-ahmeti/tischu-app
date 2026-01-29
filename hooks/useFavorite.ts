import { useSupabaseSession } from "@hooks/useSupabaseSession";
import { addFavorite, isFavorite, removeFavorite } from "@lib/animalService";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useFavorite = (animalId: string) => {
  const [isFavoriteAnimal, setIsFavorite] = useState(false);
  const { session, isLoading: sessionLoading } = useSupabaseSession();

  async function loadFavoriteStatus() {
    if (session?.user.id) {
      try {
        await isFavorite(animalId, session.user.id)
          .then(setIsFavorite)
          .catch((e) => Alert.alert("Error fetching favorite details"));
      } catch (error) {
        console.error("Error fetching favorite status", error);
      }
    }
  }

  async function changeIcon() {
    if (session?.user.id) {
      try {
        isFavoriteAnimal
          ? removeFavorite(animalId, session.user.id).then(() => setIsFavorite(false))
          : addFavorite(animalId, session.user.id).then(() => setIsFavorite(true));
      } catch (error) {
        console.error("Error changing icon", error);
      }
    }
  }

  useEffect(() => {
    if (!sessionLoading && session?.user.id && animalId) {
      loadFavoriteStatus();
    }
  }, [sessionLoading, session?.user.id, animalId]);
  return { isFavoriteAnimal, changeIcon };
};
