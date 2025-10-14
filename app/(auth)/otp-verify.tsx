import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/auth";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function OTPScreen() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [timer, setTimer] = useState(59);
  const [loading, setLoading] = useState(false);
  const [alternativeLoading, setAlternativeLoading] = useState(false);

  const { updateUser, saveToken } = useAuth();
  const { phone = "" } = useLocalSearchParams();

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleVerifyOtp();
    }
  }, [otp]);

  const handleChange = (text: string, index: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    if (!phone) {
      Alert.alert("Missing Phone Number", "Phone number not found in params.");
      return;
    }

    const enteredOtp = otp.join("");

    // ✅ Commented out actual OTP verification logic
    /*
    try {
      setLoading(true);

      const res = await fetch(`${HTTP_URL}/common/otp-verify/user/${phone}`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ otp: enteredOtp }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (res.ok) {
        Alert.alert("OTP verified", data.message || "OTP verified successfully.");
        const userData = {
          id: data.userId,
          name: data.name,
          phoneNumber: data.phone,
        };
        updateUser(userData);
        saveToken(data.token);
        router.push("/location");
        return;
      }

      Alert.alert("Something went wrong", data.message || "OTP verification failed.");
    } catch (error) {
      Alert.alert("Verification Failed", "Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
    */

    // ✅ Simulate verification success
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("OTP Verified", "Redirecting to location setup...");
      router.push("/location");
    }, 1500);
  };

  const handleAlternativeMethod = async () => {
    setAlternativeLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Alternative Method", "We'll try to reach you via a call shortly.");
    } catch (error) {
      Alert.alert("Error", "Failed to request alternative method.");
    } finally {
      setAlternativeLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
       <StatusBar style="dark" backgroundColor="#FFF" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ThemedView style={{ flex: 1, justifyContent: "space-between" }}>
          {(loading || alternativeLoading) && (
            <ThemedView style={styles.loaderOverlay}>
              <BlurView intensity={50} style={StyleSheet.absoluteFill} tint="light" />
              <ThemedView style={styles.loaderContent}>
                <ActivityIndicator size="large" color="#2E7D32" />
                <ThemedText style={styles.loaderText}>
                  {loading ? "Verifying..." : "Requesting alternative..."}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}

          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back Button */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={width * 0.06} color="#000" />
              </TouchableOpacity>
            </View>

            <ThemedText style={styles.title}>Enter OTP</ThemedText>
            <ThemedText style={styles.info}>
              Please enter the 6-digit OTP sent to
            </ThemedText>
            <ThemedText style={styles.phoneDisplay}>
              +91 {phone}
            </ThemedText>

            {/* OTP Inputs */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpBox,
                    {
                      borderColor: otp[index] ? "#2E7D32" : "#ccc",
                      backgroundColor: otp[index] ? "#E8F5E9" : "#F9F9F9",
                    },
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  placeholder="-"
                  placeholderTextColor="#999"
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  returnKeyType="done"
                />
              ))}
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={handleAlternativeMethod}
                disabled={alternativeLoading}
              >
                <ThemedText style={styles.alternateMethod}>
                  Try another way?
                </ThemedText>
              </TouchableOpacity>

              {timer > 0 ? (
                <ThemedText style={styles.resendDisabled}>
                  Resend in 00:{timer.toString().padStart(2, "0")}
                </ThemedText>
              ) : (
                <TouchableOpacity onPress={() => setTimer(59)}>
                  <ThemedText style={styles.resendActive}>Resend</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.025,
    paddingBottom: height * 0.03,
    flexGrow: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    marginBottom: height * 0.025,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "700",
    marginTop: height * 0.02,
    marginBottom: height * 0.015,
    color: "#000",
    textAlign: "center",
    paddingTop: height * 0.01,
  },
  info: {
    fontSize: width * 0.04,
    color: "#666",
    textAlign: "center",
  },
  phoneDisplay: {
    fontWeight: "700",
    fontSize: width * 0.045,
    textAlign: "center",
    marginBottom: height * 0.04,
    marginTop: height * 0.01,
    color: "black",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.04,
  },
  otpBox: {
    width: width * 0.14,
    height: height * 0.07,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: "center",
    fontSize: width * 0.055,
    fontWeight: "700",
    color: "#000",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  alternateMethod: {
    fontSize: width * 0.04,
    color: "#1daa30ff",
    fontWeight: "600",
  },
  resendDisabled: {
    fontSize: width * 0.04,
    color: "#999",
    fontWeight: "500",
  },
  resendActive: {
    fontSize: width * 0.04,
    color: "#2E7D32",
    fontWeight: "600",
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loaderContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
  },
});
