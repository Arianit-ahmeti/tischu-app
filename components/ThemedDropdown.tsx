import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import { theme } from "@theme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { DropdownProps } from "react-native-element-dropdown/lib/typescript/components/Dropdown/model";
import { EnumObject } from "../lib/supabaseEnumHandler";

// dropdownData: Array of strings or EnumObject<String> (zB animalTypes)
// valueSetter: valueSetter={(itemValue) => setDropdownFilter({ ...dropdownFilter, size: itemValue.value })}
// currentVal (optional): Wert, der schon vorausgewählt sein soll
// placeholder: String, der angezeigt wird, wenn Auswahl leer ist

interface ThemedDropdownProps extends DropdownProps<any> {
  dropdownData: EnumObject<string> | string[];
  valueSetter: (item: any) => void;
  currentVal?: string | string[];
  placeholder?: string;
}

export const ThemedDropdown: React.FC<ThemedDropdownProps> = ({ currentVal = null, placeholder = null, ...props }) => {
  const [internalVal, setInternalVal] = useState<string>();
  let data: any[];
  const IconSize = 30;
  const DropdownS = [styles.picker, styles.dropdownMargin];
  const containerS = [styles.picker, styles.containerMargin];

  const renderRightIcon = () => {
    return <MaterialCommunityIcons name="menu-down" size={IconSize} color={theme.colors.brand.secondary} />;
  };
  const renderLeftIcon = () => {
    return <View style={{ width: IconSize }} />;
  };

  if (props.dropdownData instanceof Array) {
    data = props.dropdownData;
  } else {
    data = props.dropdownData.values.map((val) => ({ value: val }));
  }

  return (
    <Dropdown
      data={data}
      valueField={"value"}
      labelField={"value"}
      value={internalVal ?? currentVal ?? null}
      placeholder={placeholder ?? ""}
      renderRightIcon={renderRightIcon}
      renderLeftIcon={renderLeftIcon}
      placeholderStyle={styles.placeholderText}
      selectedTextStyle={styles.text}
      containerStyle={containerS}
      style={DropdownS}
      itemTextStyle={styles.text}
      itemContainerStyle={styles.picker}
      onChange={(itemValue: string) => {
        props.valueSetter(itemValue);
        setInternalVal(itemValue);
      }}
    />
  );
};

const styles = StyleSheet.create({
  placeholderText: {
    fontStyle: "italic",
    textAlign: "center",
    fontFamily: theme.typography.inputLabel.fontFamily,
    fontSize: theme.typography.inputLabel.fontSize,
    fontWeight: theme.typography.inputLabel.fontWeight,
    color: theme.colors.text.dark,
  },
  text: {
    textAlign: "center",
    fontFamily: theme.typography.navigation.fontFamily,
    fontSize: theme.typography.navigation.fontSize,
    fontWeight: theme.typography.navigation.fontWeight,
    color: theme.colors.text.dark,
  },
  picker: {
    backgroundColor: theme.colors.background.warm,
    borderRadius: 25,
    justifyContent: "center",
  },
  dropdownMargin: { marginVertical: 10 },
  containerMargin: { marginTop: 5 },
});
