import SelectableButton from "@components/SelectableButton";
import { addAnimal } from "@lib/animalService";
import React, { useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Add() {
  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");
  const [age, setAge] = useState<number>();
  const [type, setType] = useState(0);
  const [sex, setSex] = useState(0);
  const [size, setSize] = useState(0);
  const [character, setCharacter] = useState(0);

  function getSize(): string | null {
    switch (size) {
      case 0:
        return "small";
      case 1:
        return "medium";
      case 2:
        return "large";
      default:
        return null;
    }
  }

  function getType(): string {
    return type === 0 ? "dog" : "cat";
  }

  function getSex(): string {
    return sex === 0 ? "male" : "female";
  }

  function getCharacter(): string | null {
    switch (character) {
      case 0:
        return "shy";
      case 1:
        return "friendly";
      case 2:
        return "anxious";
      case 3:
        return "aggressive";
      default:
        return null;
    }
  }

  async function handleAddAnimal() {
    addAnimal({
      name,
      age,
      origin,
      type: getType(),
      size: getSize(),
      sex: getSex(),
      character: getCharacter(),
      status: "open",
    });
  }

  return (
    <ScrollView>
      <Text>Name</Text>
      <TextInput
        onChangeText={(text) => setName(text)}
        value={name}
        placeholder="Name des Tiers"
      />

      <Text>Herkunft</Text>
      <TextInput
        onChangeText={(text) => setOrigin(text)}
        value={origin}
        placeholder="Herkunft des Tiers"
      />

      <Text>Alter</Text>
      <TextInput
        keyboardType="numeric"
        onChangeText={(text) => setAge(parseInt(text) || 0)}
        value={age?.toString()}
        placeholder="Alter des Tiers"
      />

      <Text>Tierart</Text>
      <View style={styles.buttonGroup}>
        <SelectableButton
          isSelected={type == 0}
          title="Hund"
          onPress={() => setType(0)}
        />

        <SelectableButton
          isSelected={type == 1}
          title="Katze"
          onPress={() => setType(1)}
        />
      </View>

      <Text>Geschlecht</Text>
      <View style={styles.buttonGroup}>
        <SelectableButton
          isSelected={sex == 0}
          title="männlich"
          onPress={() => setSex(0)}
        />
        <SelectableButton
          isSelected={sex == 1}
          title="weiblich"
          onPress={() => setSex(1)}
        />
      </View>

      <Text>Größe</Text>
      <View style={styles.buttonGroup}>
        <SelectableButton
          isSelected={size == 0}
          title="klein"
          onPress={() => setSize(0)}
        />
        <SelectableButton
          isSelected={size == 1}
          title="mittel"
          onPress={() => setSize(1)}
        />
        <SelectableButton
          isSelected={size == 2}
          title="groß"
          onPress={() => setSize(2)}
        />
      </View>

      <Text>Charakter</Text>
      <View style={styles.buttonGroup}>
        <SelectableButton
          isSelected={character == 0}
          title="scheu"
          onPress={() => setCharacter(0)}
        />
        <SelectableButton
          isSelected={character == 1}
          title="freundlich"
          onPress={() => setCharacter(1)}
        />
        <SelectableButton
          isSelected={character == 2}
          title="ängstlich"
          onPress={() => setCharacter(2)}
        />
        <SelectableButton
          isSelected={character == 3}
          title="aggressiv"
          onPress={() => setCharacter(3)}
        />
      </View>

      <Button title="Tier hinzufügen" onPress={async () => handleAddAnimal()} />
      <View style={{ height: 20 }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
