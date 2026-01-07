import { KeyboardType, ScrollView, StyleSheet, View } from "react-native";
import { ColumnView } from "./ColumnView";
import { IconButton } from "./IconButton";
import { RowView } from "./RowView";
import { ThemedTextInput } from "./ThemedTextInput";

interface ThemedArrayInputProps {
  data: any[] | null | undefined;
  labels: string;
  keyboardType?: KeyboardType;
  onChange: (text: any[]) => void;
  singleRow?: boolean;
}
export const ThemedArrayInput: React.FC<ThemedArrayInputProps> = ({ singleRow = false, ...props }) => {
  let label = props.labels;
  const data =
    props.data instanceof Array
      ? props.data
      : props.keyboardType == "numeric" || props.keyboardType == "number-pad"
        ? []
        : [""];
  if (data != props.data) props.onChange(data);

  function InputFields() {
    if (singleRow.valueOf() == false) {
      return (
        <View>
          {data.map((text, index) => {
            let count = index + 1;
            let value = text instanceof String ? text : text.toString();
            return (
              <RowView key={"r" + index} style={styles.row}>
                <ColumnView style={styles.flex}>
                  <ThemedTextInput
                    value={value}
                    key={"Input" + index}
                    onChangeText={(text) => {
                      data[index] = text;
                      props.onChange(data);
                    }}
                    placeholder={label + " " + count}
                  />
                </ColumnView>
                <ColumnView>
                  <IconButton
                    key={"Delete" + index}
                    style={styles.flex}
                    iconName="minus-circle"
                    iconSet="Feather"
                    onPress={() => {
                      data.splice(index, 1);
                      props.onChange(data);
                    }}
                  />
                </ColumnView>
              </RowView>
            );
          })}
        </View>
      );
    } else
      return (
        <ScrollView key={"row"} contentContainerStyle={styles.row} horizontal={true}>
          {data.map((text, index) => {
            let count = index + 1;
            let value = text instanceof String ? text : text.toString();
            return (
              <ColumnView key={"col" + index} style={styles.flex && styles.rowField}>
                <ThemedTextInput
                  value={value}
                  key={"Input" + index}
                  onChangeText={(text) => {
                    data[index] = text;
                    props.onChange(data);
                  }}
                  placeholder={label + " " + count}
                />
              </ColumnView>
            );
          })}
          <ColumnView>
            <IconButton
              key={"Delete"}
              style={styles.flex}
              iconName="minus-circle"
              iconSet="Feather"
              onPress={() => {
                data.pop();
                props.onChange(data);
              }}
            />
          </ColumnView>
        </ScrollView>
      );
  }

  return (
    <View>
      <InputFields />
      <RowView>
        <IconButton
          key="Add"
          iconName="plus-circle"
          iconSet="Feather"
          onPress={() => {
            data.push("");
            props.onChange(data);
          }}
        />
      </RowView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  rowField: { marginHorizontal: 5 },
});
