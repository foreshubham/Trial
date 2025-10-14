import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { HTTP_URL } from "@/constants/urls";
import { useAuth } from "@/context/auth";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function LocationScreen() {
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { updateUser, getToken } = useAuth();
  const router = useRouter();

  const detectLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission denied", "We need location access.");
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const { latitude, longitude } = pos.coords;
      if (!latitude || !longitude) {
        Alert.alert("Error", "Unable to fetch valid coordinates");
        return;
      }

      setSelected({
        lat: latitude.toString(),
        lon: longitude.toString(),
      });
    } catch (err) {
      Alert.alert("Error", "Failed to detect location.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmLocation = async () => {
    if (!selected) return;
    const token = getToken();
    const lat = parseFloat(selected.lat);
    const lng = parseFloat(selected.lon);
    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert("Error", "Invalid coordinates detected");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${HTTP_URL}/common/update-location`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: token ? `token=${token}` : "",
        },
        body: JSON.stringify({ lat, lng }),
      });
      const data = await res.json();

      if (res.ok) {
        updateUser({
          lat,
          lng,
          address: data.address || "",
        });
        Alert.alert("Success", "Location updated successfully");
        router.push("/(tabs)");
      } else {
        Alert.alert("Error", data.message || "Failed to update location");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Network error while updating location");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <ThemedView style={styles.container}>
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={width * 0.06} color="#000" />
        </TouchableOpacity>

        <ThemedText style={styles.heading}>Select Your Location 📍</ThemedText>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: loading ? "#ccc" : "#2E7D32" }]}
          onPress={detectLocation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <ThemedText style={styles.buttonText}>Detect My Location</ThemedText>
          )}
        </TouchableOpacity>

        {selected ? (
          <>
            <MapView
              style={styles.map}
              region={{
                latitude: parseFloat(selected.lat),
                longitude: parseFloat(selected.lon),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: parseFloat(selected.lat),
                  longitude: parseFloat(selected.lon),
                }}
                title="You are here"
              />
            </MapView>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: submitting ? "#ccc" : "#2E7D32" },
              ]}
              onPress={confirmLocation}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <ThemedText style={styles.buttonText}>Confirm Location</ThemedText>
              )}
            </TouchableOpacity>
          </>
        ) : (
          !loading && (
            <ThemedText style={styles.fallbackText}>
              Location not detected yet. Please try again.
            </ThemedText>
          )
        )}

        {/* Skip option */}
        <TouchableOpacity style={styles.skipBtn} onPress={() => router.push("/(tabs)")}>
          <ThemedText style={styles.skipText}>Skip for now</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

// IMPORTANT: to disable the header in Expo Router, you need to adjust your layout or route config.
// Example: in your route file for this screen, you can export `const config = { headerShown: false }`
// or similar depending on your setup.

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.03,
    backgroundColor: "#FFFFFF",
  },
  backBtn: {
    marginBottom: height * 0.015,
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: "700",
    marginBottom: height * 0.025,
    color: "#000000",
  },
  map: {
    width: "100%",
    height: height * 0.3,
    marginVertical: height * 0.03,
    borderRadius: 12,
  },
  button: {
    paddingVertical: height * 0.018,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: height * 0.02,
  },
  buttonText: {
    color: "#FFF",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
  fallbackText: {
    textAlign: "center",
    color: "#666666",
    marginTop: height * 0.05,
    fontSize: width * 0.04,
  },
  skipBtn: {
    marginTop: 20,
    alignItems: "center",
  },
  skipText: {
    fontSize: width * 0.04,
    color: "#2E7D32",
    textDecorationLine: "underline",
  },
});
