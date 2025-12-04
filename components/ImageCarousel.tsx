import React, { ReactNode, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  ImageStyle,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from "react-native";
import { PaginationDots } from "./PaginationDots";
import { ThemedText } from "./ThemedText";

const { width } = Dimensions.get("window");

interface ImageCarouselProps {
  // TODO: outsource showAmount into ImagePreview component so it can be used in the list without size issues
  showAmount?: boolean;
  emptyStateComponent?: ReactNode;
  imageStyle?: ImageStyle;
  urls: string[];
}

export const ImageCarousel: React.FC<ImageCarouselProps> = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  let child: ReactNode;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollX / width);
    setActiveIndex(currentIndex);
  };

  if (props.urls.length == 0) {
    child = props.emptyStateComponent ?? <Text style={{ fontSize: 20 }}>Keine Bilder verfügbar</Text>;
  } else {
    child = (
      <View>
        <FlatList
          data={props.urls}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToAlignment="center"
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <ImageBackground
              source={{
                uri: item,
                cache: "force-cache",
              }}
              style={[
                props.imageStyle,
                {
                  height: "100%",
                  width,
                  backgroundColor: "#eee",
                },
              ]}
              resizeMode="cover"
            />
          )}
        />
        <PaginationDots activeIndex={activeIndex} dataLength={props.urls.length} />
      </View>
    );

    const amountIndicator: ReactNode = (
      <View
        style={{
          position: "absolute",
          bottom: "5%",
          right: "5%",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          borderRadius: 4,
          paddingVertical: 4,
          paddingHorizontal: 8,
        }}
      >
        <ThemedText color="white">{props.urls.length}</ThemedText>
      </View>
    );

    return (
      <View
        style={{
          width,
          height: 250,
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        {child}
        {props.showAmount && props.urls.length > 0 && amountIndicator}
      </View>
    );
  }
};
