import ShoppingFilters from "@/components/Shopping/Filters/ShopFilter";
import { useCart } from "@/context/CartContext";
import { menuData } from "@/data/menu.data";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

export default function CategoryItemsScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const { addToCart } = useCart();

  const [activeFilter, setActiveFilter] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [specialRequest, setSpecialRequest] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const sheetAnim = useRef(new Animated.Value(height)).current;

  const showBottomSheet = (item: any) => {
    setSelectedItem(item);
    setQuantity(1);
    setSpecialRequest("");
    setSelectedAddons([]);
    setIsSheetVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(sheetAnim, {
        toValue: height * 0.15,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideBottomSheet = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(sheetAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsSheetVisible(false);
      setSelectedItem(null);
    });
  };

  // Fetch category items
  const categoryItems = useMemo(
    () => (category ? menuData[category] || [] : []),
    [category]
  );

  const filteredItems = useMemo(() => {
    let items = [...categoryItems];
    switch (activeFilter) {
      case "Trending":
        items.sort((a, b) => b.rating - a.rating);
        break;
      case "Top Rated":
        items = items.filter((i) => i.rating >= 4.5);
        break;
      case "Under 200":
        items = items.filter((i) => i.price < 200);
        break;
      case "Under 30 mins":
        items = items.filter((i) => i.time <= 30);
        break;
    }
    return items;
  }, [activeFilter, categoryItems]);

  const handleShare = async (item: any) => {
    try {
      await Share.share({
        message: `Check out ${item.name}! 🍴 Price: ₹${item.price}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const toggleAddon = (addon: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => showBottomSheet(item)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          ⭐ {item.rating} · ⏱ {item.time} mins
        </Text>
        <Text numberOfLines={2} style={styles.desc}>
          {item.description}
        </Text>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cartButton}
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
              <Ionicons name="cart-outline" size={18} color="white" />
              <Text style={styles.cartText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleShare(item)}>
              <Ionicons name="share-social-outline" size={22} color="#2c9c49" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filters = [
    { label: "Trending", onPress: () => setActiveFilter("Trending") },
    { label: "Top Rated", onPress: () => setActiveFilter("Top Rated") },
    { label: "Under 200", onPress: () => setActiveFilter("Under 200") },
    { label: "Under 30 mins", onPress: () => setActiveFilter("Under 30 mins") },
  ];

  const addons = selectedItem?.addons || [
    "Extra Cheese",
    "Extra Spicy",
    "No Onion",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2c9c49" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
        <TouchableOpacity onPress={() => router.push("/cart")}>
          <Ionicons name="cart-outline" size={26} color="#000000ff" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ShoppingFilters filters={filters} />

      {/* Items */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No items found in {category} category.
          </Text>
        }
      />

      {/* Dimmed Overlay */}
      {isSheetVisible && (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <Pressable style={{ flex: 1 }} onPress={hideBottomSheet} />
        </Animated.View>
      )}

      {/* Bottom Sheet */}
      {selectedItem && (
        <Animated.View
          style={[
            styles.bottomSheet,
            { transform: [{ translateY: sheetAnim }] },
          ]}
        >
          <View style={styles.sheetHandle} />
          <Image
            source={{ uri: selectedItem.image }}
            style={styles.sheetImage}
          />
          <View style={styles.sheetContent}>
            <Text style={styles.sheetTitle}>{selectedItem.name}</Text>
            <Text style={styles.sheetMeta}>
              ⭐ {selectedItem.rating} · ⏱ {selectedItem.time} mins
            </Text>
            <Text style={styles.sheetDesc}>{selectedItem.description}</Text>

            {/* Quantity */}
            <View style={styles.quantityRow}>
              <Text style={styles.label}>Quantity:</Text>
              <View style={styles.qtyControls}>
                <TouchableOpacity
                  onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  style={styles.qtyBtn}
                >
                  <Text>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{quantity}</Text>
                <TouchableOpacity
                  onPress={() => setQuantity((prev) => prev + 1)}
                  style={styles.qtyBtn}
                >
                  <Text>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Cooking Requests */}
            <Text style={styles.label}>Special Requests:</Text>
            <TextInput
              value={specialRequest}
              onChangeText={setSpecialRequest}
              placeholder="e.g., Less salt, extra spicy"
              style={styles.input}
            />

            {/* Add-ons */}
            <Text style={[styles.label, { marginTop: 10 }]}>Add-ons:</Text>
            <View style={styles.addonsRow}>
              {addons.map((addon) => (
                <TouchableOpacity
                  key={addon}
                  style={[
                    styles.addonChip,
                    selectedAddons.includes(addon) && styles.addonSelected,
                  ]}
                  onPress={() => toggleAddon(addon)}
                >
                  <Text
                    style={{
                      color: selectedAddons.includes(addon)
                        ? "#fff"
                        : "#2c9c49",
                      fontWeight: "600",
                    }}
                  >
                    {addon}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Add to Cart */}
            <TouchableOpacity
              style={styles.sheetAddBtn}
              onPress={() => {
                addToCart({
                  id: selectedItem.id,
                  name: selectedItem.name,
                  price: selectedItem.price,
                  image: selectedItem.image,
                  quantity,
                  addons: selectedAddons,
                  specialRequest,
                  type: "food",
                });
                hideBottomSheet();
              }}
            >
              <Ionicons name="cart" size={18} color="#fff" />
              <Text style={styles.sheetAddText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 14,
    marginVertical: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 110,
    height: 110,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  details: { flex: 1, padding: 10, justifyContent: "space-between" },
  name: { fontSize: 16, fontWeight: "700", color: "#222" },
  meta: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  desc: { fontSize: 12, color: "#6b6b6b", marginTop: 4 },
  price: { fontSize: 15, color: "#2c9c49", fontWeight: "700" },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actions: { flexDirection: "row", alignItems: "center", gap: 10 },
  cartButton: {
    backgroundColor: "#2c9c49",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 5,
  },
  cartText: { color: "#fff", fontWeight: "600" },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
    fontSize: 15,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    height: height * 0.85,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  sheetHandle: {
    width: 60,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginVertical: 10,
  },
  sheetImage: {
    width: "100%",
    height: 220,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetContent: { padding: 18 },
  sheetTitle: { fontSize: 20, fontWeight: "700", color: "#222" },
  sheetMeta: { fontSize: 13, color: "#777", marginVertical: 5 },
  sheetDesc: { fontSize: 14, color: "#555", marginBottom: 16 },
  quantityRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "600", color: "#444", marginRight: 10 },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  qtyBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  qtyText: { paddingHorizontal: 12, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  addonsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  addonChip: {
    borderWidth: 1,
    borderColor: "#2c9c49",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addonSelected: { backgroundColor: "#2c9c49" },
  sheetAddBtn: {
    backgroundColor: "#2c9c49",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    marginTop: 16,
    justifyContent: "center",
  },
  sheetAddText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
