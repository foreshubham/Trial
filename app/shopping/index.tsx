// src/screens/shopping/ShoppingScreen.tsx
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import CustomHeader from "@/components/Common/CustomHeader";
import CategoryNavigation from "@/components/Shopping/CategoryItems";
import ShoppingFilters from "@/components/Shopping/Filters/ShopFilter";
import HorizontalCardList from "@/components/Shopping/HorizontalCard";
import MenuOptionsModal from "@/components/Shopping/MenuOptionModal";
import ImageSlider from "@/components/Shopping/Slider";

// Context Imports
import { useLocation } from "@/context/LocationContext";
import { useOrders } from "@/context/OrderContext";

const topStores = [
  {
    name: "Gen Z Trendys",
    image: require("@/assets/stores/s4.png"),
    rating: "4.5",
    time: "30-40 mins",
  },
  {
    name: "Jain Collections",
    image: require("@/assets/stores/s5.png"),
    rating: "4.5",
    time: "30-40 mins",
  },
  {
    name: "Fashion Hub",
    image: require("@/assets/stores/s4.jpg"),
    rating: "4.5",
    time: "30-40 mins",
  },
];

const { width } = Dimensions.get("window");

const ShoppingScreen = ({ navigation }: { navigation: any }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  // ✅ Use contexts
  const { location, setLocation } = useLocation();
  const { orders, placeOrder, updateOrderStatus } = useOrders();

  // Example: Add item to order (shopping)
  const addToCart = (item: any) => {
    placeOrder(
      [
        {
          id: Math.random().toString(36).substring(7),
          name: item.name,
          price: 999, // example price
          quantity: 1,
          category: "Clothing", // or derive dynamically
          size: "M", // or derive dynamically
        },
      ],
      "shopping"
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.fixedHeader}>
        <CustomHeader />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 100, paddingBottom: 100 }}
      >
        {/* Category Navigation */}
        <CategoryNavigation />

        {/* Fit Preference */}
        <View style={styles.preferenceCard}>
          <MaterialIcons name="checklist" size={20} color="#10B981" />
          <Text style={styles.preferenceText}>
            <Text style={{ fontWeight: "600" }}>Have fit preferences? </Text>
            Set your style fit and shop smarter!
          </Text>
        </View>

        {/* Image Slider */}
        <ImageSlider />

        {/* Filters */}
        <ShoppingFilters
          filters={[
            { label: "Filters", onPress: () => console.log("Filters") },
            { label: "Trending", onPress: () => console.log("Trending") },
            { label: "Top Rated", onPress: () => console.log("Top Rated") },
            { label: "Top Brands", onPress: () => console.log("Top Brands") },
            { label: "Imported", onPress: () => console.log("Imported") },
            { label: "Under 30 mins", onPress: () => console.log("Under 30") },
          ]}
        />

        {/* Horizontal Top Picks */}
        <HorizontalCardList
          title="Top Picks For You"
          items={topStores}
          onSeeAllPress={() =>
            navigation.navigate("TopPicks", { stores: topStores })
          }
          onCardPress={(item, index) =>
            navigation.navigate("TopPicks", {
              restaurants: topStores,
              selectedIndex: index,
            })
          }
        />

        {/* Featured Shops */}
        <Text style={styles.sectionTitle}>Featured Shops</Text>
      </ScrollView>

      {/* Modals */}
      <MenuOptionsModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />

      {/* Edit Address Modal */}
      <Modal visible={editingAddress} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Delivery Address</Text>
            <TextInput
              value={newAddress || location?.address || ""}
              onChangeText={setNewAddress}
              placeholder="Enter new address"
              style={styles.modalInput}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setEditingAddress(false)}>
                <Text style={{ color: "red" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (newAddress.trim()) {
                    setLocation({
                      latitude: location?.latitude || 0,
                      longitude: location?.longitude || 0,
                      address: newAddress,
                    });
                  }
                  setEditingAddress(false);
                }}
              >
                <Text style={{ color: "#10B981", fontWeight: "600" }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ShoppingScreen;

const styles = StyleSheet.create({
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 10,
    width: "100%",
  },
  preferenceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ebfceeff",
    borderWidth: 1,
    borderColor: "#10B981",
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  preferenceText: { marginLeft: 10, fontSize: 13, color: "#444" },
  sectionTitle: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 12,
  },
  exploreText: { color: "#10B981", fontWeight: "600", fontSize: 13 },
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
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 20,
  },
});
