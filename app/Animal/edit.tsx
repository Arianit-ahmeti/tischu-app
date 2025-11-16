import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; 
import { fetchAnimalDetails, updateAnimal } from '../../lib/animalService';
import { TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 

export default function EditAnimal() {
    const {id} = useLocalSearchParams();
    const router = useRouter();

    const [animal, setAnimal] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const Label = ({label, value}: {label: string; value: any}) => (
        <Text style={{ marginBottom: 25 }}>
            <Text style={{ fontWeight: 'bold' }}>{label}:</Text>{value || "Unbekannt"}
        </Text>
    )

    async function loadAnimal() {
        setLoading(true);
        const data = await fetchAnimalDetails(id as string);        
        if (data) setAnimal(data);
        else Alert.alert("Fehler", "Tier konnte nicht geladen werden.");
        setLoading(false);
    }

    useEffect(() => {
        if (!id) return;
        loadAnimal();
    }, [id]);

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>
    if (!animal) return (<View style={styles.center}><Text>Tier nicht gefunden.</Text></View>);

    const handleSave = async() => {
        if (!animal) return;

        setSaving(true);

        const updates: any = {
            name: animal.name,
            age: animal.age,
            character: animal.character,
            size: animal.size,
            status: animal.status,
        };

        const updated = await updateAnimal(id as string, updates);
        if (updated) {
            Alert.alert("Erfolg", "Tier wurde aktualisiert!");
            router.replace(`/Animal/${id}`);
        } else {
            Alert.alert("Fehler, Aktualisierung fehlgeschlagen!");
        }
        setSaving(false);
    };


    return (
        <View style={styles.container}>
            <Text style= {{fontWeight: 'bold', marginTop: 10}}>Name:</Text>
            <TextInput 
                style= {styles.input} 
                value={animal.name || ""}
                onChangeText={(text) => setAnimal({...animal, name:text })}
            />

            <Text style= {{fontWeight: 'bold', marginTop: 10}}>Herkunft:</Text>
            <TextInput 
                style= {styles.input} 
                value={animal.origin || ""}
                keyboardType="numeric"
                onChangeText={(text) => setAnimal({...animal, origin:text })}
            />

            <Text style= {{fontWeight: 'bold'}}>Art:</Text>
            <Picker 
                selectedValue={animal.size || ""}
                onValueChange={(itemValue) => setAnimal({...animal, size: itemValue})}
                style= {styles.picker}
            > 
                <Picker.Item label='katze' value="cat"/>
                <Picker.Item label='hund' value="dog"/>
            </Picker>

            <Text style= {{fontWeight: 'bold'}}>Geschlecht:</Text>
            <Picker 
                selectedValue={animal.size ?? "Unbekannt"}
                onValueChange={(itemValue) => setAnimal({...animal, size: itemValue})}
                style= {styles.picker}
            > 
                <Picker.Item label='male' value="male"/>
                <Picker.Item label='female' value="female"/>
            </Picker>

            <Text style= {{fontWeight: 'bold'}}>Größe:</Text>
            <Picker 
                selectedValue={animal.size ?? "Unbekannt"}
                onValueChange={(itemValue) => setAnimal({...animal, size: itemValue})}
                style= {styles.picker}
            > 
                <Picker.Item label='klein' value="small"/>
                <Picker.Item label='mittel' value="medium"/>
                <Picker.Item label='groß' value="large"/>
            </Picker>

            <Text style= {{fontWeight: 'bold', marginTop: 10}}>Charakter:</Text>
            <Picker 
                selectedValue={animal.character ?? "Unbekannt"}
                onValueChange={(itemValue) => setAnimal({...animal, character: itemValue})}
                style= {styles.picker}
            > 
                <Picker.Item label='scheu' value="shy"/>
                <Picker.Item label='freundlich' value="friendly"/>
                <Picker.Item label='ängstlich' value="anxious"/>
                <Picker.Item label='aggressiv' value="aggressive"/>
            </Picker>

            <Text style= {{fontWeight: 'bold', marginTop: 10}}>Status:</Text>
            <Picker 
                selectedValue={animal.status ?? "Unbekannt"}
                onValueChange={(itemValue) => setAnimal({...animal, status: itemValue})}
                style= {styles.picker}
            > 
                <Picker.Item label='adopted' value="adopted"/>
                <Picker.Item label='open' value="open"/>
                <Picker.Item label='reserved' value="reserved"/>
            </Picker>

            <Text style= {{fontWeight: 'bold', marginTop: 10}}>Alter:</Text>
            <TextInput 
                style= {styles.input} 
                value={animal.age?.toString() || ""}
                keyboardType="numeric"
                onChangeText={(text) => setAnimal({...animal, age:parseInt(text) || null })}
            />
            
            <View style={styles.buttonContainer}>
                <Button
                    title="Speichern"
                    onPress={handleSave}
                    disabled={saving}
                />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: { padding: 20, flex: 1},
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    name: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
    input: {backgroundColor: "#fff", borderColor: "#5f5f5fff", borderWidth: 1, width: '30%', height: 25},
    picker: {width: '30%', height: 25},
    buttonContainer: {marginTop: 30, overflow: 'hidden', width: '30%'}
});