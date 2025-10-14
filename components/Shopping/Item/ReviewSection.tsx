import { useReview } from "@/context/ReviewContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Image,
    KeyboardAvoidingView,
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const REVIEW_PREVIEW_COUNT = 3; // Show only 3 reviews on this page

export default function ReviewSection() {
  const { reviews, addReview } = useReview();
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [filter, setFilter] = useState<number | null>(null);

  const animatedValue = useRef(new Animated.Value(0)).current;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow gallery access to upload an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAdd = () => {
    if (!name || !comment || rating === 0)
      return Alert.alert("Please fill in all fields");
    addReview(name, rating, comment, image ?? undefined);
    setName("");
    setRating(0);
    setComment("");
    setImage(null);
  };

  const avg =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const filteredReviews = filter ? reviews.filter(r => r.rating === filter) : reviews;
  const displayedReviews = filteredReviews.slice(0, REVIEW_PREVIEW_COUNT);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFilterSelect = (star: number) => {
    setFilter(filter === star ? null : star);
    Animated.spring(animatedValue, {
      toValue: star - 1,
      useNativeDriver: true,
      stiffness: 120,
    }).start();
  };

  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => filteredReviews.filter(r => r.rating === star).length / (filteredReviews.length || 1)
  );

  const ListHeader = () => (
    <View>
      {/* Header and Rating Summary */}
      <Text style={styles.header}>Customer Reviews</Text>
      <View style={styles.ratingCard}>
        <Text style={styles.avgText}>{avg}</Text>
        <View style={styles.starRow}>
          {[...Array(5)].map((_, i) => (
            <Ionicons
              key={i}
              name={i < Math.round(Number(avg)) ? "star" : "star-outline"}
              size={22}
              color="#FFD700"
            />
          ))}
        </View>
        <Text style={styles.reviewCount}>{reviews.length} Reviews</Text>

        {[5, 4, 3, 2, 1].map((star, idx) => (
          <View key={star} style={styles.ratingBarRow}>
            <Text style={styles.barStar}>{star}★</Text>
            <View style={styles.barBackground}>
              <Animated.View
                style={[styles.barFill, { width: `${ratingCounts[idx] * 100}%` }]}
              />
            </View>
            <Text style={styles.barPercent}>{Math.round(ratingCounts[idx] * 100)}%</Text>
          </View>
        ))}
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {[5, 4, 3, 2, 1].map(star => {
          const isActive = filter === star;
          return (
            <TouchableOpacity
              key={star}
              onPress={() => handleFilterSelect(star)}
              style={[styles.filterChip, isActive && styles.activeChip]}
            >
              <Text style={[styles.chipText, isActive && styles.activeChipText]}>{star}★</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Add Review */}
      <View style={styles.addCard}>
        <Text style={styles.addTitle}>Write a Review</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#777"
        />
        <TextInput
          style={[styles.input, { height: 90 }]}
          placeholder="Share your experience..."
          value={comment}
          onChangeText={setComment}
          multiline
          placeholderTextColor="#777"
        />
        <View style={styles.starSelect}>
          {[...Array(5)].map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
              <Ionicons
                name={i < rating ? "star" : "star-outline"}
                size={30}
                color="#FFD700"
              />
            </TouchableOpacity>
          ))}
        </View>
        {image ? (
          <Image source={{ uri: image }} style={styles.preview} />
        ) : (
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Ionicons name="image-outline" size={24} color="#1D9A6C" />
            <Text style={styles.imageText}>Upload Image</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.submitButton} onPress={handleAdd}>
          <Text style={styles.submitText}>Post Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <FlatList
        data={displayedReviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isExpanded = expanded[item.id];
          const isLong = item.comment.length > 100;
          const displayText = isExpanded
            ? item.comment
            : `${item.comment.substring(0, 100)}${isLong ? "..." : ""}`;

          return (
            <View style={styles.reviewCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.userName}>{item.userName}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
              <View style={styles.starRow}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < item.rating ? "star" : "star-outline"}
                    size={18}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.comment}>{displayText}</Text>
              {isLong && (
                <TouchableOpacity
                  onPress={() => toggleExpand(item.id)}
                  style={styles.readMoreBtn}
                >
                  <Text style={styles.readMoreText}>
                    {isExpanded ? "Show Less" : "Read More"}
                  </Text>
                </TouchableOpacity>
              )}
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={styles.reviewImage}
                  resizeMode="cover"
                />
              )}
            </View>
          );
        }}
        ListFooterComponent={
          filteredReviews.length > REVIEW_PREVIEW_COUNT ? (
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => router.push("/shopping/AllReviewScreen")}
            >
              <Text style={styles.viewAllText}>View All Reviews</Text>
            </TouchableOpacity>
          ) : null
        }
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAF8", paddingHorizontal: 18, paddingTop: 12 },
  header: { fontSize: 24, fontWeight: "700", color: "#1E352F", marginBottom: 16 },
  ratingCard: { backgroundColor: "rgba(255,255,255,0.85)", borderRadius: 20, paddingVertical: 20, alignItems: "center", borderWidth: 1, borderColor: "rgba(0,0,0,0.05)", marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  avgText: { fontSize: 48, fontWeight: "700", color: "#1D9A6C" },
  starRow: { flexDirection: "row", marginVertical: 6 },
  reviewCount: { color: "#555" },
  ratingBarRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  barStar: { width: 20, fontSize: 12 },
  barBackground: { flex: 1, height: 6, backgroundColor: "#ddd", borderRadius: 3, marginHorizontal: 6 },
  barFill: { height: 6, backgroundColor: "#1D9A6C", borderRadius: 3 },
  barPercent: { width: 30, fontSize: 12 },
  filterRow: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", marginBottom: 14 },
  filterChip: { borderWidth: 1, borderColor: "#1D9A6C", borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14, margin: 4, backgroundColor: "white" },
  activeChip: { backgroundColor: "#1D9A6C" },
  chipText: { color: "#1D9A6C", fontWeight: "500" },
  activeChipText: { color: "#fff" },
  reviewCard: { backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 16, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  userName: { fontSize: 16, fontWeight: "600", color: "#222" },
  date: { fontSize: 12, color: "#777" },
  comment: { color: "#333", marginTop: 6, fontSize: 14, lineHeight: 20 },
  reviewImage: { marginTop: 10, width: "100%", height: 160, borderRadius: 12 },
  readMoreBtn: { marginTop: 4, alignSelf: "flex-end" },
  readMoreText: { color: "#1D9A6C", fontWeight: "500" },
  addCard: { backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 20, padding: 16, marginTop: 16, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  addTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12, color: "#1E352F" },
  input: { backgroundColor: "#fff", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#ddd", fontSize: 14, marginBottom: 12 },
  starSelect: { flexDirection: "row", justifyContent: "center", marginBottom: 14 },
  imageButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(29,154,108,0.1)", borderRadius: 12, padding: 12, marginBottom: 16 },
  imageText: { color: "#1D9A6C", fontWeight: "600", marginLeft: 8 },
  preview: { width: "100%", height: 160, borderRadius: 12, marginBottom: 14 },
  submitButton: { backgroundColor: "#1D9A6C", paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  viewAllBtn: { padding: 14, alignItems: "center", backgroundColor: "#1D9A6C", borderRadius: 12, marginVertical: 10 },
  viewAllText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
