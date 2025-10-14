import AppHeader from "@/components/AppHeader";
import { useRide } from "@/context/rideContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 🎨 Constants
const GREEN = "#2C9C46";
const LIGHT_BG = "#FFFFFF";
const CARD_BG = "#F6F7F9";
const TEXT_PRIMARY = "#1F2937";
const TEXT_MUTED = "#6B7280";
const DIVIDER = "#E5E7EB";
const DISABLED_BG = "rgba(0,0,0,0.15)";

export default function RideHomeScreen() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const { rideHistory = [], bookRide } = useRide();
  const router = useRouter();

  const handleFindRoute = () => {
    if (!pickup.trim() || !drop.trim()) {
      alert("Please enter both pickup and destination locations");
      return;
    }

    // ✅ Updated to match Ride type (expects pickupLocation & dropoffLocation)
    const rideDetails = {
      pickupLocation: pickup.trim(),
      dropoffLocation: drop.trim(),
      time: new Date().toISOString(),
    };

    bookRide(rideDetails);

    // Navigate with params
    router.push({
      pathname: "/ride/route",
      params: rideDetails,
    });
  };

  const renderHistory = Array.isArray(rideHistory)
    ? rideHistory.slice(0, 4)
    : [];

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <AppHeader title="Book a Ride" onBack={() => router.back()} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.innerContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.content}>
              <Text style={styles.title}>Where to?</Text>

              {/* Pickup input */}
              <View style={styles.inputWrapper}>
                <Ionicons name="location-outline" size={22} color={GREEN} />
                <TextInput
                  placeholder="Enter current location"
                  placeholderTextColor={TEXT_MUTED}
                  value={pickup}
                  onChangeText={setPickup}
                  style={styles.input}
                  returnKeyType="next"
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              {/* Destination input */}
              <View style={styles.inputWrapper}>
                <Ionicons name="navigate-outline" size={22} color={GREEN} />
                <TextInput
                  placeholder="Enter destination"
                  placeholderTextColor={TEXT_MUTED}
                  value={drop}
                  onChangeText={setDrop}
                  style={styles.input}
                  returnKeyType="done"
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              {/* Find Route Button */}
              <TouchableOpacity
                onPress={handleFindRoute}
                style={[
                  styles.button,
                  !(pickup && drop) && styles.disabledButton,
                ]}
                disabled={!(pickup && drop)}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Find Route</Text>
              </TouchableOpacity>

              {/* Ride History */}
              {renderHistory.length > 0 && (
                <View style={styles.historyContainer}>
                  <Text style={styles.historyTitle}>Recent Rides</Text>
                  <FlatList
                    data={renderHistory}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <View style={styles.historyCard}>
                        <Text style={styles.historyText}>
                          {item.pickupLocation} → {item.dropoffLocation}
                        </Text>
                        <Text style={styles.historyTime}>
                          {new Date(item.time).toLocaleString()}
                        </Text>
                      </View>
                    )}
                    scrollEnabled={false}
                  />

                  {rideHistory.length > 4 && (
                    <TouchableOpacity
                      style={styles.seeAllButton}
                      onPress={() => router.push("/activity")}
                    >
                      <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

// 🧾 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG },
  innerContainer: { flex: 1, paddingHorizontal: 24 },
  content: { flexGrow: 1, paddingTop: 24 },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 24,
    color: TEXT_PRIMARY,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: DIVIDER,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: CARD_BG,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginBottom: 16,
  },
  input: {
    marginLeft: 14,
    fontSize: 16,
    flex: 1,
    color: TEXT_PRIMARY,
    minHeight: 48,
    textAlignVertical: "center",
  },
  button: {
    backgroundColor: GREEN,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginTop: 8,
  },
  disabledButton: { backgroundColor: DISABLED_BG },
  buttonText: { fontWeight: "700", fontSize: 18, color: LIGHT_BG },
  historyContainer: { marginTop: 32 },
  historyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: TEXT_PRIMARY,
  },
  historyCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  historyText: { fontSize: 15, fontWeight: "600", color: TEXT_PRIMARY },
  historyTime: { fontSize: 13, color: TEXT_MUTED, marginTop: 4 },
  seeAllButton: {
    alignSelf: "flex-end",
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  seeAllText: { color: GREEN, fontWeight: "600", fontSize: 14 },
});
