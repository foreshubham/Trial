import {
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
// import BottomNav from "@/components/Food/BottomNav";
import { useAuth } from "@/context/auth";

const { width } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = 220;
const HEADER_MIN_HEIGHT = 80;
const SCROLL_THRESHOLD = 100;

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AccountScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const toggleExpand = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = () => {
    logout();
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const profileOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const compactHeaderOpacity = scrollY.interpolate({
    inputRange: [SCROLL_THRESHOLD - 10, SCROLL_THRESHOLD + 10],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View style={[styles.compactHeader, { opacity: compactHeaderOpacity }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account</Text>
        </Animated.View>

        <Animated.View style={[styles.profileInfo, { opacity: profileOpacity }]}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
          <Text style={styles.name}>{user?.name || "Guest User"}</Text>
          <Text style={styles.phone}>
            {user?.phoneNumber || "No contact info"}
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Overview</Text>

          <OptionRow
            icon="person-outline"
            label="My Profile"
            onPress={() => router.push("/")}
          />
          <OptionRow
            icon="cube-outline"
            label="My Orders"
            onPress={() => router.push("/")}
          />
          <OptionRow icon="lock-closed-outline" label="Change Password" />
          <OptionRow icon="credit-card" label="Payment Methods" />
          <OptionRow icon="location-outline" label="Manage Addresses" />

          <ExpandableRow
            icon="settings-outline"
            label="Settings"
            expanded={expanded["settings"]}
            toggle={() => toggleExpand("settings")}
            options={[
              { label: "Notifications", onPress: () => router.push("/") },
              { label: "Language", onPress: () => router.push("/") },
            ]}
          />

          <ExpandableRow
            icon="help-circle-outline"
            label="Help & Support"
            expanded={expanded["help"]}
            toggle={() => toggleExpand("help")}
            options={[
              { label: "FAQs", onPress: () => router.push("/") },
              { label: "Contact Us", onPress: () => router.push("/") },
            ]}
          />

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <View style={styles.logoutContent}>
              <Ionicons name="log-out-outline" size={20} color="#d32f2f" />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

    </View>
  );
}

function OptionRow({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <View style={styles.optionIcon}>
        <Ionicons name={icon} size={20} color="#2C9C46" />
      </View>
      <Text style={styles.optionText}>{label}</Text>
      <Feather name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );
}

function ExpandableRow({
  icon,
  label,
  expanded,
  toggle,
  options,
}: {
  icon: any;
  label: string;
  expanded: boolean;
  toggle: () => void;
  options: { label: string; onPress: () => void }[];
}) {
  return (
    <>
      <TouchableOpacity style={styles.optionRow} onPress={toggle}>
        <View style={styles.optionIcon}>
          <Ionicons name={icon} size={20} color="#2C9C46" />
        </View>
        <Text style={styles.optionText}>{label}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#999"
        />
      </TouchableOpacity>
      {expanded &&
        options.map((opt, index) => (
          <TouchableOpacity
            key={index}
            style={styles.subOption}
            onPress={opt.onPress}
          >
            <Text style={styles.subOptionText}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C9C46",
  },
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: "#2C9C46",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 60,
    zIndex: 10,
  },
  compactHeader: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 16,
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#1db954",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  phone: {
    fontSize: 14,
    color: "#eee",
  },
  scrollContainer: {
    paddingTop: HEADER_MAX_HEIGHT,
    backgroundColor: "#fff",
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    minHeight: 800,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  optionIcon: {
    width: 35,
    height: 35,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "#e8f5e9",
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  subOption: {
    paddingLeft: 60,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
  },
  subOptionText: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#d32f2f",
    backgroundColor: "#fff0f0",
    borderRadius: 10,
    alignItems: "center",
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    marginLeft: 8,
    color: "#d32f2f",
    fontWeight: "bold",
    fontSize: 15,
  },
});
