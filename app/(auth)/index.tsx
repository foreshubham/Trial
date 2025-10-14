// src/screens/auth/OnboardingScreen.tsx
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");
const ICON_SIZE = 48;

export default function OnboardingScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
       <StatusBar style="dark" backgroundColor="#FFF" />
      {/* Top Section with Icons */}
      <View style={styles.topSection}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { left: 30, top: 50 }]}>
            <MaterialIcons name="restaurant" size={22} color="#2C9C46" />
          </View>
          <View style={[styles.iconCircle, { top: 10 }]}>
            <FontAwesome5 name="car" size={20} color="#2C9C46" />
          </View>
          <View style={[styles.iconCircle, { right: 30, top: 50 }]}>
            <Ionicons name="cart" size={22} color="#2C9C46" />
          </View>
          <View style={[styles.iconCircle, { top: 90 }]}>
            <Ionicons name="call" size={22} color="#2C9C46" />
          </View>
        </View>

        {/* Curve Shape */}
        <Svg
          height="90"
          width={width}
          viewBox={`0 0 ${width} 80`}
          style={styles.curve}
        >
          <Path
            d={`M0 80 Q${width / 2} 0 ${width} 80 L${width} 100 L0 100 Z`}
            fill="#FFF"
          />
        </Svg>
      </View>

      {/* Bottom Content */}
      <View style={styles.bottomSection}>
        <Text style={styles.heading}>
          <Text style={styles.lightText}>Experience Convenience </Text>
          <Text style={styles.boldText}>With Macro Rides</Text>
        </Text>

        <Text style={styles.subtext}>
          Book a ride, order your favorite meals, or shop from local stores —
          all in one app.
        </Text>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push("/(auth)/signup")}
        >
          <Text style={styles.ctaButtonText}>Let’s Get Started</Text>
        </TouchableOpacity>

        <Text style={styles.signInText}>
          Already have an account?{" "}
          <Text
            style={styles.signInLink}
            onPress={() => router.push("/(auth)/login")}
          >
            Sign In
          </Text>
        </Text>
        <Text style={styles.signInText}>
          Direct Ride{" "}
          <Text
            style={styles.signInLink}
            onPress={() => router.push("/(tabs)")}
          >
            Sign In
          </Text>
        </Text>

        {/* <Footer /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  topSection: {
    backgroundColor: "#F3F4F6",
    paddingTop: Platform.OS === "ios" ? 60 : 100, // adjust top padding for iOS
  },
  iconContainer: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: -10,
  },
  iconCircle: {
    position: "absolute",
    backgroundColor: "#fff",
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  curve: {
    marginTop: -5,
  },
  bottomSection: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 32,
  },
  lightText: {
    color: "#888888",
  },
  boldText: {
    color: "#000",
    fontWeight: "bold",
  },
  subtext: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 8,
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: "#2C9C46",
    paddingVertical: 14,
    borderRadius: 28,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    marginBottom: 20,
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signInText: {
    fontSize: 14,
    color: "#888",
    paddingBottom: 30,
  },
  signInLink: {
    color: "#2C9C46",
    textDecorationLine: "underline",
    fontWeight: "500",
  },
});
