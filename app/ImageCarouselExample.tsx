import { StyleSheet, View } from "react-native";
import { useState, useEffect } from "react";
import ImageCarousel from "../components/ImageCarousel";
import { getAnimalMediaDownloadURls } from "../lib/AnimalMediaService";

export default function ImageCarouselExample() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const urls = await getAnimalMediaDownloadURls(
          "09986f0c-1e76-4e9e-b59a-05be57511ac2"
        );
        setImageUrls(urls);
      } catch (error) {
        console.error("Error fetching animal images:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  if (loading) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <ImageCarousel urls={imageUrls} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
