import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import CartPreview from "@/components/Common/CartPreview";
import CustomHeader from "@/components/Common/CustomHeader";
import StoreCard, { StoreItem } from "@/components/Common/StoresCard";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

// Filters Component
type Filter = { label: string; onPress: () => void };
const FoodFilters: React.FC<{ filters: Filter[] }> = ({ filters }) => {
  const [activeFilter, setActiveFilter] = useState<string>("");
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContainer}
      style={styles.filterScroll}
    >
      {filters.map((filter, idx) => {
        const isActive = activeFilter === filter.label;
        return (
          <TouchableOpacity
            key={idx}
            style={[styles.filterButton, isActive && styles.filterButtonActive]}
            activeOpacity={0.8}
            onPress={() => {
              setActiveFilter(filter.label);
              filter.onPress();
            }}
          >
            {filter.label === "Filters" && (
              <Ionicons
                name="options-outline"
                size={16}
                color={isActive ? "#064E3B" : "#666"}
                style={styles.filterIcon}
              />
            )}
            <Text
              style={[styles.filterLabel, isActive && styles.filterLabelActive]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

// Sample Categories
const categories = [
  { title: "Chicken", image: require("../../assets/icons/chicken.jpg") },
  { title: "Rice", image: require("../../assets/images/gobi.jpg") },
  { title: "Indonesian", image: require("../../assets/images/healty.jpg") },
  { title: "Snack", image: require("../../assets/images/salad.webp") },
  { title: "Noodle", image: require("../../assets/images/nutri.webp") },
];

// Sample Featured Restaurants
const foodStores: StoreItem[] = [
  {
    id: "1",
    name: "I Love Chillies",
    image: {
      uri: "https://assets.cntraveller.in/photos/6673fe6c2f55cb2c01405ac0/16:9/w_1024%2Cc_limit/Lead%2520option.jpg",
    },
    category: "North Indian",
    price: "₹250 for one",
    rating: 3.9,
    deliveryTime: "25-30 mins",
    distance: "3.3 km",
    offer: "50% OFF up to ₹100",
    tag: "Last 100 Orders Without Complaints",
  },
  {
    id: "2",
    name: "Spicy Bites",
    image: {
      uri: "https://www.tinbuilding.com/wp-content/uploads/2024/09/download-6-scaled-920x518.webp",
    },
    category: "North Indian",
    price: "₹200 for one",
    rating: 4.2,
    deliveryTime: "20-25 mins",
    distance: "2.1 km",
    offer: "30% OFF on first order",
    tag: "Frequently Ordered",
  },
];

const FoodHomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [editingAddress, setEditingAddress] = useState(false);
  const [address, setAddress] = useState("Alok Apartments, Rohini...");
  const [newAddress, setNewAddress] = useState(address);
  const [locationLoading, setLocationLoading] = useState(false);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required.");
        setLocationLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const addressInfo = await Location.reverseGeocodeAsync(loc.coords);
      if (addressInfo.length > 0) {
        const { name, street, city, postalCode } = addressInfo[0];
        setNewAddress(
          `${name || ""}, ${street || ""}, ${city || ""} ${
            postalCode || ""
          }`.trim()
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch location.");
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <CustomHeader />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            placeholder="What are you craving?"
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {categories.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.categoryCard}
              onPress={() =>
                router.push({
                  pathname: "/food/allfooditems",
                  params: { category: item.title },
                })
              }
            >
              <Image source={item.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Filters */}
        <FoodFilters
          filters={[
            { label: "Filters", onPress: () => console.log("Filters") },
            { label: "Under ₹150", onPress: () => console.log("Under 150") },
            { label: "Under 30 mins", onPress: () => console.log("Under 30") },
            { label: "Pure Veg", onPress: () => console.log("Pure Veg") },
          ]}
        />

        {/* Featured Restaurants */}
        <Text style={styles.sectionTitle}>Featured Restaurants</Text>
        <FlatList
          data={foodStores}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StoreCard
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/food/restaurant",
                  params: { restaurant: JSON.stringify(item) },
                })
              }
            />
          )}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      </ScrollView>

      {/* Address Modal */}
      <Modal visible={editingAddress} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Delivery Address</Text>
            <TextInput
              value={newAddress}
              onChangeText={setNewAddress}
              placeholder="Enter new address"
              style={styles.modalInput}
            />
            <TouchableOpacity
              onPress={getCurrentLocation}
              style={styles.locationBtnWrapper}
            >
              <Text style={styles.locationBtn}>
                {locationLoading
                  ? "Fetching location..."
                  : "Use My Current Location"}
              </Text>
            </TouchableOpacity>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setEditingAddress(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setAddress(newAddress);
                  setEditingAddress(false);
                }}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
         {/* Floating Cart */}
            <CartPreview />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 10,
    width: "100%",
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingTop: 100, paddingBottom: 100 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    backgroundColor: "#f0f0f0",
    padding: Platform.OS === "ios" ? 14 : 12,
    borderRadius: 12,
  },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },

  preferenceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  preferenceText: { marginLeft: 10, fontSize: 13, color: "#444" },

  categoriesScroll: { marginTop: 16, paddingLeft: 16 },
  categoryCard: { alignItems: "center", marginRight: 16 },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  categoryText: { marginTop: 6, fontSize: 13, fontWeight: "500" },

  filterContainer: { paddingHorizontal: 16, alignItems: "center" },
  filterScroll: { marginVertical: 12 },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#F7F7F7",
  },
  filterButtonActive: {
    borderWidth: 2,
    borderColor: "#064E3B",
    backgroundColor: "#D1F7E4",
  },
  filterIcon: { marginRight: 6 },
  filterLabel: { color: "#444", fontWeight: "500", fontSize: 14 },
  filterLabelActive: { color: "#064E3B", fontWeight: "600" },

  recommendHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
  },
  sectionTitle: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 12,
  },
  exploreText: { color: "#10B981", fontWeight: "600", fontSize: 13 },

  restaurantsScroll: { paddingLeft: 16 },
  restaurantCard: { marginRight: 16, width: 180 },
  restaurantImage: { width: "100%", height: 100, borderRadius: 10 },
  restaurantName: { fontWeight: "600", fontSize: 16, marginTop: 6 },
  restaurantDetails: { fontSize: 12, color: "gray" },

  listContainer: { padding: 16 },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: width * 0.9,
  },
  modalTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  modalInput: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
  },
  locationBtnWrapper: { marginTop: 10 },
  locationBtn: { color: "#10B981", fontWeight: "600" },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  cancelText: { color: "red" },
  saveText: { color: "#10B981", fontWeight: "600" },
});

export default FoodHomeScreen;
