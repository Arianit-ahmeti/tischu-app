import React from "react";
import { Dimensions, FlatList, Image, Text, View } from "react-native";

const { width } = Dimensions.get("window");

export default function ImageCarousel({ urls }: { urls: string[] }) {
  if (urls.length == 0) {
    return (
      <View style={{ width, height: 250, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20 }}>Keine Bilder verfügbar</Text>
      </View>
    );
  }
  return (
    <View style={{ width, height: 250 }}>
      <FlatList
        data={urls}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="center"
        decelerationRate="fast"
        renderItem={({ item }) => (
          <Image
            source={{
              uri: item,
              cache: "force-cache",
            }}
            style={{
              width: width,
              height: 250,
              resizeMode: "cover",
              backgroundColor: "#eee",
            }}
          />
        )}
      />
    </View>
  );
}
