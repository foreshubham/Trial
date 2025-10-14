import { Entypo, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Filter {
  label: string;
  onPress: () => void;
}

interface ShoppingFiltersProps {
  filters: Filter[];
}

const ShoppingFilters: React.FC<ShoppingFiltersProps> = ({ filters }) => {
  const [activeFilter, setActiveFilter] = useState<string>("");

  const FILTER_ICONS: Record<string, React.ReactNode> = {
    Filters: <Ionicons name="options-outline" size={16} color="#000" />,
    Trending: <MaterialIcons name="whatshot" size={16} color="red" />,
    "Top Rated": <Ionicons name="star-outline" size={16} color="orange" />,
    "Top Brands": <FontAwesome5 name="store" size={14} color="green" />,
    Imported: <Entypo name="globe" size={15} color="royalblue" />,
    "Under 30 mins": <MaterialIcons name="timer" size={16} color="gray" />,
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersContainer}
      style={{ marginVertical: 14 }}
    >
      {filters.map((filter, idx) => {
        const isActive = activeFilter === filter.label;

        return (
          <TouchableOpacity
            key={idx}
            onPress={() => {
              setActiveFilter(filter.label);
              filter.onPress();
            }}
            activeOpacity={0.8}
            style={[styles.filterButton, isActive && styles.activeFilterButton]}
          >
            <View style={styles.iconWrapper}>
              {FILTER_ICONS[filter.label] ?? null}
            </View>
            <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default ShoppingFilters;

const styles = StyleSheet.create({
  filtersContainer: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  activeFilterButton: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  iconWrapper: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  activeFilterText: {
    color: "#fff",
  },
});
