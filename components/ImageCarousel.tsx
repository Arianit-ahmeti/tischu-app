import { FlashList } from "@shopify/flash-list";
import { theme } from "@theme";
import React, { ReactNode, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ImageStyle,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
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
  height?: number;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const height = props.height ?? 250;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollX / width);
    setActiveIndex(currentIndex);
  };

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

  const renderEmptyComponent = () => (
    <>
      {props.emptyStateComponent ?? (
        <View style={styles.emptyState}>
          <ThemedText variant="h3" color={theme.colors.text.muted}>
            Keine Bilder verfügbar
          </ThemedText>
        </View>
      )}
    </>
  );

  return (
    <View
      style={{
        width,
        height,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <View>
        <FlashList
          data={props.urls}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToAlignment="center"
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ListEmptyComponent={renderEmptyComponent}
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
        {props.urls.length > 0 && <PaginationDots activeIndex={activeIndex} dataLength={props.urls.length} />}
      </View>
      {props.showAmount && props.urls.length > 0 && amountIndicator}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    width,
    height: 250,
    backgroundColor: theme.colors.background.base,
    justifyContent: "center",
    alignItems: "center",
  },
});
