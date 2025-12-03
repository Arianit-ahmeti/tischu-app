import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { theme } from "../theme/theme";

type TabItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const tabs: TabItem[] = [
  { id: "home", label: "Home", icon: "home-outline" },
  { id: "search", label: "Suche", icon: "search-outline" },
  { id: "favorites", label: "Favoriten", icon: "heart-outline" },
  { id: "profile", label: "Profil", icon: "person-outline" },
];

export const BottomNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            style={styles.tab}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={
                isActive
                  ? theme.colors.brand.primary
                  : theme.colors.text.muted
              }
            />
            <Text
              style={[
                styles.label,
                {
                  color: isActive
                    ? theme.colors.brand.primary
                    : theme.colors.text.muted,
                },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',        
    bottom: 0,                    
    left: 0,                   
    right: 0,  
    flexDirection: "row",
    backgroundColor: theme.colors.background.base,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingBottom: 34,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});