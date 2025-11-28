

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Farb- und Schriftkonstanten basierend auf CI
const COLORS = {
  textDark: '#242424', // Haupttext
  bgBase: '#FFF',      // Genereller App-Hintergrund
  primary: '#2B1A47',  // Primäre Farbe
  lightGrey: '#E5E0DE', // Divider
};

const FONT_STYLES = {
    header: {
        fontSize: 26, // Headline H1
        fontWeight: 'bold',
        // Annahme: Font-Family wurde über expo-font geladen
        color: COLORS.textDark,
    },
    bodyText: {
        fontSize: 16, // Body Large
        // Annahme: Font-Family wurde über expo-font geladen
        color: COLORS.textDark,
    }
};

export default function ProfileScreen() {
  
  return (
    <View style={styles.container}>
      
      {/* 1. Titel-Platzhalter (H1 Stil) */}
      <Text style={styles.header}>Mein Profil</Text>

      {/* 2. Platzhalter für Hauptinformationen (wird später von ListTiles gefüllt) */}
      <View style={styles.infoSection}>
          <Text style={styles.infoText}>[Platzhalter für Benutzername / Bild]</Text>
          <Text style={styles.infoText}>[Platzhalter für E-Mail]</Text>
      </View>

      {/* 3. Platzhalter für Trennlinie */}
      <View style={styles.divider} />

      {/* 4. Platzhalter für TextButton (#97) - z.B. "Einstellungen" */}
      <View style={styles.buttonArea}>
          {/* Der TextButton wird später hier eingefügt */}
          <Text style={styles.linkText}>[Platzhalter für TextButton: Einstellungen]</Text>
      </View>

    </View>
  );
}

// app/ProfileScreen.tsx (Am Ende der Datei)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF', // Setze direkt den Wert für bgBase
    },
    // 🚨 KORREKTUR: Definiere den header-Stil direkt hier
    header: {
        fontSize: 26,
        fontWeight: 'bold', // Wird jetzt im Kontext von StyleSheet.create richtig erkannt
        color: '#242424',
        marginBottom: 20,
        textAlign: 'center',
    },
    infoSection: {
        paddingVertical: 15,
    },
    infoText: {
        fontSize: 16,
        color: '#242424',
        paddingVertical: 5,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E0DE',
        marginBottom: 15,
    },
    buttonArea: {
        marginTop: 10,
        alignItems: 'flex-start',
    },
    linkText: {
        fontSize: 16,
        color: '#2B1A47', // Die Primary Color als Link
    }
});