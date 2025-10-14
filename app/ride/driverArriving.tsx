"use client";
import { RideStats } from "@/components/RideStats";
import { useRide } from "@/context/rideContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { AnimatedRegion, Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("window");
const TOTAL_TIME = 180; // 3 minutes

// Dummy fallback data for driver and vehicle
const dummyDriver = {
  name: "John Doe",
  profileImage: "https://randomuser.me/api/portraits/men/75.jpg",
  rating: 4.8,
  phone: "+1 555 123 4567",
  role: "Driver",
};

const dummyVehicle = {
  model: "Toyota Camry",
  color: "Black",
  numberPlate: "XYZ 1234",
  type: "Sedan",
};

export default function RideAcceptedScreen() {
  const { currentRide, cancelRide, clearCurrentRide } = useRide();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract trip info from params or fallback to currentRide info or dummy data
  const pickupLocation =
    params.pickup || currentRide?.pickupLocation || "123 Main St, City";
  const dropoffLocation =
    params.drop || currentRide?.dropoffLocation || "456 Elm St, City";
  const vehicleInfo =
    params.vehicle && typeof params.vehicle === "string"
      ? JSON.parse(params.vehicle)
      : currentRide?.vehicle || dummyVehicle;

  const driverInfo = currentRide?.driver || dummyDriver;

  const [countdown, setCountdown] = useState(TOTAL_TIME);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Animated region for driver marker
  // Starting point: current driver's location or fallback
  const initialLat = currentRide?.driverLocation?.lat || 28.6139;
  const initialLng = currentRide?.driverLocation?.lng || 77.209;

  // Destination: pickup location coordinates (dummy example - ideally parse actual lat/lng)
  // For demo purposes, let's hardcode pickup coordinates:
  const pickupCoords = { latitude: 28.62, longitude: 77.215 }; // You can replace with real geocoding data

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // AnimatedRegion for smooth marker movement
  const [driverCoordinate] = useState(
    new AnimatedRegion({
      latitude: initialLat,
      longitude: initialLng,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })
  );

  // Animate screen fade-in on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Animate driver marker towards pickup location gradually
  useEffect(() => {
    let step = 0;
    const totalSteps = 60; // Animate for 60 steps (~1 minute)
    const latDelta = (pickupCoords.latitude - initialLat) / totalSteps;
    const lngDelta = (pickupCoords.longitude - initialLng) / totalSteps;

    const interval = setInterval(() => {
      step++;
      if (step > totalSteps) {
        clearInterval(interval);
        return;
      }

      const newLat = initialLat + latDelta * step;
      const newLng = initialLng + lngDelta * step;

      // Animate marker coordinate change
      driverCoordinate
        .timing({
          latitude: newLat,
          longitude: newLng,
          duration: 1000,
          useNativeDriver: false,
          toValue: 0,
          latitudeDelta: 0,
          longitudeDelta: 0,
        })
        .start();

      // Optionally move the map to follow driver
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: newLat,
            longitude: newLng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          },
          1000
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!currentRide && !driverInfo) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Assigning your driver...</Text>
      </View>
    );
  }

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor="#fff" />

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            ></TouchableOpacity>
            <Text style={styles.headerTitle}>Your rider is on the way...</Text>
          </View>

          {/* Title */}
          {/* <Text style={styles.title}>Your rider is on the way</Text> */}

          {/* Driver Card */}
          <View style={styles.card}>
            <View style={styles.row}>
              <Image
                source={{ uri: driverInfo.profileImage }}
                style={styles.driverImage}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.driverName}>{driverInfo.name}</Text>
                <Text style={styles.driverRole}>
                  {driverInfo.role || "Driver"}
                </Text>

                <View style={styles.row}>
                  <Ionicons name="star" size={14} color="#2E7D32" />
                  <Text style={styles.ratingText}>
                    {" "}
                    {driverInfo.rating?.toFixed(1) || "4.9"}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    alert(
                      `Calling ${driverInfo.name} at ${
                        driverInfo.phone || "N/A"
                      }`
                    )
                  }
                  style={styles.callButton}
                  accessibilityLabel="Call driver"
                >
                  <Ionicons name="call" size={20} color="#fff" />
                  <Text style={styles.callButtonText}>Call Driver</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Countdown Timer (Text Only) */}
          <RideStats
            etaSeconds={countdown}
            fare={currentRide?.fare || 150}
            distance={currentRide?.estimatedFare || 5}
          />

      
          {/* Map View */}
          <MapView
            ref={mapRef}
            style={styles.map}
            region={{
              latitude: initialLat,
              longitude: initialLng,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Marker.Animated
              ref={markerRef}
              coordinate={driverCoordinate}
              title="Driver"
              pinColor="#2E7D32"
            />

            {/* Pickup location marker */}
            <Marker
              coordinate={pickupCoords}
              title="Pickup Location"
              pinColor="#FF6347" // Tomato color
            />
          </MapView>

          {/* Vehicle Details */}
          <View style={[styles.card, { paddingVertical: 20 }]}>
            <Text style={styles.sectionTitle}>Vehicle Details</Text>
            <Text style={styles.infoItem}>
              🚗 Model:{" "}
              <Text style={styles.infoValue}>{vehicleInfo.model}</Text>
            </Text>
            <Text style={styles.infoItem}>
              🎨 Color:{" "}
              <Text style={styles.infoValue}>{vehicleInfo.color}</Text>
            </Text>
            <Text style={styles.infoItem}>
              🏷 Plate:{" "}
              <Text style={styles.infoValue}>{vehicleInfo.numberPlate}</Text>
            </Text>
            <Text style={styles.infoItem}>
              🚙 Type:{" "}
              <Text style={styles.infoValue}>
                {vehicleInfo.type || "Sedan"}
              </Text>
            </Text>
          </View>

          {/* Ride Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trip Info</Text>
            <Text style={styles.infoItem}>
              📍 Pickup: <Text style={styles.infoValue}>{pickupLocation}</Text>
            </Text>
            <Text style={styles.infoItem}>
              🏁 Dropoff:{" "}
              <Text style={styles.infoValue}>{dropoffLocation}</Text>
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#2E7D32" }]}
              onPress={() => alert("Calling Driver...")}
              accessibilityLabel="Contact driver"
            >
              <Text style={styles.buttonText}>Contact Driver</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#D32F2F" }]}
              onPress={() => {
                cancelRide(currentRide?.id || "dummyId");
                clearCurrentRide();
                router.replace("/(tabs)");
              }}
              accessibilityLabel="Cancel ride"
            >
              <Text style={styles.buttonText}>Cancel Ride</Text>
            </TouchableOpacity>
          </View>

          {/* Safety Info */}
          <View style={[styles.card, { paddingVertical: 20, marginTop: 20 }]}>
            <Text style={styles.sectionTitle}>Safety & Comfort</Text>

            <View style={styles.safetyItem}>
              <Ionicons name="shield-checkmark" size={20} color="#2E7D32" />
              <Text style={styles.safetyText}>Verified Driver</Text>
            </View>
            <View style={styles.safetyItem}>
              <Ionicons name="medkit" size={20} color="#2E7D32" />
              <Text style={styles.safetyText}>COVID-19 Safety Measures</Text>
            </View>
            <View style={styles.safetyItem}>
              <Ionicons name="sparkles" size={20} color="#2E7D32" />
              <Text style={styles.safetyText}>Vehicle Sanitized</Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    // paddingTop: Platform.OS === "ios" ? 60 : 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginVertical: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#2E7D32",
  },
  driverName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  driverRole: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2E7D32",
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "600",
    marginLeft: 4,
  },
  callButton: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E7D32",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  callButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 16,
    marginVertical: 4,
  },
  infoValue: {
    fontWeight: "700",
    color: "#2E7D32",
  },
  safetyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  safetyText: {
    fontSize: 16,
    color: "#2E7D32",
    marginLeft: 10,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  timerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E7D32",
  },
  section: {
    marginBottom: 20,
  },
  map: {
    width: width - 40,
    height: height * 0.3,
    borderRadius: 16,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
});
