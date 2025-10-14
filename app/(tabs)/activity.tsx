// app/activities/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";


const COLORS = {
  green: "#2c9c49",
  yellow: "#FACC15",
  red: "#DC2626",
  bgLight: "#FFFFFF",
  textPrimary: "#111827",
  textMuted: "#6B7280",
  grayLight: "#F3F4F6",
};

const notifications = {
  all: {
    ongoing: [
      {
        id: "1",
        title: "Ride Ongoing",
        description: "Trip to Airport in progress",
        date: "Oct 11, 2025",
      },
    ],
    completed: [
      {
        id: "2",
        title: "Food Delivered",
        description: "Order from Domino’s completed",
        date: "Oct 10, 2025",
      },
    ],
    cancelled: [
      {
        id: "3",
        title: "Order Cancelled",
        description: "Cancelled your T-shirt order",
        date: "Oct 09, 2025",
      },
    ],
  },
  rides: {
    ongoing: [
      {
        id: "4",
        title: "Driver Assigned",
        description: "Rahul is on the way",
        date: "Oct 08, 2025",
      },
    ],
    completed: [
      {
        id: "5",
        title: "Ride Completed",
        description: "Trip to Office done",
        date: "Oct 07, 2025",
      },
    ],
    cancelled: [],
  },
  food: {
    ongoing: [
      {
        id: "6",
        title: "Food Being Prepared",
        description: "Your order from KFC is on the way",
        date: "Oct 06, 2025",
      },
    ],
    completed: [
      {
        id: "7",
        title: "Order Delivered",
        description: "Pizza Hut delivered",
        date: "Oct 05, 2025",
      },
    ],
    cancelled: [],
  },
  shopping: {
    ongoing: [],
    completed: [
      {
        id: "8",
        title: "Order Shipped",
        description: "Amazon parcel dispatched",
        date: "Oct 04, 2025",
      },
    ],
    cancelled: [
      {
        id: "9",
        title: "Payment Reversed",
        description: "Flipkart order cancelled",
        date: "Oct 03, 2025",
      },
    ],
  },
};

const NotificationList = ({ data }: { data: any[] }) => (
  <FlatList
    data={data}
    keyExtractor={(item) => item.id}
    contentContainerStyle={{ padding: 16 }}
    ListEmptyComponent={
      <Text
        style={{ textAlign: "center", color: COLORS.textMuted, marginTop: 20 }}
      >
        No notifications yet.
      </Text>
    }
    renderItem={({ item }) => {
      let color = COLORS.green;
      const title = item.title.toLowerCase();
      if (title.includes("cancelled")) color = COLORS.red;
      else if (title.includes("ongoing")) color = COLORS.yellow;

      return (
        <View style={[styles.card, { borderLeftColor: color }]}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc}>{item.description}</Text>
          <Text style={styles.cardDate}>{item.date}</Text>
        </View>
      );
    }}
  />
);

const CategoryTab = ({ data }: { data: typeof notifications.all }) => {
  const [status, setStatus] = useState<"ongoing" | "completed" | "cancelled">(
    "ongoing"
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.statusTabs}>
        {["ongoing", "completed", "cancelled"].map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.statusTab, status === key && styles.statusTabActive]}
            onPress={() => setStatus(key as any)}
          >
            <Text
              style={[
                styles.statusText,
                status === key && styles.statusTextActive,
              ]}
            >
              {key.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <NotificationList data={data[status]} />
    </View>
  );
};

// Scene Mapping
const AllTab = () => <CategoryTab data={notifications.all} />;
const RidesTab = () => <CategoryTab data={notifications.rides} />;
const FoodTab = () => <CategoryTab data={notifications.food} />;
const ShoppingTab = () => <CategoryTab data={notifications.shopping} />;

const initialLayout = { width: Dimensions.get("window").width };

export default function ActivitiesScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "all", title: "ALL" },
    { key: "rides", title: "RIDES" },
    { key: "food", title: "FOOD" },
    { key: "shopping", title: "SHOPPING" },
  ]);

  const router = useRouter();

  const renderScene = SceneMap({
    all: AllTab,
    rides: RidesTab,
    food: FoodTab,
    shopping: ShoppingTab,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: COLORS.yellow,
        height: 3,
        borderRadius: 2,
      }}
      style={{ backgroundColor: COLORS.green }}
      scrollEnabled
      renderLabel={({ route, focused }) => (
        <Text
          style={[
            styles.tabLabel,
            { color: focused ? COLORS.yellow : COLORS.bgLight },
          ]}
        >
          {route.title}
        </Text>
      )}
      tabStyle={{ width: "auto", paddingHorizontal: 16 }}
    />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.tabWrapper}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.green },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.green,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  tabWrapper: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  tabLabel: { fontSize: 14, fontWeight: "600" },
  statusTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: COLORS.grayLight,
  },
  statusTab: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  statusTabActive: {
    backgroundColor: COLORS.yellow,
    borderColor: COLORS.yellow,
  },
  statusText: { fontSize: 13, color: COLORS.textMuted },
  statusTextActive: { color: COLORS.textPrimary, fontWeight: "700" },
  card: {
    backgroundColor: COLORS.bgLight,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: COLORS.textPrimary },
  cardDesc: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  cardDate: { fontSize: 12, color: "#9CA3AF", marginTop: 6 },
});
