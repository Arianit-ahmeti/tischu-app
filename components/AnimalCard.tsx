import { Animal } from "@lib/types";
import { ThemedText } from "components";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from "react-native";
import { theme } from "../theme/theme";

interface AnimalCardProps {
  animal: Animal;
  previewImage?: string;
  doneLoading: boolean;
}

export const AnimalCard: React.FC<AnimalCardProps> = (props) => {
  const router = useRouter();

  function CardImg() {
    if (props.previewImage) {
      return (
        <Image
          source={{
            uri: props.previewImage,
            cache: "force-cache",
          }}
          style={styles.image}
        />
      );
    } else if (!props.doneLoading) {
      return (
        <View style={styles.noImage}>
          <ActivityIndicator></ActivityIndicator>
        </View>
      );
    } else {
      return (
        <View style={styles.noImage}>
          <ThemedText variant="h4" color={theme.colors.text.muted}>
            {" "}
            No Image{" "}
          </ThemedText>
        </View>
      );
    }
  }

  return (
    <Pressable
      onPress={() =>
        router.navigate({
          pathname: "Animal/[id]",
          params: { id: props.animal.id },
        })
      }
    >
      <View style={styles.card}>
        <CardImg />
        <View style={styles.itemBox}>
          <ThemedText variant="h4" color={theme.colors.text.light}>
            {props.animal.name}
          </ThemedText>
          <ThemedText variant="bodySmall" color={theme.colors.brand.secondary}>
            {props.animal.origin}
          </ThemedText>
          <ThemedText variant="bodySmall" color={theme.colors.text.light}>
            {props.animal.age} Jahre
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: theme.colors.background.base,
    height: 190,
    margin: 10,
    shadowRadius: 2,
    shadowColor: theme.colors.text.light,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  noImage: {
    backgroundColor: theme.colors.disabled,
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  itemBox: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 5,
    justifyContent: "center",
  },
});
