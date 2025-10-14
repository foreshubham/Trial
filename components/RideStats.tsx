// components/RideStats.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface RideStatsProps {
  etaSeconds: number;
  fare: number;
  distance: number;
}

export const RideStats: React.FC<RideStatsProps> = ({
  etaSeconds,
  fare,
  distance,
}) => {
  const minutes = Math.floor(etaSeconds / 60);
  const seconds = etaSeconds % 60;

  return (
    <View style={styles.section}>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>ETA</Text>
          <Text style={styles.statValue}>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds} min
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Fare</Text>
          <Text style={styles.statValue}>₹{fare.toFixed(2)}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>{distance.toFixed(1)} km</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    color: "#777",
    fontSize: 13,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E7D32",
  },
});
