import { useNavigation, useTheme } from "@react-navigation/native";
import React from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import StoreCard, { StoreItem } from "@/components/Common/StoresCard";
import Header from "@/components/Header";
import ImageSlider from "@/components/ImageSlider";
import ServiceGrid, { ServiceItem } from "@/components/ServiceGrid";

export default function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  const services: ServiceItem[] = [
    { icon: "car", label: "Ride", screen: "ride", color: "#D5C5FC" },
    { icon: "fast-food", label: "Food", screen: "food", color: "#D3FCC5" },
    { icon: "cart", label: "Shopping", screen: "shopping", color: "#F8F6B2" },
    {
      icon: "cube",
      label: "Parcels",
      screen: "ShoppingBackup",
      color: "#C2F6AE",
    },
  ];

  const foodStores: StoreItem[] = [
    {
      id: "1",
      name: "I Love Chillies",
      image: {
        uri: "https://assets.cntraveller.in/photos/6673fe6c2f55cb2c01405ac0/16:9/w_1024%2Cc_limit/Lead%2520option.jpg",
      },
      category: "North Indian",
      price: "₹250 for one",
      rating: 3.9,
      deliveryTime: "25-30 mins",
      distance: "3.3 km",
      offer: "50% OFF up to ₹100",
      tag: "Last 100 Orders Without Complaints",
    },
    {
      id: "2",
      name: "Spicy Bites",
      image: {
        uri: "https://www.tinbuilding.com/wp-content/uploads/2024/09/download-6-scaled-920x518.webp",
      },
      category: "North Indian",
      price: "₹200 for one",
      rating: 4.2,
      deliveryTime: "20-25 mins",
      distance: "2.1 km",
      offer: "30% OFF on first order",
      tag: "Frequently Ordered",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar backgroundColor={colors.primary} />
      <View style={styles.container}>
        <FlatList
          data={[]} // dummy list to use ListHeaderComponent
          renderItem={null}
          ListHeaderComponent={
            <>
              <Header />

              {/* Services Grid */}
              <Text style={[styles.sectionTitle]}>Explore Our Services</Text>
              <ServiceGrid services={services} />

              {/* Image Slider */}
              <View style={{ marginTop: 20 }}>
                <ImageSlider />
              </View>

              {/* Featured Restaurants */}
              <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
                Featured Restaurants
              </Text>
              <FlatList
                data={foodStores}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <StoreCard
                    item={item}
                    onPress={() =>
                      navigation.navigate("RestaurantMenu", {
                        restaurant: item,
                      })
                    }
                  />
                )}
                contentContainerStyle={styles.listContainer}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                scrollEnabled={false} // prevent nested scroll issues
              />
            </>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingTop: 20,
    paddingLeft: 20,

    color: "#222",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  } as ViewStyle,
});
