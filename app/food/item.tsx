// app/food/item.tsx
import { useCart } from "@/context/CartContext";
import { useLiked } from "@/context/LikedContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ItemDetailsScreen() {
  const { item, restaurant } = useLocalSearchParams<{
    item: string;
    restaurant?: string;
  }>();
  const parsedItem = typeof item === "string" ? JSON.parse(item) : item;
  const parsedRestaurant = restaurant ? JSON.parse(restaurant) : null;

  const { addToCart } = useCart();
  const { toggleLike, isLiked } = useLiked();
  const liked = isLiked(parsedItem.id);

  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [addons, setAddons] = useState<string[]>([]);
  const [request, setRequest] = useState<string>("");

  const sampleAddons = [
    "Extra Cheese",
    "Spicy Sauce",
    "Garlic Bread",
    "Soft Drink",
  ];

  const handleShare = async () => {
    try {
      await Share.share({
        title: parsedItem.name,
        message: `${parsedItem.name} from ${parsedRestaurant?.name || ""}`,
      });
    } catch {
      Alert.alert("Error", "Unable to share this item.");
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: parsedItem.id,
      name: parsedItem.name,
      price: parsedItem.price,
      quantity: 1,
      image: parsedItem.image,
      type: "food",
      extras: addons,
      request,
    });
    Alert.alert(
      "Added to cart",
      `${parsedItem.name} has been added to your cart.`
    );
  };

  const toggleAddon = (addon: string) => {
    setAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconCircle}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text numberOfLines={1} style={styles.headerTitle}>
            {parsedItem.name}
          </Text>
          {parsedRestaurant && (
            <Text numberOfLines={1} style={styles.headerSubtitle}>
              {parsedRestaurant.name}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() =>
            toggleLike({
              id: parsedItem.id,
              name: parsedItem.name,
              image: parsedItem.image,
              type: "food",
            })
          }
          style={styles.iconCircle}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={22}
            color={liked ? "#FF4B4B" : "#fff"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShare} style={styles.iconCircle}>
          <Ionicons name="share-social-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Image source={{ uri: parsedItem.image }} style={styles.image} />

        <View style={{ padding: 16 }}>
          <Text style={styles.title}>{parsedItem.name}</Text>
          <Text style={styles.price}>₹{parsedItem.price}</Text>
          <Text style={styles.desc}>{parsedItem.description}</Text>

          {/* Add-ons */}
          <Text style={styles.sectionTitle}>Complimentary Add-ons</Text>
          <FlatList
            data={sampleAddons}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ marginVertical: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => toggleAddon(item)}
                style={[
                  styles.addonChip,
                  addons.includes(item) && { backgroundColor: "#10B981" },
                ]}
              >
                <Text
                  style={{ color: addons.includes(item) ? "#fff" : "#444" }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* Cooking Request */}
          <Text style={styles.sectionTitle}>Cooking Request (Optional)</Text>
          <TextInput
            value={request}
            onChangeText={setRequest}
            placeholder="E.g., less salt, extra crispy"
            style={styles.requestInput}
          />

          {/* Add to Cart Button */}
          <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
            <Ionicons name="cart" size={18} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 8, fontWeight: "700" }}>
              Add to cart
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 70 + StatusBar.currentHeight!,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  headerTitle: { color: "#fff", fontWeight: "800", fontSize: 16 },
  headerSubtitle: { color: "#fff", fontSize: 12 },
  iconCircle: {
    marginLeft: 8,
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 8,
    borderRadius: 22,
  },
  image: { width: "100%", height: 260, resizeMode: "cover" },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 8, marginTop: 12 },
  price: { fontSize: 20, color: "#10B981", fontWeight: "800", marginBottom: 8 },
  desc: { color: "#666", lineHeight: 22 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  addonChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    marginRight: 10,
  },
  requestInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
    color: "#111",
  },
  addBtn: {
    marginTop: 10,
    backgroundColor: "#10B981",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
