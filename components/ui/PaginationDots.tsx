import { StyleSheet, View } from "react-native";

interface PaginationDotsProps {
  activeIndex: number;
  dataLength: number;
}

const DOT_SIZE = 10.29;
const ACTIVE_OUTER_SIZE = 20;
const ACTIVE_BORDER_WIDTH = 1.29;

export const PaginationDots: React.FC<PaginationDotsProps> = ({ activeIndex, dataLength }) => {
  return (
    <View style={paginationStyles.paginationContainer}>
      {Array.from({ length: dataLength }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <View key={index} style={[paginationStyles.dotBase, isActive && paginationStyles.activeOuterStyle]}>
            <View style={[paginationStyles.activeInnerDot, { opacity: isActive ? 1 : 0.41 }]} />
          </View>
        );
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
  dotBase: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  activeOuterStyle: {
    width: ACTIVE_OUTER_SIZE,
    height: ACTIVE_OUTER_SIZE,
    borderRadius: ACTIVE_OUTER_SIZE / 2,
    borderWidth: ACTIVE_BORDER_WIDTH,
    borderColor: "#FFFFFF",
  },
  activeInnerDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#FFFFFF",
  },
});
