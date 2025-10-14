// src/components/Shop/CategoryItems.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router"; // Expo Router
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type CategoryKey = "All" | "Men" | "Women" | "Kids";

type SubCategory = {
  name: string;
  image: string | ImageSourcePropType;
};

const mainCategories: CategoryKey[] = ["All", "Men", "Women", "Kids"];
const categoryBackgrounds: Record<CategoryKey, string> = {
  All: "#c8e6c9",
  Men: "#dcedc8",
  Women: "#f0f4c3",
  Kids: "#e0f2f1",
};

const subCategoryMap: Record<CategoryKey, SubCategory[]> = {
  All: [
    { name: "Fashion", image: require("@/assets/shopping/s2.jpg") },
    { name: "Beauty", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" },
    { name: "Home & Living", image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=80" },
    { name: "Footwear", image: "https://images.unsplash.com/photo-1519741494485-95a38c13e6d8?auto=format&fit=crop&w=800&q=80" },
    { name: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" },
  ],
  Men: [
    { name: "Shirts", image: require("@/assets/shopping/s1.webp") },
    { name: "T-Shirts", image: require("@/assets/shopping/puma.jpg") },
    { name: "Jeans", image: require("@/assets/shopping/l1.webp") },
    { name: "Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80" },
  ],
  Women: [
    { name: "Dresses", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80" },
    { name: "Makeup", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80" },
    { name: "Handbags", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" },
    { name: "Heels", image: "https://images.unsplash.com/photo-1491933387335-cd616b35c91b?auto=format&fit=crop&w=800&q=80" },
  ],
  Kids: [
    { name: "Toys", image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80" },
    { name: "Clothes", image: "https://images.unsplash.com/photo-1520962913295-b2e2b522cb7d?auto=format&fit=crop&w=800&q=80" },
    { name: "Books", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80" },
    { name: "Games", image: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=800&q=80" },
  ],
};

const windowWidth = Dimensions.get("window").width;
const cardWidth = windowWidth * 0.28;
const cardHeight = 120;

const CategoryNavigation: React.FC = () => {
  const router = useRouter(); // Expo Router
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("All");
  const [searchText, setSearchText] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const subCategories = subCategoryMap[selectedCategory];

  const filteredSubCategories = useMemo(() => {
    if (!searchText.trim()) return subCategories;
    const lowerSearch = searchText.toLowerCase();
    return subCategories.filter((sub) => sub.name.toLowerCase().includes(lowerSearch));
  }, [searchText, subCategories]);

  const handleSubCategoryPress = (subCategoryName: string) => {
    // Navigate using Expo Router
    router.push(`/shopping/subcategory?subCategoryName=${encodeURIComponent(subCategoryName)}`);
  };

  return (
    <LinearGradient colors={[categoryBackgrounds[selectedCategory], "#ffffff"]} style={styles.container}>
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            placeholder="What are you styling?"
            style={styles.searchInput}
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <View style={styles.searchDivider} />
      </View>

      <View style={styles.navContainer}>
        <View style={styles.mainCategoryRow}>
          {mainCategories.map((category: CategoryKey) => (
            <TouchableOpacity
              key={category}
              onPress={() => {
                setSelectedCategory(category);
                setSearchText("");
                setSelectedSubCategory(null);
              }}
              style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
            >
              <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.menuButton} onPress={() => alert("Menu clicked")}>
          <View style={styles.iconPlaceholder}>
            <Text style={{ color: "#fff" }}>☰</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subcategoryScrollContainer}
      >
        {filteredSubCategories.length > 0 ? (
          filteredSubCategories.map((category: SubCategory) => (
            <TouchableOpacity
              key={category.name}
              style={[styles.subcategoryCard, selectedSubCategory === category.name && styles.subcategoryCardActive]}
              activeOpacity={0.85}
              onPress={() => {
                setSelectedSubCategory(category.name);
                handleSubCategoryPress(category.name);
              }}
            >
              <Image
                source={typeof category.image === "string" ? { uri: category.image } : category.image}
                style={styles.image}
              />
              <View style={styles.subcategoryTextContainer}>
                <Text style={styles.subcategoryName}>{category.name}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={{ justifyContent: "center", alignItems: "center", padding: 20 }}>
            <Text style={{ color: "#777", fontSize: 14 }}>No subcategories found</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default CategoryNavigation;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 12, paddingTop: 20 },
  searchWrapper: { marginHorizontal: 12, marginBottom: 6, paddingTop: 10 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16, color: "#333" },
  searchDivider: { marginTop: 12, height: 1, backgroundColor: "#00000021" },
  navContainer: { flexDirection: "row", marginBottom: 12, justifyContent: "space-between", alignItems: "center" },
  mainCategoryRow: { flexDirection: "row", flex: 1, justifyContent: "space-around" },
  categoryButton: { paddingBottom: 4 },
  categoryButtonActive: { borderBottomWidth: 2, borderBottomColor: "#ec4899" },
  categoryText: { fontSize: 15, fontWeight: "600", color: "#1f2937" },
  categoryTextActive: { color: "#ec4899" },
  menuButton: { marginLeft: 12, padding: 8, backgroundColor: "#111827", borderRadius: 16 },
  iconPlaceholder: { width: 20, height: 20, alignItems: "center", justifyContent: "center" },
  subcategoryScrollContainer: { paddingVertical: 8, paddingRight: 8 },
  subcategoryCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    width: cardWidth,
    height: cardHeight,
    marginRight: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  subcategoryCardActive: { borderWidth: 2, borderColor: "#ec4899" },
  image: { width: "100%", height: cardHeight * 0.55, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  subcategoryTextContainer: {
    height: cardHeight * 0.25,
    backgroundColor: "rgba(212, 243, 255, 0.42)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  subcategoryName: { fontWeight: "500", fontSize: 13, color: "#1f2937", textAlign: "center" },
});
