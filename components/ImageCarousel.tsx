import { FlatList, Image, Dimensions, View } from "react-native";
import React from "react";

const { width } = Dimensions.get("window");

export default function ImageCarousel({ urls }: { urls: string[] }) {
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
