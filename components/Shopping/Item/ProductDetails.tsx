import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
    Animated,
    Easing,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    UIManager
} from "react-native";

// Enable animations on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Section {
  title: string;
  content: string[];
}

const sections: Section[] = [
  {
    title: "Top Highlights",
    content: [
      "Lightweight and durable material",
      "Soft touch fabric with breathable weave",
      "Sustainably crafted using eco-friendly dyes",
      "Perfect for premium everyday wear",
    ],
  },
  {
    title: "Product Specification",
    content: [
      "Material: 100% Organic Cotton",
      "Fit: Relaxed modern silhouette",
      "Pattern: Minimal solid finish",
      "Care: Gentle machine wash cold",
    ],
  },
  {
    title: "About the Brand",
    content: [
      "Crafted by artisans with over a decade of design heritage.",
      "Blending modern technology with timeless elegance.",
    ],
  },
  {
    title: "Additional Information",
    content: [
      "Country of Origin: India",
      "Warranty: 12 months on manufacturing defects",
      "Sustainability Index: 92%",
    ],
  },
  {
    title: "Size Guide",
    content: [
      "S: Chest 36” | Length 27”",
      "M: Chest 38” | Length 28”",
      "L: Chest 40” | Length 29”",
      "XL: Chest 42” | Length 30”",
    ],
  },
];

const ProductDetails = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  const toggleSection = (index: number) => {
    const isActive = activeIndex === index;
    if (isActive) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.96,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => setActiveIndex(null));
    } else {
      setActiveIndex(index);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.96);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          delay: 80,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <LinearGradient
      colors={["#f5fdf7", "#e9f5ec", "#f7faf9"]}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <Text style={styles.title}>Product Details</Text>

        {sections.map((section, index) => {
          const isActive = activeIndex === index;

          return (
            <Animated.View
              key={index}
              style={[
                styles.card,
                {
                  transform: [{ scale: isActive ? scaleAnim : 1 }],
                  shadowOpacity: isActive ? 0.15 : 0.08,
                },
              ]}
            >
              <Pressable
                android_ripple={{ color: "rgba(46,125,50,0.08)" }}
                style={styles.header}
                onPress={() => toggleSection(index)}
              >
                <Text style={styles.headerText}>{section.title}</Text>
                <Ionicons
                  name={isActive ? "chevron-up-outline" : "chevron-down-outline"}
                  size={22}
                  color={isActive ? "#1b5e20" : "#444"}
                />
              </Pressable>

              {isActive && (
                <Animated.View
                  style={[
                    styles.content,
                    {
                      opacity: fadeAnim,
                      transform: [{ scale: scaleAnim }],
                    },
                  ]}
                >
                  {section.content.map((item, i) => (
                    <Text key={i} style={styles.contentText}>
                      • {item}
                    </Text>
                  ))}
                </Animated.View>
              )}
            </Animated.View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1b5e20",
    textAlign: "center",
    marginBottom: 22,
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e7d32",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  contentText: {
    fontSize: 14.5,
    color: "#333",
    marginBottom: 6,
    lineHeight: 20,
  },
});
