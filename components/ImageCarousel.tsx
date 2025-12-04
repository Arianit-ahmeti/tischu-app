import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from "react-native";
import { PaginationDots } from "./PaginationDots";

const { width } = Dimensions.get("window");

export default function ImageCarousel({ urls }: { urls: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollX / width);
    setActiveIndex(currentIndex);
  };

  if (urls.length == 0) {
    return (
      <View
        style={{
          width,
          height: 250,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
        onScroll={handleScroll}
        scrollEventThrottle={16} //60 FPS
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
      <PaginationDots activeIndex={activeIndex} dataLength={urls.length} />
    </View>
  );
}
