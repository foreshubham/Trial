import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const Header = () => {
  const navigation = useNavigation();
  const [address, setAddress] = useState("Alok Apartments, Rohini...");
  const [modalVisible, setModalVisible] = useState(false);
  const [newAddress, setNewAddress] = useState(address);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const geoCode = await Location.reverseGeocodeAsync(location.coords);

      if (geoCode.length > 0) {
        const { name, street, city, postalCode } = geoCode[0];
        const formatted = `${name || ""}, ${street || ""}, ${city || ""} ${
          postalCode || ""
        }`;
        setNewAddress(formatted.trim());
      }
    } catch (error) {
      alert("Unable to fetch location.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSaveAddress = () => {
    setAddress(newAddress);
    setModalVisible(false);
  };

  return (
    <LinearGradient
      colors={["#2C9C46", "#1D6B30"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerWrapper}
    >
      <View style={styles.innerContainer}>
        {/* Back Button */}
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Address Section */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addressWrapper}
        >
          <Text style={styles.deliverLabel}>DELIVER TO</Text>
          <Text numberOfLines={1} style={styles.addressText}>
            {address}
          </Text>
        </TouchableOpacity>

        {/* Action Icons */}
        <View style={styles.actionIcons}>
          <ActionIcon
           
            icon="cart-outline"
            colors={["#ffffff", "#e0ffe8"]}
            iconColor="#2C9C46"
          
          />
          <ActionIcon
            
            icon="heart-outline"
            colors={["#ffffff", "#fbe9f1"]}
            iconColor="#E91E63"
          />
        </View>
      </View>

      {/* Modal for editing address */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Delivery Address</Text>
            <TextInput
              value={newAddress}
              onChangeText={setNewAddress}
              placeholder="Enter new address"
              style={styles.input}
            />

            <TouchableOpacity
              onPress={getCurrentLocation}
              style={styles.locationBtn}
            >
              <Text style={styles.locationText}>
                {loadingLocation
                  ? "Fetching location..."
                  : "Use My Current Location"}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveAddress}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

// Reusable Action Icon Component
const ActionIcon = ({ onPress, icon, colors, iconColor }: any) => (
  <TouchableOpacity onPress={onPress} style={styles.iconCircle}>
    <LinearGradient colors={colors} style={styles.gradientIcon}>
      <Ionicons name={icon} size={20} color={iconColor} />
    </LinearGradient>
  </TouchableOpacity>
);

export default Header;

const styles = StyleSheet.create({
  headerWrapper: {
    paddingTop: Platform.OS === "ios" ? 58 : 48,
    paddingHorizontal: 20,
    paddingBottom: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    backgroundColor: "#2C9C46",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    marginRight: 12,
  },
  addressWrapper: {
    flex: 1,
    marginRight: 16,
  },
  deliverLabel: {
    color: "#c9f7da",
    fontSize: 12,
  },
  addressText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  actionIcons: {
    flexDirection: "row",
    gap: 14,
  },
  iconCircle: {
    borderRadius: 50,
    overflow: "hidden",
    elevation: 4,
    backgroundColor: "#fff",
  },
  gradientIcon: {
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000080",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: width * 0.9,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
  },
  locationBtn: {
    marginTop: 10,
  },
  locationText: {
    color: "#10B981",
    fontWeight: "bold",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  cancelText: {
    color: "red",
    marginRight: 20,
  },
  saveText: {
    color: "green",
  },
});
