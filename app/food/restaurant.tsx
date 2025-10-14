import CartPreview from "@/components/Common/CartPreview";
import { useCart } from "@/context/CartContext";
import { useLiked } from "@/context/LikedContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 250;
const STICKY_HEADER_HEIGHT = 70;
const TAB_KEYS = ["menu", "about", "reviews", "gallery"] as const;
type TabKey = (typeof TAB_KEYS)[number];

export default function RestaurantDetailsScreen() {
  const router = useRouter();
  const { restaurant } = useLocalSearchParams<{ restaurant: string }>();
  const parsedRestaurant =
    typeof restaurant === "string" ? JSON.parse(restaurant) : restaurant;

  const { addToCart, cart } = useCart();
  const { toggleLike, isLiked } = useLiked();
  const liked = isLiked(parsedRestaurant.id);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("menu");

  const scrollY = useRef(new Animated.Value(0)).current;
  const pagerRef = useRef<ScrollView | null>(null);
  const verticalRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };

  const categories = [
    { id: "c1", name: "For you", image: "https://www.chocolatesandchai.com/wp-content/uploads/2023/02/Dulce-de-Leche-Lava-Cakes-4.jpg" },
    { id: "c2", name: "Pizza", image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Pizza-3007395.jpg" },
    { id: "c3", name: "Sides", image: "https://img.freepik.com/free-photo/fresh-gourmet-meat-appetizer-wooden-plate-generative-ai_188544-7823.jpg?semt=ais_hybrid&w=740&q=80" },
    { id: "c4", name: "Desserts", image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hlZXNlY2FrZXxlbnwwfHwwfHx8MA%3D%3D" },
  ];

  const groupedMenu: Record<string, Array<any>> = {
    Recommended: [
      {
        id: `${parsedRestaurant.id}-r1`,
        name: "Classic Cheese Burger",
        price: 249,
        description: "Juicy beef patty with melted cheese and house sauce",
        image: "https://i0.wp.com/binjalsvegkitchen.com/wp-content/uploads/2015/06/Veggie-Burger-H1.jpg?fit=600%2C900&ssl=1",
      },
      {
        id: `${parsedRestaurant.id}-r2`,
        name: "Crispy Chicken Wrap",
        price: 199,
        description: "Crispy chicken, veggies, and mayo in a soft tortilla",
        image: "https://www.dontgobaconmyheart.co.uk/wp-content/uploads/2019/12/crispy-chicken-wraps.jpg",
      },
    ],
    Pizza: [
      {
        id: `${parsedRestaurant.id}-p1`,
        name: "Veggie Supreme Pizza",
        price: 349,
        description: "Loaded with olives, capsicum, and mozzarella",
        image: "https://pizzamodo.com/wp-content/uploads/2023/10/Veg-Supreme-Pizza.jpg",
      },
      {
        id: `${parsedRestaurant.id}-p2`,
        name: "Pepperoni Pizza",
        price: 399,
        description: "Classic pepperoni with mozzarella cheese",
        image: "https://www.moulinex-me.com/medias/?context=bWFzdGVyfHJvb3R8MTQzNTExfGltYWdlL2pwZWd8YUdObEwyaG1aQzh4TlRrMk9EWXlOVGM0TmpreE1DNXFjR2N8MmYwYzQ4YTg0MTgzNmVjYTZkMWZkZWZmMDdlMWFlMjRhOGIxMTQ2MTZkNDk4ZDU3ZjlkNDk2MzMzNDA5OWY3OA",
      },
    ],
    Sides: [
      {
        id: `${parsedRestaurant.id}-s1`,
        name: "Garlic Bread Sticks",
        price: 99,
        description: "Crispy bread sticks with garlic butter",
        image: "https://cdn.uengage.io/uploads/5/image-453579-1730099592.jpeg",
      },
    ],
    Desserts: [
      {
        id: `${parsedRestaurant.id}-d1`,
        name: "Chocolate Lava Cake",
        price: 129,
        description: "Warm molten chocolate cake with gooey center",
        image: "https://www.chocolatesandchai.com/wp-content/uploads/2023/02/Dulce-de-Leche-Lava-Cakes-4.jpg",
      },
    ],
  };

  const onAddToCart = (item: any) => {
    const exists = cart.find((c) => c.id === item.id);
    if (exists) return; // prevent duplicates
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      type: "food",
    });
  };

  const openItem = (item: any) =>
    router.push({
      pathname: "/food/item",
      params: {
        item: JSON.stringify(item),
        restaurant: JSON.stringify(parsedRestaurant),
      },
    });

  const onTabPress = (index: number) => {
    setActiveTab(TAB_KEYS[index]);
    pagerRef.current?.scrollTo({ x: index * width, animated: true });
    verticalRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  const onPagerMomentum = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveTab(TAB_KEYS[page]);
  };

  const onShare = async () => {
    try {
      await Share.share({
        title: parsedRestaurant.name,
        message: `${parsedRestaurant.name} • ${parsedRestaurant.offer || ""}`,
      });
    } catch {
      console.log("Share not available");
    }
  };

  const renderMenuItem = ({ item }: { item: any }) => {
    const inCart = !!cart.find((c) => c.id === item.id);
    return (
      <TouchableOpacity
        style={styles.menuItemRow}
        onPress={() => openItem(item)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.image }} style={styles.menuThumb} />
        <View style={{ flex: 1 }}>
          <Text style={styles.menuTitle}>{item.name}</Text>
          <Text style={styles.menuDesc} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.menuPrice}>₹{item.price}</Text>
        </View>
        <TouchableOpacity
          disabled={inCart}
          style={[styles.addBtn, inCart && styles.addedBtn]}
          onPress={() => onAddToCart(item)}
        >
          <Text style={[styles.addBtnText, inCart && styles.addedBtnText]}>
            {inCart ? "Added" : "Add"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - STICKY_HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT + STICKY_HEADER_HEIGHT],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Header Image */}
      <Animated.Image
        source={{ uri: parsedRestaurant.image.uri }}
        style={[styles.headerImage, { opacity: headerOpacity }]}
      />

      {/* Sticky Top Header */}
      <Animated.View
        style={[
          styles.headerOverlay,
          {
            transform: [{ translateY: headerTranslate }],
          },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconCircle}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() =>
                toggleLike({
                  id: parsedRestaurant.id,
                  name: parsedRestaurant.name,
                  image: parsedRestaurant.image.uri,
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

            <TouchableOpacity onPress={onShare} style={styles.iconCircle}>
              <Ionicons name="share-social-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Scrollable content */}
      <Animated.ScrollView
        ref={verticalRef}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + 10,
          paddingBottom: 120,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Restaurant Info */}
        <View style={styles.cardContainer}>
          <View style={styles.centerCard}>
            <Image
              source={{
                uri: parsedRestaurant.logo || parsedRestaurant.image.uri,
              }}
              style={styles.logo}
            />
            <View style={styles.cardText}>
              <Text style={styles.title}>{parsedRestaurant.name}</Text>
              <Text style={styles.subtitle}>
                {parsedRestaurant.category} · {parsedRestaurant.price}
              </Text>
              <Text style={styles.small}>
                ⭐ {parsedRestaurant.rating} · {parsedRestaurant.deliveryTime} ·{" "}
                {parsedRestaurant.distance}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {TAB_KEYS.map((t, idx) => (
            <TouchableOpacity
              key={t}
              onPress={() => onTabPress(idx)}
              style={styles.tabButton}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === t && styles.tabTextActive,
                ]}
              >
                {t.toUpperCase()}
              </Text>
              {activeTab === t && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab content */}
        <ScrollView
          horizontal
          pagingEnabled
          ref={pagerRef}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onPagerMomentum}
        >
          {/* MENU */}
          <View style={{ width }}>
            <FlatList
              data={categories}
              keyExtractor={(c) => c.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesRow}
              renderItem={({ item }) => (
                <View style={styles.catCard}>
                  <Image source={{ uri: item.image }} style={styles.catImage} />
                  <Text style={styles.catTitle}>{item.name}</Text>
                </View>
              )}
            />
            {Object.keys(groupedMenu).map((section) => (
              <View key={section} style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>{section}</Text>
                <FlatList
                  data={groupedMenu[section]}
                  keyExtractor={(it) => it.id}
                  renderItem={renderMenuItem}
                  scrollEnabled={false}
                />
              </View>
            ))}
          </View>

          {/* ABOUT */}
          <View style={{ width, padding: 16 }}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>
              {parsedRestaurant.description ||
                "Delicious food served with love. Fresh ingredients, great service."}
            </Text>
          </View>

          {/* REVIEWS */}
          <View style={{ width, padding: 16 }}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <Text style={styles.placeholder}>No reviews yet</Text>
          </View>

          {/* GALLERY */}
          <View style={{ width, padding: 12 }}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <FlatList
              horizontal
              data={[parsedRestaurant.image.uri]}
              keyExtractor={(i, idx) => idx.toString()}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.galleryImage} />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12 }}
            />
          </View>
        </ScrollView>
      </Animated.ScrollView>

      {/* Floating Cart */}
      <CartPreview />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerImage: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: HEADER_HEIGHT,
    resizeMode: "cover",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: STICKY_HEADER_HEIGHT + StatusBar.currentHeight!,
    paddingTop: StatusBar.currentHeight,
    justifyContent: "center",
    zIndex: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  iconCircle: {
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 8,
    borderRadius: 22,
  },
  cardContainer: {
    alignItems: "center",
    marginTop: -60,
    paddingHorizontal: 12,
  },
  centerCard: {
    width: "98%",
    backgroundColor: "#fff",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    elevation: 8,
  },
  logo: { width: 84, height: 84, borderRadius: 12, marginRight: 12 },
  cardText: { flex: 1 },
  title: { fontSize: 18, fontWeight: "800", color: "#111" },
  subtitle: { color: "#555", marginTop: 6 },
  small: { color: "#777", marginTop: 4 },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tabButton: { alignItems: "center", paddingVertical: 12, width: width / 4 },
  tabText: { color: "#666", fontWeight: "600" },
  tabTextActive: { color: "#2C9C46" },
  tabIndicator: {
    height: 3,
    backgroundColor: "#2C9C46",
    width: 40,
    marginTop: 6,
    borderRadius: 2,
  },
  categoriesRow: { paddingHorizontal: 12, paddingVertical: 10 },
  catCard: {
    width: 90,
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    elevation: 4,
  },
  catImage: { width: 64, height: 64, borderRadius: 10, marginBottom: 6 },
  catTitle: { fontSize: 13, fontWeight: "700" },
  sectionBlock: { paddingTop: 8, paddingBottom: 8 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 12,
    marginVertical: 8,
  },
  menuItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  menuThumb: { width: 80, height: 80, borderRadius: 10, marginRight: 12 },
  menuTitle: { fontWeight: "700", fontSize: 15 },
  menuDesc: { color: "#666", marginTop: 4 },
  menuPrice: { marginTop: 6, fontWeight: "700" },
  addBtn: {
    backgroundColor: "#2C9C46",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addBtnText: { color: "#fff", fontWeight: "700" },
  addedBtn: {
    backgroundColor: "#E5E7EB",
  },
  addedBtnText: {
    color: "#444",
  },
  galleryImage: { width: 220, height: 140, borderRadius: 8, marginRight: 8 },
  aboutText: { fontSize: 15, color: "#444", lineHeight: 22 },
  placeholder: { color: "#777" },
});
