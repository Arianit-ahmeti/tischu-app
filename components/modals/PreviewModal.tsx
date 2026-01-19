import { IconButton, ThemedText } from "@components";
import { theme } from "@theme";
import React from "react";
import { Image, Modal, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

interface PreviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  uri?: string;
  name?: string;
  type?: string;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isVisible, onClose, uri, name, type }) => {
  if (!uri) return null;

  const isPdf = type?.includes("pdf") || name?.toLowerCase().endsWith(".pdf");

  return (
    <Modal transparent={true} visible={isVisible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.center}>
        <View style={styles.modal}>
          <View style={styles.headerRow}>
            <ThemedText variant="h3" color={theme.colors.text.dark} style={styles.header} numberOfLines={1}>
              {name || "Vorschau"}
            </ThemedText>
            <IconButton
              iconSet="Feather"
              iconName="x"
              size={24}
              backgroundColor={theme.colors.background.warm}
              iconColor={theme.colors.text.dark}
              onPress={onClose}
            />
          </View>
          <View style={styles.content}>
            {isPdf ? (
              <WebView
                source={{ uri }}
                originWhitelist={["*"]}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
                style={styles.webview}
              />
            ) : (
              <Image source={{ uri }} style={styles.image} resizeMode="contain" />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    height: "65%",
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  header: {
    flex: 1,
    marginRight: 10,
  },
  content: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: theme.colors.background.warm,
  },
  webview: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
