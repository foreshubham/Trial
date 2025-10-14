// Common card component for stores, shops, restaurants, etc.
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Generic store/shop/restaurant type
export type StoreItem = {
  id: string;
  name: string;
  image: { uri: string };
  category: string; // food, grocery, etc.
  price: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  offer?: string;
  tag?: string;
};

type Props = {
  item: StoreItem;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  showIcons?: boolean;
};

const StoreCard: React.FC<Props> = ({ item, onPress, containerStyle, showIcons = true }) => {
  return (
    <TouchableOpacity style={[styles.card, containerStyle]} activeOpacity={0.9} onPress={onPress}>
      <Image source={item.image} style={styles.image} />

      {/* Top Left Label */}
      <View style={styles.tagOverlay}>
        <Text style={styles.tagText}>
          {item.category} · {item.price}
        </Text>
      </View>

      {/* Top Right Icons (optional) */}
      {showIcons && (
        <View style={styles.iconOverlay}>
          <Ionicons name="bookmark-outline" size={22} color="#fff" style={styles.icon} />
          <Ionicons name="eye-off-outline" size={22} color="#fff" />
        </View>
      )}

      {/* Details */}
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.subInfo}>
          <Ionicons name="time-outline" size={16} color="#777" />
          <Text style={styles.infoText}>
            {item.deliveryTime} · {item.distance}
          </Text>

          <View style={styles.ratingBox}>
            <Text style={styles.ratingText}>{item.rating}★</Text>
          </View>
        </View>

        {item.offer && <Text style={styles.offerText}>🎉 {item.offer}</Text>}
        {item.tag && <Text style={styles.tagLine}>✅ {item.tag}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default StoreCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 180,
  },
  tagOverlay: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  iconOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
    alignItems: "center",
  },
  icon: {
    marginBottom: 8,
  },
  details: {
    padding: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },
  subInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: "#555",
    marginLeft: 6,
    marginRight: 8,
  },
  ratingBox: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  offerText: {
    color: "#007AFF",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 2,
  },
  tagLine: {
    color: "#444",
    fontSize: 12,
  },
});
