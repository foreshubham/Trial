// src/screens/shopping/SubCategoryItemsScreen.tsx
import { outfitData } from "@/data/outfit.data";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Platform,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const windowWidth = Dimensions.get("window").width;
const cardMargin = 10;
const numColumns = 2;
const cardWidth = (windowWidth - cardMargin * (numColumns + 1)) / numColumns;

export default function SubCategoryItemsScreen() {
  const { subCategoryName } = useLocalSearchParams <{ subCategoryName: string }>();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  // Filter data based on subcategory
  const filteredData = useMemo(() => {
    if (!subCategoryName) return [];
    const key = subCategoryName.toLowerCase();
    return outfitData.filter(
      (item) =>
        item.category.toLowerCase().includes(key) ||
        item.name.toLowerCase().includes(key) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(key))
    );
  }, [subCategoryName]);

  const paginatedData = filteredData.slice(0, page * 6);

  const handleLoadMore = () => {
    if (paginatedData.length >= filteredData.length || loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setLoadingMore(false);
    }, 800);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const toggleLike = (id: string) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const renderItem = ({ item }: { item: typeof outfitData[0] }) => {
    const isLiked = likedItems.has(item.id);
    const discount = Math.floor(((item.mrp - item.price) / item.mrp) * 100);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() =>
          router.push({
            pathname: "/shopping/productDetails",
            params: { product: JSON.stringify(item) },
          })
        }
      >
        <View style={styles.imageWrapper}>
          <Image source={item.image} style={styles.image} resizeMode="cover" />

          <View style={styles.ratingPill}>
            <Text style={styles.ratingText}>
              {item.rating.toFixed(1)} | {item.numberOfRatings}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => toggleLike(item.id)}
            style={styles.heartIcon}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={22}
              color={isLiked ? "#ef4444" : "#ffffffcc"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.subHeading} numberOfLines={1}>
            {item.description || "Trendy & Stylish"}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>
            <Text style={styles.mrp}>₹{item.mrp}</Text>
            <Text style={styles.discount}>{discount}% OFF</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!subCategoryName) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No Subcategory selected</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{subCategoryName}</Text>
        <View style={styles.headerRight}>
          <Ionicons
            name="heart"
            size={26}
            color="#ef4444"
            style={{ marginRight: 15 }}
          />
          <MaterialIcons
            name="shopping-bag"
            size={26}
            color="#000"
            onPress={() => router.push("/shopping")}
          />
        </View>
      </View>

      <FlatList
        data={paginatedData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          loadingMore ? <ActivityIndicator size="small" color="#2C9C46" /> : null
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text>No items found</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? 1 : 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginLeft: 10,
    color: "#222",
  },
  headerRight: { flexDirection: "row", alignItems: "center" },
  row: { justifyContent: "space-between", marginBottom: 12, paddingHorizontal: 12 },
  card: {
    backgroundColor: "#fafafa",
    borderRadius: 14,
    width: cardWidth,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    overflow: "hidden",
    marginTop: 10,
  },
  imageWrapper: { width: "100%", height: 160, backgroundColor: "#f0f0f0", position: "relative" },
  image: { width: "100%", height: "100%", borderTopLeftRadius: 14, borderTopRightRadius: 14 },
  ratingPill: { position: "absolute", top: 8, left: 8, backgroundColor: "#ffffffdd", paddingVertical: 2, paddingHorizontal: 6, borderRadius: 10 },
  ratingText: { fontSize: 11, fontWeight: "600", color: "#333" },
  heartIcon: { position: "absolute", top: 8, right: 8, backgroundColor: "#00000050", borderRadius: 16, padding: 4 },
  info: { paddingHorizontal: 8, paddingTop: 6, paddingBottom: 6 },
  name: { fontSize: 14, fontWeight: "700", color: "#222", marginBottom: 2 },
  subHeading: { fontSize: 12, color: "#666", marginBottom: 4 },
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  price: { fontSize: 15, fontWeight: "700", color: "#2c9c46", marginRight: 6 },
  mrp: { fontSize: 13, color: "#888", textDecorationLine: "line-through", marginRight: 6 },
  discount: { fontSize: 13, color: "#ef4444", fontWeight: "600" },
  emptyContainer: { padding: 20, alignItems: "center" },
});
