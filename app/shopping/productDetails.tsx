// app/shopping/ProductScreen.tsx
import ProductDetails from "@/components/Shopping/Item/ProductDetails";
import ProductReviews from "@/components/Shopping/Item/ReviewSection";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics"; // ✅ Added Haptics
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCart } from "@/context/CartContext";
import { useLiked } from "@/context/LikedContext";

const { width: windowWidth } = Dimensions.get("window");

type Product = {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  mrp: number;
  rating: number;
  numberOfRatings: number;
  images: any[];
  tags?: string[];
  sizes?: string[];
  colors?: { name: string; hex: string; image?: any }[];
  material?: string;
  care?: string;
  delivery?: string;
  reviews?: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    comment: string;
  }[];
};

export default function ProductScreen() {
  const router = useRouter();
  const { product } = useLocalSearchParams<{ product: string }>();
  const parsedProduct: Product | null = product ? JSON.parse(product) : null;

  const { addToCart, cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const { toggleLike, isLiked } = useLiked();

  const [liked, setLiked] = useState(
    parsedProduct ? isLiked(parsedProduct.id) : false
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(
    parsedProduct?.colors?.[0] || null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeChartVisible, setSizeChartVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Animation refs
  const flyAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const flyOpacity = useRef(new Animated.Value(0)).current;

  if (!parsedProduct) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No Product Found!</Text>
      </SafeAreaView>
    );
  }

  const discount = Math.floor(
    ((parsedProduct.mrp - parsedProduct.price) / parsedProduct.mrp) * 100
  );

  const mainImage = selectedColor?.image
    ? selectedColor.image
    : parsedProduct.images?.[0] ?? require("@/assets/shopping/l1.webp");

  const relatedProducts = [
    {
      id: "1",
      name: "Product A",
      price: 499,
      image: "https://via.placeholder.com/150",
    },
    {
      id: "2",
      name: "Product B",
      price: 699,
      image: "https://via.placeholder.com/150",
    },
    {
      id: "3",
      name: "Product C",
      price: 899,
      image: "https://via.placeholder.com/150",
    },
  ];

  const handleRelatedProductPress = (item: any) => {
    router.push({
      pathname: "/shopping",
      params: { product: JSON.stringify(item) },
    });
  };

  // ✅ Handle Add to Cart with haptic + validation
  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);

    if (parsedProduct.sizes && !selectedSize) {
      Alert.alert("Select Size", "Please select a size before adding to cart.");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setIsAdding(false);
      return;
    }

    addToCart({
      id: parsedProduct.id,
      name: parsedProduct.name,
      price: parsedProduct.price,
      color: selectedColor?.name,
      size: selectedSize ?? undefined,
      quantity,
      image: mainImage,
      type: "shopping",
    });

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    flyAnim.setValue({ x: 0, y: 0 });
    flyOpacity.setValue(1);
    Animated.timing(flyAnim, {
      toValue: { x: windowWidth - 60, y: -400 },
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      flyOpacity.setValue(0);
      setIsAdding(false);
    });
  };

  // ✅ Handle Like button with haptic
  const handleToggleLike = async () => {
    if (!parsedProduct) return;
    toggleLike({
      id: parsedProduct.id,
      name: parsedProduct.name,
      image: mainImage,
      type: "shopping",
    });
    setLiked(!liked);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // ✅ Handle Buy Now with strong vibration
  const handleBuyNow = async () => {
    if (parsedProduct.sizes && !selectedSize) {
      Alert.alert(
        "Select Size",
        "Please select a size before proceeding to buy."
      );
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Order Now", "Buy Now flow coming soon!");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {parsedProduct.name}
        </Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-outline" size={24} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} 
           onPress={() => router.push("/cart")}>
            <Ionicons name="cart-outline" size={24} color="#222" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Image */}
        <Image
          source={
            typeof mainImage === "string" ? { uri: mainImage } : mainImage
          }
          style={styles.mainImage}
          resizeMode="cover"
        />

        {/* Flying Image Animation */}
        <Animated.Image
          source={
            typeof mainImage === "string" ? { uri: mainImage } : mainImage
          }
          style={[
            styles.mainImage,
            {
              position: "absolute",
              top: 0,
              right: 100,
              width: 80,
              height: 80,
              borderRadius: 12,
              opacity: flyOpacity,
              transform: [{ translateX: flyAnim.x }, { translateY: flyAnim.y }],
            },
          ]}
        />

        {/* Like Button */}
        <TouchableOpacity onPress={handleToggleLike} style={styles.likeButton}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={28}
            color={liked ? "#ef4444" : "#fff"}
          />
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.name}>{parsedProduct.name}</Text>
          <Text style={styles.category}>{parsedProduct.category}</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.rating}>
              {parsedProduct.rating.toFixed(1)} ⭐
            </Text>
            <Text style={styles.numberOfRatings}>
              ({parsedProduct.numberOfRatings} ratings)
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{parsedProduct.price}</Text>
            <Text style={styles.mrp}>₹{parsedProduct.mrp}</Text>
            <Text style={styles.discount}>{discount}% OFF</Text>
          </View>

          {/* Color Selector */}
          {parsedProduct.colors && (
            <View style={styles.selectorRow}>
              <Text style={styles.selectorTitle}>Color:</Text>
              <View style={styles.optionsRow}>
                {parsedProduct.colors.map((color) => (
                  <TouchableOpacity
                    key={color.name}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color.hex },
                      selectedColor?.name === color.name &&
                        styles.colorOptionSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Size Selector */}
          {parsedProduct.sizes && (
            <View style={styles.selectorRow}>
              <Text style={styles.selectorTitle}>Size:</Text>
              <View style={styles.optionsRow}>
                {parsedProduct.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.optionButton,
                      selectedSize === size && styles.optionButtonSelected,
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedSize === size && styles.optionTextSelected,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setSizeChartVisible(true)}>
                  <Text style={styles.sizeChartLink}>Size Chart</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Quantity */}
          <View style={styles.selectorRow}>
            <Text style={styles.selectorTitle}>Quantity:</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.cartButtonsRow}>
            <TouchableOpacity
              style={[styles.addToCart, isAdding && { opacity: 0.6 }]}
              onPress={handleAddToCart}
              disabled={isAdding}
            >
              <Text style={styles.addToCartText}>
                {isAdding ? "Adding..." : "Add to Cart"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buyNow} onPress={handleBuyNow}>
              <Text style={styles.buyNowText}>Buy Now</Text>
            </TouchableOpacity>
          </View>

          <ProductDetails />
          <ProductReviews />

          {/* Related Products */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
            Related Products
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {relatedProducts.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.relatedProduct}
                onPress={() => handleRelatedProductPress(item)}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.relatedImage}
                />
                <Text style={styles.relatedName}>{item.name}</Text>
                <Text style={styles.relatedPrice}>₹{item.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Size Chart Modal */}
      <Modal
        visible={sizeChartVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSizeChartVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Size Chart</Text>
            <View style={styles.sizeChartTable}>
              <View style={styles.sizeChartRow}>
                <Text style={styles.sizeChartHeader}>Size</Text>
                <Text style={styles.sizeChartHeader}>Chest</Text>
                <Text style={styles.sizeChartHeader}>Length</Text>
              </View>
              {["S", "M", "L", "XL"].map((size, i) => (
                <View style={styles.sizeChartRow} key={i}>
                  <Text>{size}</Text>
                  <Text>{34 + i * 2} in</Text>
                  <Text>{28 + i} in</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => setSizeChartVisible(false)}
              style={styles.closeModal}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "700", marginLeft: 12 },
  headerIcons: { flexDirection: "row" },
  iconButton: { marginLeft: 16 },
  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  scrollContent: { paddingBottom: 30 },
  mainImage: {
    width: windowWidth,
    height: 400,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  likeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#00000050",
    borderRadius: 24,
    padding: 6,
  },
  info: { padding: 16 },
  name: { fontSize: 24, fontWeight: "700", marginBottom: 6 },
  category: { fontSize: 14, color: "#555", marginBottom: 6 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  rating: { fontSize: 14, fontWeight: "600", color: "#2c9c46", marginRight: 6 },
  numberOfRatings: { fontSize: 13, color: "#666" },
  priceRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  price: { fontSize: 22, fontWeight: "700", color: "#2c9c46", marginRight: 8 },
  mrp: {
    fontSize: 16,
    color: "#888",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discount: { fontSize: 16, fontWeight: "600", color: "#ef4444" },
  selectorRow: { marginBottom: 12 },
  selectorTitle: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  optionsRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center" },
  optionButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 6,
  },
  optionButtonSelected: { borderColor: "#2c9c46", backgroundColor: "#e6f4ea" },
  optionText: { color: "#222", fontSize: 16, fontWeight: "500" },
  optionTextSelected: { color: "#2c9c46", fontWeight: "700" },
  sizeChartLink: { color: "#2c9c46", fontWeight: "700", marginLeft: 10 },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  colorOptionSelected: { borderWidth: 2, borderColor: "#2c9c46" },
  cartButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  addToCart: {
    flex: 1,
    backgroundColor: "#2c9c46",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },
  addToCartText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  buyNow: {
    flex: 1,
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buyNowText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  quantityRow: { flexDirection: "row", alignItems: "center" },
  quantityButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  quantityButtonText: { fontSize: 18, fontWeight: "600" },
  quantityText: { fontSize: 16, fontWeight: "600", marginHorizontal: 10 },
  relatedProduct: { width: 120, marginRight: 12, alignItems: "center" },
  relatedImage: { width: 100, height: 100, borderRadius: 10, marginBottom: 4 },
  relatedName: { fontSize: 13, fontWeight: "600", textAlign: "center" },
  relatedPrice: { fontSize: 13, color: "#2c9c46", textAlign: "center" },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "85%",
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  sizeChartTable: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  sizeChartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sizeChartHeader: { fontWeight: "700" },
  closeModal: {
    marginTop: 16,
    backgroundColor: "#2c9c46",
    borderRadius: 8,
    paddingVertical: 10,
  },
  closeModalText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
