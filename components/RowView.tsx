import { View, ViewProps } from "react-native";

export const RowView: React.FC<ViewProps> = ({ ...props }) => {
  return <View style={[{ flexDirection: "row" }, props.style]} {...props} />;
};
