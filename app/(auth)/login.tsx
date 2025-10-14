import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
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

const MobileLogin = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = phone.length === 10;
  const router = useRouter();

  const handleContinue = async () => {
    if (!isValid) {
      Alert.alert("Invalid Phone", "Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      // OTP API CALL
      // const res = await fetch(`${HTTP_URL}/common/signin/user`, {
      //   method: "POST",
      //   credentials: "include",
      //   body: JSON.stringify({ phoneNumber: phone }),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // const data = await res.json();

      // if (res.ok) {
      //   Alert.alert("Signup Successful", data.message || "OTP sent.");
      // } else {
      //   Alert.alert("Error", data.message || "Failed to send OTP.");
      //   return;
      // }

      //  Directly navigate to OTP screen
      router.push({
        pathname: "/(auth)/otp-verify",
        params: { phone },
      });

    } catch (error) {
      console.log(error);
      Alert.alert("Something went wrong", "Unable to proceed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <StatusBar style="dark" backgroundColor="#FFF" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backArrow}>
            <Ionicons name="arrow-back" size={width * 0.06} color="#000" />
          </TouchableOpacity>

          <ThemedText style={styles.heading}>Welcome Back 👋</ThemedText>
          <ThemedText style={styles.subheading}>
            Login to your Macro Rides account to continue.
          </ThemedText>

          <View style={styles.labelRow}>
            <ThemedText style={styles.label}>Mobile Number</ThemedText>
            <ThemedText style={styles.asterisk}> *</ThemedText>
          </View>

          <ThemedView style={styles.inputContainer}>
            <ThemedView style={styles.countryCodeBox}>
              <ThemedText style={styles.countryCodeText}>+91</ThemedText>
            </ThemedView>
            <TextInput
              style={styles.phoneInput}
              placeholder="9600000000"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
          </ThemedView>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: isValid ? "#2E7D32" : "#ccc" }]}
            onPress={handleContinue}
            disabled={!isValid || loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading ? "Processing..." : "Continue"}
            </ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.footerText}>
            I agree to Macro Rides's{" "}
            <ThemedText style={styles.linkText}>Terms & Conditions</ThemedText> and{" "}
            <ThemedText style={styles.linkText}>Privacy Policy</ThemedText>.
          </ThemedText>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.03,
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
  },
  backArrow: {
    marginBottom: height * 0.02,
  },
  heading: {
    fontSize: width * 0.078,
    fontWeight: "700",
    color: "#000000",
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
paddingTop: height * 0.01,
  },
  subheading: {
    fontSize: width * 0.04,
    color: "#666666",
    marginBottom: height * 0.04,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  label: {
    fontSize: width * 0.035,
    fontWeight: "600",
    color: "#000",
  },
  asterisk: {
    fontSize: width * 0.04,
    color: "#FF0000",
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: height * 0.065,
    alignItems: "center",
    marginBottom: height * 0.04,
  },
  countryCodeBox: {
    backgroundColor: "#EDEDED",
    paddingHorizontal: width * 0.04,
    height: "100%",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#DADADA",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  countryCodeText: {
    fontSize: width * 0.04,
    color: "#333",
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.042,
    color: "#000000",
  },
  button: {
    paddingVertical: height * 0.018,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: height * 0.025,
  },
  buttonText: {
    color: "#FFF",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
  footerText: {
    fontSize: width * 0.035,
    color: "#666666",
    textAlign: "center",
    lineHeight: width * 0.05,
    marginBottom: height * 0.02,
  },
  linkText: {
    textDecorationLine: "underline",
    color: "#1daa30ff",
  },
});

export default MobileLogin;
