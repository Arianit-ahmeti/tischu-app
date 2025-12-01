import { StyleSheet, View } from "react-native";

const DOT_SIZE = 10.29;
const ACTIVE_OUTER_SIZE = 20;
const ACTIVE_BORDER_WIDTH = 1.29;

export const PaginationDots = ({
  activeIndex,
  dataLength,
}: {
  activeIndex: number;
  dataLength: number;
}) => {
  return (
    <View style={paginationStyles.paginationContainer}>
      {Array.from({ length: dataLength }).map((_, index) => {
        const isActive = index === activeIndex;
        if (isActive) {
          return (
            <View key={index} style={paginationStyles.activeOuterCircle}>
              <View style={paginationStyles.activeInnerDot} />
            </View>
          );
        } else {
          return <View key={index} style={paginationStyles.inactiveDot} />;
        }
      })}
    </View>
  );
};

const paginationStyles = StyleSheet.create({
  paginationContainer: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#FFFFFF",
    opacity: 0.41,
    marginHorizontal: 4,
  },
  activeOuterCircle: {
    width: ACTIVE_OUTER_SIZE,
    height: ACTIVE_OUTER_SIZE,
    borderRadius: ACTIVE_OUTER_SIZE / 2,
    borderWidth: ACTIVE_BORDER_WIDTH,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  activeInnerDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#FFFFFF",
    opacity: 1,
  },
});
