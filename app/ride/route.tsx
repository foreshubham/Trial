import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

const GREEN = "#2C9C46";
const LIGHT_BG = "#FFFFFF";
const CARD_BG = "#F6F7F9";
const TEXT_PRIMARY = "#1F2937";
const TEXT_MUTED = "#6B7280";

const { height } = Dimensions.get("window");
const STATUS_BAR_HEIGHT = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 35;
const BOTTOM_INSET = Platform.OS === "android" ? 20 : 34;

function AppHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <View style={[styles.headerWrap, { paddingTop: STATUS_BAR_HEIGHT, height: 56 + STATUS_BAR_HEIGHT }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.headerIcon}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerIcon} />
      </View>
    </View>
  );
}

interface Vehicle {
  id: string;
  name: string;
  price: number;
  icon: string;
  time: string;
  distance: string;
  capacity: string;
  baseFare: number;
  perKm: number;
}

export default function RouteSelectionScreen() {
  const router = useRouter();
  const { pickup, drop } = useLocalSearchParams();

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{ baseFare: number; perKm: number; name: string } | null>(null);

  const pickupCoords = { latitude: 28.7041, longitude: 77.1025 };
  const dropCoords = { latitude: 28.5355, longitude: 77.391 };

  const estimatedDistance = "22 km";

  const vehicles: Vehicle[] = [
    {
      id: "1",
      name: "Bike",
      price: 50,
      icon: "bicycle",
      time: "10 mins",
      distance: estimatedDistance,
      capacity: "1 passenger",
      baseFare: 20,
      perKm: 10,
    },
    {
      id: "2",
      name: "e-Rickshaw",
      price: 70,
      icon: "bicycle",
      time: "15 mins",
      distance: estimatedDistance,
      capacity: "3 passengers",
      baseFare: 25,
      perKm: 12,
    },
    {
      id: "3",
      name: "e-Auto",
      price: 90,
      icon: "car-sport",
      time: "14 mins",
      distance: estimatedDistance,
      capacity: "4 passengers",
      baseFare: 30,
      perKm: 14,
    },
    {
      id: "4",
      name: "Car",
      price: 150,
      icon: "car-outline",
      time: "15 mins",
      distance: estimatedDistance,
      capacity: "4 passengers",
      baseFare: 50,
      perKm: 20,
    },
  ];

  const handleConfirm = () => {
    if (!selectedVehicle) {
      alert("Please select a vehicle type");
      return;
    }

    router.push({
      pathname: "/ride/assigning",
      params: {
        pickup: String(pickup),
        drop: String(drop),
        time: new Date().toISOString(),
        vehicle: JSON.stringify(selectedVehicle),
      },
    });
  };

  const openFareInfo = (vehicle: Vehicle) => {
    setModalContent({
      baseFare: vehicle.baseFare,
      perKm: vehicle.perKm,
      name: vehicle.name,
    });
    setModalVisible(true);
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.container}>
        <AppHeader title="Choose a Ride" onBack={() => router.back()} />

        <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={{
            latitude: (pickupCoords.latitude + dropCoords.latitude) / 2,
            longitude: (pickupCoords.longitude + dropCoords.longitude) / 2,
            latitudeDelta: 0.3,
            longitudeDelta: 0.3,
          }}
        >
          <Marker coordinate={pickupCoords} title="Pickup" pinColor="#10B981" />
          <Marker coordinate={dropCoords} title="Drop" pinColor="#EF4444" />
        </MapView>

        <View style={styles.bottomCard}>
          <Text style={styles.vehiclesTitle}>Available Vehicles</Text>

          <FlatList
            data={vehicles}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedVehicle(item)}
                style={[
                  styles.vehicleCard,
                  selectedVehicle?.id === item.id && styles.selectedVehicle,
                ]}
                activeOpacity={0.9}
              >
                <View style={styles.vehicleIconWrapper}>
                  <Ionicons name={item.icon as any} size={32} color={GREEN} />
                </View>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>{item.name}</Text>
                  <Text style={styles.vehicleDetails}>
                    {item.distance} • {item.time} • Capacity: {item.capacity}
                  </Text>
                  <View style={styles.fareRow}>
                    <Text style={styles.priceText}>Approx: ₹{item.price}</Text>
                    <TouchableOpacity onPress={() => openFareInfo(item)}>
                      <Ionicons name="information-circle-outline" size={18} color={GREEN} style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            onPress={handleConfirm}
            style={[styles.confirmButton, !selectedVehicle && styles.disabledButton]}
            disabled={!selectedVehicle}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>Confirm Ride</Text>
          </TouchableOpacity>
        </View>

        {/* Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{modalContent?.name} Fare Details</Text>
              <Text style={styles.modalText}>Base Fare: ₹{modalContent?.baseFare}</Text>
              <Text style={styles.modalText}>Per Kilometer Charge: ₹{modalContent?.perKm}</Text>
              <Text style={styles.modalNote}>
                The approximate fare is calculated as base fare plus distance multiplied by per kilometer charge.
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },

  headerWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: GREEN,
    zIndex: 100,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  headerRow: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  map: {
    flex: 1,
    marginTop: 56 + STATUS_BAR_HEIGHT,
  },

  bottomCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CARD_BG,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: BOTTOM_INSET + 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -5 },
    elevation: 12,
  },

  vehiclesTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },

  vehicleCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  selectedVehicle: {
    borderColor: GREEN,
    borderWidth: 2,
    backgroundColor: "#E6F4EA",
  },

  vehicleIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#D1EAD4",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },

  vehicleInfo: {
    marginLeft: 16,
    flex: 1,
  },

  vehicleName: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },

  vehicleDetails: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginTop: 6,
  },

  fareRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  priceText: {
    fontSize: 16,
    color: GREEN,
    fontWeight: "700",
  },

  confirmButton: {
    backgroundColor: GREEN,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  disabledButton: {
    backgroundColor: "#a5d6a7",
  },

  confirmButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    marginHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },

  modalText: {
    fontSize: 16,
    marginBottom: 8,
    color: TEXT_PRIMARY,
  },

  modalNote: {
    fontSize: 14,
    color: TEXT_MUTED,
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
  },

  modalCloseButton: {
    backgroundColor: GREEN,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },

  modalCloseText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

