import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { HTTP_URL } from "@/constants/urls";
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

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const isValid = name.trim() !== "" && phone.length === 10;

  const handleContinue = async () => {
    if (!isValid) {
      Alert.alert(
        "Invalid Input",
        "Please enter a valid name and 10-digit phone number."
      );
      return;
    }

    // added signup endpoint for user signup with phonenumber and name
    try {
      setLoading(true);
      const res = await fetch(`${HTTP_URL}/common/signup/user`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name, phoneNumber: phone }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (res.ok) {
        Alert.alert(
          "Signup Successfull",
          data.message || "OTP has been sent to your phone number"
        );

        router.push({
          pathname: "/(auth)/otp-verify",
          params: {
            phone,
          },
        });
        return;
      }

      Alert.alert(
        "Something went wrong",
        data.message ||
          "Something went wrong while sending OTP to your phone number " + phone
      );
      return;
    } catch (error) {
      Alert.alert("Sending OTP failed", "Please confirm the inputs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
       <StatusBar style="dark" backgroundColor="#FFF" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backArrow}
          >
            <Ionicons name="arrow-back" size={width * 0.06} color="#000" />
          </TouchableOpacity>

          <View style={{ paddingVertical: 20, gap: 5 }}>
            <ThemedText style={styles.heading}>
              Create Your Account 👋
            </ThemedText>
            <ThemedText style={styles.subheading}>
              Enter your details to continue.
            </ThemedText>
          </View>

          {/* Name Field */}
          <View style={styles.labelRow}>
            <ThemedText style={styles.label}>Full Name</ThemedText>
            <ThemedText style={styles.asterisk}> *</ThemedText>
          </View>
          <ThemedView style={styles.inputBox}>
            <TextInput
              style={styles.inputText}
              placeholder="Shubham Singh"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </ThemedView>

          {/* Phone Field */}
          <View style={styles.labelRow}>
            <ThemedText style={styles.label}>Mobile Number</ThemedText>
            <ThemedText style={styles.asterisk}> *</ThemedText>
          </View>
          <ThemedView style={styles.inputBox}>
            <TextInput
              style={styles.inputText}
              placeholder="9600000000"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
          </ThemedView>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isValid ? "#2E7D32" : "#ccc" },
            ]}
            onPress={handleContinue}
            disabled={!isValid || loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading ? "Processing..." : "Continue"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <ThemedText style={styles.loginLink}>
              Already have an account?{" "}
              <ThemedText style={styles.linkText}>Login</ThemedText>
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.03,
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  backArrow: {
    marginBottom: height * 0.02,
  },
  heading: {
    fontSize: width * 0.07,
    fontWeight: "700",
    color: "#000000",
    paddingTop: height * 0.01,
  },
  subheading: {
    fontSize: width * 0.04,
    color: "#666666",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  label: {
    fontSize: width * 0.035,
    fontWeight: "600",
    color: "black",
  },
  asterisk: {
    fontSize: width * 0.04,
    color: "#FF0000",
  },
  inputBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: height * 0.065,
    justifyContent: "center",
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.03,
  },
  inputText: {
    fontSize: width * 0.042,
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
  loginLink: {
    fontSize: width * 0.037,
    color: "#666666",
    textAlign: "center",
    marginTop: height * 0.01,
  },
  linkText: {
    textDecorationLine: "underline",
    color: "#1daa30ff",
  },
});
