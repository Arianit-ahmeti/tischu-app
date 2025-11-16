import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, useWindowDimensions } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { supabase } from "../lib/supabase";
import { Animal } from "../lib/types";



export default function AnimalList() {
    const { width } = useWindowDimensions();
    const numColumns = Math.max(1, Math.floor(width / 200))
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);
    async function loadAnimals() {
        try {
            const { data, error } = await supabase
                .from("animals")
                .select("*")


            console.log("Loaded Animal data successfully");

            setAnimals(data ?? []);

        } catch (error) {
            (error instanceof Error ? console.log("Error fetching Animal data: ", error.message) : "Unexpected Error ocurred");
        }
    }

    useEffect(() => {
        loadAnimals().finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <View>
                <Text>Daten werden geladen...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlashList
                data={animals}
                masonry
                numColumns={numColumns}
                style={styles.list}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.name}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    <View
                        style={styles.emptyComponent}>
                        <Text>No animals yet</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, marginTop: 10, padding: 12 },
    list: { justifyContent: "space-evenly" },
    card: { padding: 16, borderRadius: 25, backgroundColor: "lightblue", flexWrap: "nowrap", height: 160, margin: 5 },
    title: { fontSize: 18, textAlign: "center" },
    meta: { marginTop: 4 },
    emptyComponent: { alignItems: "center" },
});



