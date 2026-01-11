import { KeyboardType, ScrollView, StyleSheet, View } from "react-native";
import { ColumnView } from "./ColumnView";
import { IconButton } from "./IconButton";
import { RowView } from "./RowView";
import { ThemedTextInput } from "./ThemedTextInput";

interface ThemedArrayInputProps {
  data: any[];
  labels: string;
  keyboardType?: KeyboardType;
  onChange: (text: any[]) => void;
  singleRow?: boolean;
}
export const ThemedArrayInput: React.FC<ThemedArrayInputProps> = ({ singleRow = false, data = [""], ...props }) => {
  let label = props.labels;
  if (data.length == 0) props.onChange([""]);

  function changeAt(index: number, newText: any) {
    const newData = data.map((old, i) => {
      if (i === index) {
        return newText;
      } else {
        return old;
      }
    });
    props.onChange(newData);
  }

  const render = () => {
    if (singleRow.valueOf() == false) {
      return (
        <View>
          {data.map((val, index) => {
            let count = index + 1;
            let text = val instanceof String ? val : val.toString();
            return (
              <RowView key={"r" + index} style={styles.row}>
                <ColumnView style={styles.flex}>
                  <ThemedTextInput
                    value={text}
                    key={"Input" + index}
                    onChangeText={(text) => {
                      changeAt(index, text);
                    }}
                    keyboardType={props.keyboardType}
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
          {data.map((val, index) => {
            let count = index + 1;
            let text = val instanceof String ? val : val.toString();

            return (
              <ColumnView key={"col" + index} style={styles.flex && styles.rowField}>
                <ThemedTextInput
                  value={text}
                  key={"Input" + index}
                  onChangeText={(text) => {
                    changeAt(index, text);
                  }}
                  keyboardType={props.keyboardType}
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
  };

  return (
    <View>
      {render()}
      <RowView>
        <IconButton
          key="Add"
          iconName="plus-circle"
          iconSet="Feather"
          onPress={() => {
            props.onChange([...data, ""]);
          }}
        />
      </RowView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  rowField: { marginHorizontal: 5, minWidth: 30 },
});
