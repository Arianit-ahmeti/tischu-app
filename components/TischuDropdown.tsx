import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import { theme } from "@theme";
import { useState } from 'react';
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { EnumObject } from '../lib/supabaseEnumHandler';

// dropdownData: Array of strings or EnumObject<String> (zB animalTypes)
// valueSetter: valueSetter={(itemValue) => setDropdownFilter({ ...dropdownFilter, size: itemValue.value })}
// currentVal (optional): Wert, der schon vorausgewählt sein soll
// placeholder: String, der angezeigt wird, wenn Auswahl leer ist

export default function TischuDropdown({ dropdownData, valueSetter, currentVal, placeholder }: { dropdownData: EnumObject<string> | string[], valueSetter: (item: any) => void, currentVal: string | string[] | null, placeholder: string | null}) {
  const [internalVal, setInternalVal] = useState<string>();
  let data: any[];
  const IconSize = 30;

  const renderRightIcon = () => {
    return (<MaterialCommunityIcons name="menu-down" size={IconSize} color={theme.colors.brand.secondary}/>);
  }
  const renderLeftIcon = () => {
    return (<View style={{ width: IconSize }} />);
  }

  if (dropdownData instanceof Array) {
    data = dropdownData;
  }
  else {
    data = dropdownData.values.map((val) => ({ value: val }));
  }

  return (<Dropdown
    data={data}
    valueField={"value"}
    labelField={"value"}
    value={internalVal ?? currentVal ?? null}
    placeholder={placeholder ?? ""}

    renderRightIcon={renderRightIcon}
    renderLeftIcon={renderLeftIcon}

    placeholderStyle={styles.placeholderText}
    selectedTextStyle={styles.text}
    containerStyle={[styles.picker, {marginTop: 5}]}
    style={[styles.picker, {marginVertical: 10}]}
    itemTextStyle={styles.text}
    itemContainerStyle={styles.picker}

    onChange={(itemValue:string) => {
      valueSetter(itemValue);
      setInternalVal(itemValue);
    }}
  />)
}


const styles = StyleSheet.create({
  placeholderText: {
    fontStyle: "italic",
    textAlign: "center",
    fontFamily: theme.typography.inputLabel.fontFamily,
    fontSize: theme.typography.inputLabel.fontSize,
    fontWeight: theme.typography.inputLabel.fontWeight,
    color: theme.colors.text.dark
  },
  text: {
    textAlign: "center",
    fontFamily: theme.typography.navigation.fontFamily,
    fontSize: theme.typography.navigation.fontSize,
    fontWeight: theme.typography.navigation.fontWeight,
    color: theme.colors.text.dark
  },
  picker: {
    backgroundColor: theme.colors.background.warm,
    borderRadius: 25,
    justifyContent: "center",
  },
});
