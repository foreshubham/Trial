// components/Common/CartPreview.tsx
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CartPreview() {
  const { cart, total } = useCart();
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);
  const router = useRouter();

  if (itemCount === 0) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push("/cart")}
    >
      <View>
        <Text style={styles.count}>
          {itemCount} item{itemCount > 1 ? "s" : ""}
        </Text>
        <Text style={styles.total}>₹{total.toFixed(0)}</Text>
      </View>
      <View style={styles.btn}>
        <Text style={styles.btnText}>View Cart</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 26,
    left: 16,
    right: 16,
    backgroundColor: "#666666ff",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 10,
  },
  count: { color: "#fff", fontWeight: "700" },
  total: { color: "#fff", opacity: 0.8, marginTop: 2 },
  btn: {
    backgroundColor: "#2C9C46",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnText: { color: "#fff", fontWeight: "800" },
});
