import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GREEN = "#2C9C46";
const TEXT_LIGHT = "#FFFFFF";

type AppHeaderProps = {
  title: string;
  onBack?: () => void; // optional back handler
};

export default function AppHeader({ title, onBack }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  const HEADER_HEIGHT = 56;
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : insets.top;

  const totalHeight = HEADER_HEIGHT + statusBarHeight;

  return (
    <View
      style={[
        styles.headerWrap,
        { height: totalHeight, paddingTop: statusBarHeight },
      ]}
    >
      <View style={styles.headerRow}>
        {/* Back button, only render if onBack is provided */}
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={TEXT_LIGHT} />
          </TouchableOpacity>
        ) : (
          // To keep title centered, render a spacer if no back button
          <View style={styles.backButtonPlaceholder} />
        )}

        <Text style={styles.headerTitle}>{title}</Text>

        {/* Spacer on the right to balance the back button */}
        <View style={styles.headerIcon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    width: "100%",
    backgroundColor: GREEN,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowColor: "#000",
    elevation: 4,
    zIndex: 10,
  },
  headerRow: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  headerIcon: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    flex: 1,
    color: TEXT_LIGHT,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
