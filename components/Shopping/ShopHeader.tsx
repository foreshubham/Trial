import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
  useWindowDimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const TABS = [
  { id: "all", label: "All", gradient: ["#56ab2f", "#a8e063"] },
  { id: "men", label: "Men", gradient: ["#43cea2", "#185a9d"] },
  { id: "women", label: "Women", gradient: ["#fc6076", "#ff9a44"] },
  { id: "kids", label: "Kids", gradient: ["#36d1dc", "#5b86e5"] },
];

const CATEGORIES = [
  { id: "fashion", label: "Fashion", image: "https://via.placeholder.com/100" },
  { id: "beauty", label: "Beauty", image: "https://via.placeholder.com/100" },
  { id: "home", label: "Home & Living", image: "https://via.placeholder.com/100" },
  { id: "footwear", label: "Footwear", image: "https://via.placeholder.com/100" },
  { id: "accessories", label: "Accessories", image: "https://via.placeholder.com/100" },
  { id: "gadgets", label: "Gadgets", image: "https://via.placeholder.com/100" },
];

export default function UpdatedHeader() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [activeTab, setActiveTab] = useState("all");

  const activeGradient =
    TABS.find((tab) => tab.id === activeTab)?.gradient || ["#56ab2f", "#a8e063"];

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={activeGradient}
        style={[styles.headerContainer, Platform.OS === "ios" && styles.iosHeader]}
      >
        <StatusBar barStyle="light-content" translucent />

        {/* Top Row: Location & Icons */}
        <View style={styles.topRow}>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.locationText}>Deliver to Home</Text>
          </View>

          <View style={styles.iconRow}>
            {/* Notification */}
            <TouchableOpacity style={styles.iconWrapper}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>8</Text>
              </View>
            </TouchableOpacity>

            {/* Wishlist */}
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Full Width Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#535766" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search for products, brands..."
            placeholderTextColor="#94969F"
            style={styles.searchInput}
          />
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabsContainer}>
          <FlatList
            horizontal
            data={TABS}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              const isActive = activeTab === item.id;
              return (
                <TouchableOpacity
                  onPress={() => setActiveTab(item.id)}
                  style={[styles.tabItem, isActive && styles.activeTabItem]}
                >
                  <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </LinearGradient>

      {/* Category Grid */}
      <View style={styles.gridContainer}>
        {CATEGORIES.map((category) => (
          <View key={category.id} style={styles.categoryCard}>
            <Image source={{ uri: category.image }} style={styles.categoryImage} />
            <Text style={styles.categoryLabel}>{category.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  iosHeader: {
    paddingTop: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  iconWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -6,
    height: 16,
    width: 16,
    backgroundColor: "#03DAC6",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#282C3F",
  },
  tabsContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginRight: 12,
  },
  activeTabItem: {
    backgroundColor: "rgba(3, 218, 198, 0.5)",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  activeTabText: {
    fontWeight: "700",
    color: "#fff",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  categoryCard: {
    width: "47%",
    backgroundColor: "#F5F5F6",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  categoryImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#282C3F",
    textAlign: "center",
  },
});
