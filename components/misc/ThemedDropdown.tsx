import { RowView, SelectableButton } from "@components";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import { EnumObject } from "@lib/utils/supabaseEnumHandler";
import { theme } from "@theme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

// dropdownData: Array of strings or EnumObject<String> (zB animalTypes)
// valueSetter: valueSetter={(itemValue) => setDropdownFilter({ ...dropdownFilter, size: itemValue.value })}
// currentVal (optional): Wert, der schon vorausgewählt sein soll
// placeholder: String, der angezeigt wird, wenn Auswahl leer ist

interface ThemedDropdownProps {
  dropdownData: EnumObject<string> | string[];
  valueSetter: (item: any) => void;
  currentVal?: string | string[];
  placeholder?: string;
  button?: boolean;
}

export const ThemedDropdown: React.FC<ThemedDropdownProps> = ({
  currentVal = null,
  placeholder = null,
  button = false,
  ...props
}) => {
  let data: any[];

  if (!button) {
    const IconSize = 30;
    const DropdownS = [styles.picker, styles.dropdownMargin];
    const containerS = [styles.picker, styles.containerMargin];
    const [internalVal, setInternalVal] = useState<string>();
    if (props.dropdownData instanceof Array) {
      data = props.dropdownData;
    } else {
      data = props.dropdownData.values.map((val) => ({ value: val }));
    }

    const renderRightIcon = () => {
      return <MaterialCommunityIcons name="menu-down" size={IconSize} color={theme.colors.brand.secondary} />;
    };
    const renderLeftIcon = () => {
      return <View style={{ width: IconSize }} />;
    };

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
  } else {
    data =
      props.dropdownData instanceof Array ? props.dropdownData : (data = props.dropdownData.values.map((val) => val));
  }
  const buttons: any[] = [];

  const currentValArray: string[] = Array.isArray(currentVal) ? currentVal : currentVal ? [currentVal] : [];
  const toggle = (value: string) => {
    let selection: string[] = currentValArray.includes(value)
      ? currentValArray.filter((item) => item !== value)
      : [...currentValArray, value];
    selection.length == 0 ? props.valueSetter(null) : props.valueSetter(selection);
  };
  return (
    <RowView style={styles.wrap}>
      {data.map((item) => {
        const isSelected = currentValArray.includes(item);

        return (
          <SelectableButton key={item} isSelected={isSelected} onPress={() => toggle(item)}>
            {item}
          </SelectableButton>
        );
      })}
    </RowView>
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
  wrap: { flexWrap: "wrap" },
});
