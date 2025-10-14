import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AssigningRiderScreen() {
  const router = useRouter();
  const { pickup, drop, vehicle, time } = useLocalSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace({
        pathname: "/ride/driverArriving",
        params: {
          pickup: String(pickup),
          drop: String(drop),
          vehicle: typeof vehicle === "string" ? vehicle : JSON.stringify(vehicle),
          time: String(time),
        },
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.modalBackground}>
      <View style={styles.modalBox}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.text}>Assigning a rider for your ride...</Text>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "#efefefaa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  cancelButton: {
    marginTop: 20,
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  cancelText: {
    color: "white",
    fontWeight: "700",
  },
});
