import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ShoppingStore = ({ route, navigation }: any) => {
  const { restaurant } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Top Image */}
      <Image source={restaurant.image} style={styles.heroImage} />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      {/* Restaurant Info */}
      <View style={styles.infoBox}>
        <Text style={styles.title}>{restaurant.name}</Text>
        <Text style={styles.subText}>
          {restaurant.category} • {restaurant.price}
        </Text>
        <Text style={styles.subText}>
          ⭐ {restaurant.rating} • {restaurant.deliveryTime} • {restaurant.distance}
        </Text>

        {restaurant.offer && (
          <Text style={styles.offerText}>{restaurant.offer}</Text>
        )}
        {restaurant.tag && (
          <Text style={styles.tagText}>{restaurant.tag}</Text>
        )}
      </View>

      {/* Menu Section Example */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Popular Dishes</Text>

        {/* Replace with FlatList if you want dynamic menu items */}
        <View style={styles.dishCard}>
          <Image
            source={{
              uri: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/01/paneer-butter-masala-recipe.jpg",
            }}
            style={styles.dishImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.dishName}>Paneer Butter Masala</Text>
            <Text style={styles.dishPrice}>₹220</Text>
          </View>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>ADD</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dishCard}>
          <Image
            source={{
              uri: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/12/biryani-recipe.jpg",
            }}
            style={styles.dishImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.dishName}>Chicken Biryani</Text>
            <Text style={styles.dishPrice}>₹280</Text>
          </View>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>ADD</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  heroImage: { width: "100%", height: 200 },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
  infoBox: { padding: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  subText: { color: "#555", marginTop: 4 },
  offerText: { color: "#10B981", marginTop: 6, fontWeight: "600" },
  tagText: { color: "#f59e0b", marginTop: 2, fontSize: 12 },
  menuSection: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  dishCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fafafa",
    padding: 10,
    borderRadius: 10,
  },
  dishImage: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
  dishName: { fontWeight: "600", fontSize: 15 },
  dishPrice: { color: "#444", marginTop: 4 },
  addBtn: {
    backgroundColor: "#10B981",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
});

export default ShoppingStore;
