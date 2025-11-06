import { Text, ScrollView, View } from "react-native";
import React, { useState } from "react";
import { Input, ButtonGroup, Button } from "@rneui/themed";
import { supabase } from "../../lib/supabase";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function Add() {
  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");
  const [age, setAge] = useState<number>();
  const [type, setType] = useState(0);
  const [sex, setSex] = useState(0);
  const [size, setSize] = useState(0);
  const [character, setCharacter] = useState(0);

  function getSize(): String | null {
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

  function getType(): String {
    return type === 0 ? "dog" : "cat";
  }

  function getSex(): String {
    return sex === 0 ? "male" : "female";
  }

  function getCharacter(): String | null {
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
    const { data, error } = await supabase
      .from("animals")
      .insert({
        name: name,
        age: age,
        origin: origin,
        type: getType(),
        size: getSize(),
        sex: getSex(),
        character: getCharacter(),
        status: "open",
      })
      .select();

    if (error) {
      console.log("Error adding animal:", error.message);
    } else {
      console.log("Animal added successfully:", data);
    }
  }

  return (
    <ScrollView>
      <Input
        label="Name"
        onChangeText={(text) => setName(text)}
        value={name}
        placeholder="Name des Tiers"
      />

      <Input
        label="Herkunft"
        onChangeText={(text) => setOrigin(text)}
        value={origin}
        placeholder="Herkunft des Tiers"
      />

      <Input
        label="Alter"
        keyboardType="numeric"
        onChangeText={(text) => setAge(parseInt(text) || 0)}
        value={age?.toString()}
        placeholder="Alter des Tiers"
      />

      <Text>Tierart</Text>
      <ButtonGroup
        buttons={["Hund", "Katze"]}
        selectedIndex={type}
        onPress={(value) => {
          setType(value);
        }}
        containerStyle={{ marginBottom: 20 }}
      />

      <Text>Geschlecht</Text>
      <ButtonGroup
        buttons={["männlich", "weiblich"]}
        selectedIndex={sex}
        onPress={(value) => {
          setSex(value);
        }}
        containerStyle={{ marginBottom: 20 }}
      />

      <Text>Größe</Text>
      <ButtonGroup
        buttons={["klein", "mittel", "groß"]}
        selectedIndex={size}
        onPress={(value) => {
          setSize(value);
        }}
        containerStyle={{ marginBottom: 20 }}
      />

      <Text>Charakter</Text>
      <ButtonGroup
        buttons={["scheu", "freundlich", "ängstlich", "aggressiv"]}
        selectedIndex={character}
        onPress={(value) => {
          setCharacter(value);
        }}
        containerStyle={{ marginBottom: 20 }}
      />

      <Button onPress={() => handleAddAnimal()}>Tier hinzufügen</Button>
      <View style={{ height: 20 }}></View>
    </ScrollView>
  );
}
