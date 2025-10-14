import { useRide } from "../../context/rideContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

const STATUS_BAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 0 : 35;

const PRIMARY_COLOR = "#2C9C46";

function AppHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <View
      style={[
        styles.headerWrap,
        { paddingTop: STATUS_BAR_HEIGHT, height: 56 + STATUS_BAR_HEIGHT },
      ]}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.headerIcon}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerIcon} />
      </View>
    </View>
  );
}

export default function RideDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { currentRide } = useRide();

  // Safely parse pickup param
  let pickup = null;
  try {
    pickup = params?.pickup ? JSON.parse(String(params.pickup)) : null;
  } catch {
    pickup = null;
  }

  // Safely parse drop param
  let drop = null;
  try {
    drop = params?.drop ? JSON.parse(String(params.drop)) : null;
  } catch {
    drop = null;
  }

  // Safely parse vehicle param, fallback to object with name if plain string
  let vehicle = null;
  try {
    vehicle = params?.vehicle ? JSON.parse(String(params.vehicle)) : null;
  } catch {
    vehicle = { name: String(params.vehicle) };
  }

  const time = params?.time || "";

  // Default to Delhi coords if missing
  const pickupCoords =
    pickup?.latitude && pickup?.longitude
      ? { latitude: pickup.latitude, longitude: pickup.longitude }
      : { latitude: 28.7041, longitude: 77.1025 };

  const dropCoords =
    drop?.latitude && drop?.longitude
      ? { latitude: drop.latitude, longitude: drop.longitude }
      : { latitude: 28.5355, longitude: 77.391 };

  // Rider location slightly offset from drop
  const riderCoords = {
    latitude: dropCoords.latitude + 0.005,
    longitude: dropCoords.longitude + 0.005,
  };

  const rider = {
    name: "Ravi Kumar",
    phone: "+91 9876543210",
    vehicleNumber: "DL 01 AB 1234",
    vehicleName: vehicle?.name || "Vehicle",
    otp: "4521",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      Alert.alert("Please rate your driver");
      return;
    }

    Alert.alert(
      "Thank you!",
      `Rating: ${rating}\nFeedback: ${feedback || "No feedback"}`
    );
    router.replace({ pathname: "/(tabs)" }); // navigate to home
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
        <Ionicons
          name={i + 1 <= rating ? "star" : "star-outline"}
          size={32}
          color={PRIMARY_COLOR}
          style={{ marginHorizontal: 3 }}
        />
      </TouchableOpacity>
    ));
  };

  const latitudeDelta =
    Math.abs(pickupCoords.latitude - dropCoords.latitude) * 2.5 || 0.05;
  const longitudeDelta =
    Math.abs(pickupCoords.longitude - dropCoords.longitude) * 2.5 || 0.05;
  const centerLatitude = (pickupCoords.latitude + dropCoords.latitude) / 2;
  const centerLongitude = (pickupCoords.longitude + dropCoords.longitude) / 2;

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <AppHeader title="Ride Details" onBack={() => router.back()} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Rider Card */}
        <View style={styles.riderCard}>
          <Image source={{ uri: rider.avatar }} style={styles.avatar} />
          <View style={styles.riderInfo}>
            <Text style={styles.riderName}>{rider.name}</Text>
            <Text style={styles.riderDetails}>
              {rider.vehicleName} - {rider.vehicleNumber}
            </Text>
            <View style={styles.otpRow}>
              <MaterialIcons name="vpn-key" size={18} color={PRIMARY_COLOR} />
              <Text style={styles.otpText}> OTP: {rider.otp}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Alert.alert("Call", `Calling ${rider.phone}...`)}
            activeOpacity={0.7}
          >
            <Ionicons name="call" size={22} color={PRIMARY_COLOR} />
          </TouchableOpacity>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            initialRegion={{
              latitude: centerLatitude,
              longitude: centerLongitude,
              latitudeDelta,
              longitudeDelta,
            }}
            showsUserLocation={false}
            loadingEnabled
            loadingIndicatorColor={PRIMARY_COLOR}
          >
            <Marker
              coordinate={pickupCoords}
              title="Your Location"
              pinColor="#2E86C1"
            />
            <Marker
              coordinate={riderCoords}
              title="Driver Location"
              pinColor={PRIMARY_COLOR}
            />
            <Marker
              coordinate={dropCoords}
              title="Drop Location"
              pinColor="#EF4444"
            />
          </MapView>
        </View>

        {/* Ride Details */}
        <View style={styles.detailsBox}>
          <Text style={styles.heading}>Trip Summary</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Pickup Location:</Text>
            <Text style={styles.value}>
              {pickup?.address ||
                `${pickupCoords.latitude.toFixed(4)}, ${pickupCoords.longitude.toFixed(4)}`}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Drop Location:</Text>
            <Text style={styles.value}>
              {drop?.address ||
                `${dropCoords.latitude.toFixed(4)}, ${dropCoords.longitude.toFixed(4)}`}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Fare:</Text>
            <Text style={styles.value}>
              ₹{currentRide?.fare ?? "Calculating..."}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{currentRide?.status || "N/A"}</Text>
          </View>

          {/* Feedback */}
          <View style={styles.ratingContainer}>
            <Text style={styles.rateDriverTitle}>Rate your Driver</Text>
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              {renderStars()}
            </View>

            <TextInput
              placeholder="Leave feedback (optional)"
              value={feedback}
              onChangeText={setFeedback}
              style={styles.feedbackInput}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitFeedback}
              activeOpacity={0.8}
            >
              <Text style={styles.submitText}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  headerWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: PRIMARY_COLOR,
    zIndex: 100,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  headerRow: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  riderCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginTop: 56 + STATUS_BAR_HEIGHT + 12,
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },

  riderInfo: {
    flex: 1,
  },

  riderName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B4332",
  },

  riderDetails: {
    fontSize: 15,
    color: "#4A5568",
    marginTop: 4,
  },

  otpRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  otpText: {
    fontSize: 15,
    color: PRIMARY_COLOR,
    marginLeft: 6,
    fontWeight: "700",
  },

  callButton: {
    backgroundColor: "#D1E8D1",
    borderRadius: 16,
    padding: 12,
  },

  mapContainer: {
    marginTop: 16,
    height: height * 0.32,
    borderRadius: 18,
    overflow: "hidden",
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  map: {
    flex: 1,
  },

  detailsBox: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 24,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C7A7B",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    marginBottom: 14,
    justifyContent: "space-between",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A5568",
  },

  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C9C46",
  },

  ratingContainer: {
    marginTop: 30,
  },

  rateDriverTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: PRIMARY_COLOR,
    marginBottom: 10,
  },

  feedbackInput: {
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    fontSize: 15,
    color: "#4A5568",
    marginBottom: 20,
  },

  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
