import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export type CardItem = {
  name: string;
  image: any; // You can use `ImageSourcePropType` for stricter typing
  rating?: string;
  time?: string;
  cost?: string;
  [key: string]: any; // To support additional fields
};

type HorizontalCardListProps = {
  title: string;
  items: CardItem[];
  seeAllText?: string;
  onSeeAllPress?: () => void;
  onCardPress?: (item: CardItem, index: number) => void;
};

const HorizontalCardList = ({
  title,
  items,
  seeAllText = "See All",
  onSeeAllPress,
  onCardPress,
}: HorizontalCardListProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onSeeAllPress && (
          <TouchableOpacity onPress={onSeeAllPress}>
            <Text style={styles.seeAllText}>{seeAllText}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.cardWrapper}
            activeOpacity={0.85}
            onPress={() => onCardPress?.(item, index)}
          >
            <View style={styles.restaurantCard}>
              <Image source={item.image} style={styles.restaurantImage} />
              <Text style={styles.restaurantName}>{item.name}</Text>
              {item.rating && (
                <Text style={styles.restaurantDetails}>
                  {item.rating} ⭐ • {item.time} • {item.cost}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 16, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#111" },
  seeAllText: { fontSize: 13, fontWeight: "600", color: "#10B981" },
  cardWrapper: {
    marginRight: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  restaurantCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    width: 180,
    overflow: "hidden",
  },
  restaurantImage: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  restaurantName: {
    fontWeight: "600",
    fontSize: 16,
    marginTop: 8,
    color: "#111",
  },
  restaurantDetails: { fontSize: 12, color: "#666", marginTop: 4 },
});

export default HorizontalCardList;
