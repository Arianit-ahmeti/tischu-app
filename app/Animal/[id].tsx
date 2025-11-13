import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; 
import { fetchAnimalDetails } from '../../lib/animalService';

interface Animal {
    id: string;
    created_at: string;
    name: string;
    origin: string;
    type: string;
    sex: string;
    size: string;
    character: string;
    status: string;
    age: number | null;
}

export default function AnimalDetailScreen() {
    const { id } = useLocalSearchParams(); 
    const animalId = Array.isArray(id) ? id[0] : id;

    const [animal, setAnimal] = useState<Animal | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (!animalId) { 
            setLoading(false); 
            return; 
        }

        async function loadAnimal() {
            setLoading(true);
            const data = await fetchAnimalDetails(animalId as string);
            
            if (data) {
                setAnimal(data);
            } else {
                Alert.alert("Fehler", "Tier konnte nicht geladen werden.");
            }
            setLoading(false);
        }
        loadAnimal();
    }, [animalId]);

    if (loading) {
        return (
            <View style={styles.center}><ActivityIndicator size="large" /></View>
        );
    }
    if (!animal) {
        return (<View style={styles.center}><Text>Tier nicht gefunden.</Text></View>);
    }
    
    return (
        <View style={styles.container}>
            <Text style={styles.name}>{animal?.name}</Text>
            <Text>Herkunft: {animal.origin}</Text>
            <Text>Alter: {animal.age || 'Unbekannt'}</Text>
            <Text>Charakter: {animal.character}</Text>

            <View style={styles.button}>
                <Button 
                    title="Bearbeiten"
                    onPress={() => router.push(`/Animal/edit?id=${animal.id}`)}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    name: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
    button: {marginTop: 30, overflow: 'hidden', width: '30%'}
});