import { View, ViewProps } from "react-native";

export const ColumnView: React.FC<ViewProps> = (props) => {
  return (
    <View style={[{ flexDirection: "column" }, props.style]}>
      {props.children}
    </View>
  );
};
