// app/checkout/CheckoutScreen.tsx
import { useCart } from "@/context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart } = useCart();
  const { cartType } = useLocalSearchParams<{ cartType: string }>();
  const type = cartType === "shopping" ? "shopping" : "food";

  const items = cart.filter((i) => i.type === type);
  const [selectedAddress, setSelectedAddress] = useState(
    "123 Main Street, City"
  );
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "upi">(
    "cod"
  );

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const getTypeColor = (type: "food" | "shopping") =>
    type === "food" ? "#2c9c46" : "#3b82f6";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f5f8" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout ({type.toUpperCase()})</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Items Summary */}
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {items.map((item) => (
          <View
            key={item.id}
            style={[styles.itemCard, { borderColor: getTypeColor(item.type) }]}
          >
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              <Text style={styles.itemPrice}>
                ₹{item.price * item.quantity}
              </Text>
            </View>
          </View>
        ))}

        {/* Delivery Address */}
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TouchableOpacity
          style={styles.addressCard}
          onPress={() => alert("Open address selector")}
        >
          <Ionicons name="location-outline" size={24} color="#2c9c46" />
          <Text style={styles.addressText}>{selectedAddress}</Text>
          <Ionicons name="chevron-forward" size={22} color="#777" />
        </TouchableOpacity>

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentRow}>
          {["cod", "card", "upi"].map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.paymentCard,
                paymentMethod === method && {
                  borderColor: getTypeColor(type),
                  borderWidth: 2,
                },
              ]}
              onPress={() => setPaymentMethod(method as "cod" | "card" | "upi")}
            >
              <Text style={styles.paymentText}>
                {method === "cod"
                  ? "Cash on Delivery"
                  : method === "card"
                  ? "Card"
                  : "UPI"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.checkoutBtn}>
        <Text style={styles.checkoutText}>Pay ₹{total} & Place Order</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f5f8" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#222" },

  sectionTitle: { fontSize: 18, fontWeight: "700", marginVertical: 12 },

  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  itemImage: { width: 80, height: 80, borderRadius: 12 },
  itemName: { fontWeight: "700", fontSize: 16, color: "#222" },
  itemQuantity: { fontSize: 14, color: "#555", marginTop: 4 },
  itemPrice: {
    fontWeight: "700",
    fontSize: 15,
    marginTop: 4,
    color: "#2c9c46",
  },

  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    justifyContent: "space-between",
  },
  addressText: { flex: 1, marginHorizontal: 8, color: "#444", fontSize: 15 },

  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  paymentCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  paymentText: { fontWeight: "600", fontSize: 14, color: "#222" },

  checkoutBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 20,
  },
  checkoutText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
