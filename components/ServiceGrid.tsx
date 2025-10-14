// src/components/Common/ServiceGrid.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface ServiceItem {
  icon: string;
  label: string;
  screen: string;
  color: string;
}

interface ServiceGridProps {
  services: ServiceItem[];
}

export default function ServiceGrid({ services }: ServiceGridProps) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.serviceGrid}>
      {services.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.gridItem}
          onPress={() => navigation.navigate(item.screen as never)}
        >
          <View
            style={[styles.gridIconCircle, { backgroundColor: item.color }]}
          >
            <Ionicons name={item.icon as any} size={22} color={colors.border} />
          </View>
          <Text style={[styles.gridLabel, { color: "#000" }]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  gridItem: {
    width: "22%",
    marginVertical: 10,
    alignItems: "center",
  },
  gridIconCircle: {
    padding: 14,
    borderRadius: 50,
    marginBottom: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
});
