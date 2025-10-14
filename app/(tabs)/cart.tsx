// app/shopping/CartScreen.tsx
import { useCart } from "@/context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function CartScreen() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [activeCart, setActiveCart] = useState<"all" | "food" | "shopping">(
    "all"
  );

  const foodItems = cart.filter((item) => item.type === "food");
  const shoppingItems = cart.filter((item) => item.type === "shopping");
  const allItems = [...foodItems, ...shoppingItems];

  const getTypeColor = (type: "food" | "shopping") =>
    type === "food" ? "#2c9c46" : "#3b82f6";

  const renderItem = (item: any) => (
    <View style={styles.card}>
      <View
        style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}
      >
        <Text style={styles.typeBadgeText}>{item.type.toUpperCase()}</Text>
      </View>

      <Image source={{ uri: item.image }} style={styles.productImage} />

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        {item.size && <Text style={styles.productSize}>Size: {item.size}</Text>}
        {item.color && (
          <Text style={styles.productColor}>Color: {item.color}</Text>
        )}
        <Text style={styles.productPrice}>₹{item.price}</Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() =>
              updateQuantity(item.id, Math.max(1, item.quantity - 1))
            }
          >
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyNumber}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getTotal = (items: any[]) =>
    items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const getActiveItems = () => {
    if (activeCart === "food") return foodItems;
    if (activeCart === "shopping") return shoppingItems;
    return allItems;
  };

  const getCheckoutText = () => {
    if (activeCart === "food") return "Checkout Food";
    if (activeCart === "shopping") return "Checkout Shopping";
    return "Checkout All";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
      </View>

      {/* Cart Tabs */}
      <View style={styles.tabs}>
        {["all", "food", "shopping"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeCart === tab && styles.tabActive]}
            onPress={() => setActiveCart(tab as any)}
          >
            <Text
              style={[
                styles.tabText,
                activeCart === tab && styles.tabTextActive,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {getActiveItems().length === 0 ? (
          <Text style={styles.emptyText}>No items in cart 😔</Text>
        ) : (
          getActiveItems().map((item) => renderItem(item))
        )}
      </ScrollView>

      {/* Sticky Bottom Checkout */}
      {getActiveItems().length > 0 && (
        <View style={styles.stickyFooter}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalAmount}>
              ₹{getTotal(getActiveItems())}
            </Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn}>
            <Text style={styles.checkoutText}>{getCheckoutText()}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f5f8" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    zIndex: 10,
  },
  backButton: { marginRight: 16 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: "700", color: "#222" },

  // Tabs
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
  },
  tabActive: { backgroundColor: "#2c9c46" },
  tabText: { fontSize: 16, fontWeight: "700", color: "#222" },
  tabTextActive: { color: "#fff" },

  // Card
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    position: "relative",
    marginBottom: 12,
  },
  typeBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 10,
  },
  typeBadgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  productImage: { width: 100, height: 100, borderRadius: 12, marginRight: 12 },
  productInfo: { flex: 1, justifyContent: "space-between" },
  productName: { fontSize: 16, fontWeight: "700", color: "#222" },
  productSize: { fontSize: 14, color: "#555" },
  productColor: { fontSize: 14, color: "#555" },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c9c46",
    marginTop: 4,
  },

  // Quantity
  quantityRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyButton: {
    backgroundColor: "#e6f4ea",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  qtyText: { fontSize: 18, fontWeight: "700", color: "#2c9c46" },
  qtyNumber: { marginHorizontal: 12, fontSize: 16, fontWeight: "600" },

  // Remove
  removeText: { color: "#ef4444", fontWeight: "600", marginTop: 8 },

  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 40,
  },

  // Sticky Footer
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 6,
    elevation: 10,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalText: { fontSize: 18, fontWeight: "600", color: "#222" },
  totalAmount: { fontSize: 20, fontWeight: "700", color: "#2c9c46" },
  checkoutBtn: {
    backgroundColor: "#2c9c46",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
