import { SelectableButton } from "@components/SelectableButton";
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
        <SelectableButton isSelected={type == 0} onPress={() => setType(0)}>
          Hund
        </SelectableButton>

        <SelectableButton isSelected={type == 1} onPress={() => setType(1)}>
          Katze
        </SelectableButton>
      </View>

      <Text>Geschlecht</Text>
      <View style={styles.buttonGroup}>
        <SelectableButton isSelected={sex == 0} onPress={() => setSex(0)}>
          männlich
        </SelectableButton>
        <SelectableButton isSelected={sex == 1} onPress={() => setSex(1)}>
          weiblich
        </SelectableButton>
      </View>

      <Text>Größe</Text>
      <View style={styles.buttonGroup}>
        <SelectableButton isSelected={size == 0} onPress={() => setSize(0)}>
          klein
        </SelectableButton>
        <SelectableButton isSelected={size == 1} onPress={() => setSize(1)}>
          mittel
        </SelectableButton>
        <SelectableButton isSelected={size == 2} onPress={() => setSize(2)}>
          groß
        </SelectableButton>
      </View>

      <Text>Charakter</Text>
      <View style={styles.buttonGroup}>
        <SelectableButton
          isSelected={character == 0}
          onPress={() => setCharacter(0)}
        >
          scheu
        </SelectableButton>
        <SelectableButton
          isSelected={character == 1}
          onPress={() => setCharacter(1)}
        >
          freundlich
        </SelectableButton>
        <SelectableButton
          isSelected={character == 2}
          onPress={() => setCharacter(2)}
        >
          ängstlich
        </SelectableButton>
        <SelectableButton
          isSelected={character == 3}
          onPress={() => setCharacter(3)}
        >
          aggressiv
        </SelectableButton>
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
