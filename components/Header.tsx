// src/components/Layout/Header.tsx
import { useAuth } from "@/context/auth";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ServiceIcon {
  type: "ride" | "food" | "shopping" | "parcel";
  icon: React.ReactNode;
  top: number;
  left: number;
}

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  // Background icons for decoration
  const serviceIcons: ServiceIcon[] = [
    {
      type: "food",
      icon: (
        <Ionicons
          name="fast-food-outline"
          size={20}
          color="rgba(255,255,255,0.3)"
        />
      ),
      top: 180,
      left: 30,
    },
    {
      type: "shopping",
      icon: (
        <MaterialCommunityIcons
          name="shopping-outline"
          size={22}
          color="rgba(255,255,255,0.25)"
        />
      ),
      top: 160,
      left: 120,
    },
    {
      type: "shopping",
      icon: (
        <MaterialCommunityIcons
          name="shopping-outline"
          size={22}
          color="rgba(255,255,255,0.25)"
        />
      ),
      top: 170,
      left: 300,
    },
    {
      type: "ride",
      icon: (
        <FontAwesome5
          name="car-side"
          size={20}
          color="rgba(255,255,255,0.2)"
        />
      ),
      top: 10,
      left: 200,
    },
    {
      type: "food",
      icon: (
        <Ionicons
          name="fast-food-outline"
          size={18}
          color="rgba(255,255,255,0.2)"
        />
      ),
      top: 90,
      left: 60,
    },
    {
      type: "shopping",
      icon: (
        <MaterialCommunityIcons
          name="shopping-outline"
          size={18}
          color="rgba(255,255,255,0.15)"
        />
      ),
      top: 60,
      left: 250,
    },
    {
      type: "ride",
      icon: (
        <FontAwesome5
          name="car-side"
          size={16}
          color="rgba(255,255,255,0.15)"
        />
      ),
      top: 30,
      left: 280,
    },
  ];

  return (
    <LinearGradient
      colors={["#2C9C46", "#1D6B30"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBg}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <SafeAreaView style={styles.safeArea}>
        {/* Background icons */}
        {serviceIcons.map((item, idx) => (
          <View
            key={`${item.type}-${idx}`}
            style={{ position: "absolute", top: item.top, left: item.left }}
            pointerEvents="none"
          >
            {item.icon}
          </View>
        ))}

        {/* Top Row */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greeting}>
              Hi{user?.name ? `, ${user.name}` : ""} 👋
            </Text>
            <Text style={styles.subText}>Ready to explore something fresh?</Text>
          </View>

          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => router.push("/notifications")}
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={22} color="#2e7d32" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#2e7d32" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for clothes, food, or places"
            placeholderTextColor="#666"
            returnKeyType="search"
            accessible
            accessibilityLabel="Search"
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    overflow: "hidden",
    minHeight: 180,
    width: "100%",
    position: "relative",
  },
  safeArea: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    zIndex: 2,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  subText: {
    fontSize: 15,
    color: "#f1f8e9",
    marginTop: 4,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
    zIndex: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },
});
