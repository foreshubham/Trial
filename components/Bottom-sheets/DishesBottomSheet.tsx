import { useCart } from "@/context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ItemBottomSheet({ item, onClose }: any) {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["60%", "90%"], []);
  const { addToCart } = useCart();

  const handleClose = useCallback(() => {
    sheetRef.current?.close();
    onClose();
  }, [onClose]);

  if (!item) return null;

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={{ backgroundColor: "#ccc" }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.price}>₹{item.price}</Text>
              <Text style={styles.rating}>⭐ {item.rating}</Text>
              <Text style={styles.time}>⏱ {item.time} min</Text>
            </View>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={() =>
            addToCart({
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: 1,
              type: "food",
            })
          }
        >
          <Text style={styles.addToCartText}>Add to Cart • ₹{item.price}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 220,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  closeBtn: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 6,
    borderRadius: 20,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    gap: 10,
  },
  price: {
    fontSize: 18,
    color: "#16a34a",
    fontWeight: "600",
  },
  rating: {
    fontSize: 16,
    color: "#facc15",
  },
  time: {
    fontSize: 14,
    color: "#6b7280",
  },
  category: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  addToCartBtn: {
    backgroundColor: "#16a34a",
    paddingVertical: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
