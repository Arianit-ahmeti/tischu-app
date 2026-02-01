import { useSupabaseSession } from "@hooks/useSupabaseSession";
import { getAnimalMediaDownloadURLs } from "@lib/services/animalMediaService";
import { favoriteService } from "@lib/services/favoriteService";
import { Animal } from "@lib/types";
import { theme } from "@theme";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from "react-native";
import { IconButton } from "../ui/IconButton";
import { ThemedText } from "../ui/ThemedText";

type AnimalCardType = "grid" | "list";

interface AnimalCardProps {
  animal: Animal;
  previewImage?: string;
  onFavoriteChange?: () => void;
  variant?: AnimalCardType;
}

export const AnimalCard: React.FC<AnimalCardProps> = ({ animal, variant = "grid", ...props }) => {
  const router = useRouter();
  const { session, isLoading: sessionLoading } = useSupabaseSession();

  const [images, setImages] = useState<string[]>();
  const [imagesLoading, setImagesLoading] = useState(true);
  const [isFavoriteAnimal, setIsFavorite] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchImages() {
      setImagesLoading(true);
      try {
        const urls = await getAnimalMediaDownloadURLs(animal.id);
        if (mounted) setImages(urls);
      } catch (error) {
        console.error("Failed to fetch animal images:", error);
      } finally {
        if (mounted) setImagesLoading(false);
      }
    }

    fetchImages();

    return () => {
      mounted = false;
    };
  }, [animal.id]);

  useEffect(() => {
    if (!sessionLoading && session?.user.id) {
      loadFavoriteStatus();
    }
  }, [sessionLoading, session?.user.id, animal.id]);

  async function loadFavoriteStatus() {
    if (session?.user.id) {
      try {
        const status = await favoriteService.getFavoriteStatus(animal.id, session.user.id);
        setIsFavorite(status);
      } catch (error) {
        console.error("Error loading favorite status", error);
      }
    }
  }

  const handleFavoritePress = async () => {
    if (session?.user.id) {
      try {
        const newStatus = await favoriteService.toggleFavorite(animal.id, session.user.id, isFavoriteAnimal);
        setIsFavorite(newStatus);
        if (props.onFavoriteChange) {
          props.onFavoriteChange();
        }
      } catch (error) {
        console.error("Error toggling favorite", error);
      }
    }
  };

  function CardImg() {
    if (imagesLoading) {
      return (
        <View style={[styles.noImage, variant === "list" && styles.listNoImage]}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : undefined;

    if (typeof firstImage === "string" && firstImage.trim().length > 0) {
      return (
        <Image
          source={{
            uri: firstImage,
            cache: "force-cache",
          }}
          style={[styles.image, variant === "list" && styles.listImage]}
        />
      );
    }

    return (
      <View style={[styles.noImage, variant === "list" && styles.listNoImage]}>
        <ThemedText style={styles.text} variant="h4" color={theme.colors.text.muted}>
          Kein Bild verfügbar
        </ThemedText>
      </View>
    );
  }

  const isList = variant === "list";

  return (
    <Pressable
      onPress={() =>
        router.navigate({
          pathname: "Animal/[id]",
          params: { id: animal.id },
        })
      }
    >
      <View style={[styles.card, isList ? styles.listCard : styles.gridCard]}>
        <CardImg />
        <View style={[styles.itemBox, isList && styles.listItemBox]}>
          <ThemedText variant="h4" color={theme.colors.text.light} style={styles.name}>
            {animal.name}
          </ThemedText>
          <ThemedText variant="bodySmall" color={theme.colors.brand.secondary} style={styles.origin}>
            {animal.origin}
          </ThemedText>
          <ThemedText variant="h4" color={theme.colors.text.light} style={styles.age}>
            {animal.age} Jahre
          </ThemedText>
          <View style={styles.buttons}>
            <IconButton
              size={26}
              iconName={isFavoriteAnimal ? "favorite" : "favorite-border"}
              iconSet="MaterialIcons"
              iconColor={theme.colors.brand.focus}
              onPress={() => {
                handleFavoritePress();
              }}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: theme.colors.background.base,
    shadowRadius: 2,
    shadowColor: theme.colors.text.light,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    overflow: "hidden",
  },
  gridCard: {
    margin: 8,
    height: 190,
  },
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    height: undefined,
    minHeight: 140,
    margin: 8,
  },
  image: {
    width: "100%",
    height: 100,
  },
  listImage: {
    width: 140,
    height: 140,
  },
  noImage: {
    backgroundColor: theme.colors.disabled,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  listNoImage: {
    height: 140,
    width: 140,
  },
  text: {
    textAlign: "center",
  },
  itemBox: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 5,
    justifyContent: "center",
  },
  listItemBox: {
    alignSelf: "flex-start",
    marginVertical: 16,
    gap: 4,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  name: {
    marginBottom: 2,
    fontWeight: "semibold",
    fontFamily: "Inter",
  },
  origin: {
    fontSize: 13,
    marginBottom: 5,
  },
  age: {
    fontSize: 13,
    fontWeight: "600",
  },
  buttons: {
    position: "absolute",
    flexDirection: "column",
    alignSelf: "flex-end",
    marginTop: 40,
  },
});
