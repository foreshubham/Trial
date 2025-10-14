import ReviewCard from '@/components/Shopping/Item/ReviewCard';
import { useReview } from '@/context/ReviewContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    FlatList,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PAGE_SIZE = 10;

export default function AllReviewsScreen() {
  const { reviews } = useReview();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterImage, setFilterImage] = useState(false);
  const navigation = useNavigation();

  const loadMore = () => {
    if (PAGE_SIZE * page < filteredReviews.length) setPage(page + 1);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Filtered Reviews
  const filteredReviews = reviews.filter((r) => {
    if (filterRating && r.rating !== filterRating) return false;
    if (filterImage && !r.image) return false;
    return true;
  });

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.headerTitle}>Customer Reviews</Text>
      <Text style={styles.reviewCount}>{filteredReviews.length} Reviews</Text>

      {/* Filter Row */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, filterImage && styles.activeChip]}
          onPress={() => setFilterImage((prev) => !prev)}
        >
          <Ionicons name="image-outline" size={16} color={filterImage ? '#fff' : '#1D9A6C'} />
          <Text style={[styles.chipText, filterImage && styles.activeChipText]}>With Image</Text>
        </TouchableOpacity>

        {[5,4,3,2,1].map((star) => {
          const isActive = filterRating === star;
          return (
            <TouchableOpacity
              key={star}
              style={[styles.filterChip, isActive && styles.activeChip]}
              onPress={() => setFilterRating(isActive ? null : star)}
            >
              <Text style={[styles.chipText, isActive && styles.activeChipText]}>{star}★</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Solid Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1D9A6C" />
        </TouchableOpacity>
        <Text style={styles.headerText}>All Reviews</Text>
      </View>

      {/* Review List */}
      <FlatList
        data={filteredReviews.slice(0, PAGE_SIZE * page)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReviewCard review={item} glassStyle />}
        ListHeaderComponent={ListHeader}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7FAF8', paddingTop: Platform.OS === 'android' ? 25 : 0 },

  // Solid Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(29,154,108,0.1)',
  },
  headerText: { fontSize: 20, fontWeight: '700', color: '#1D9A6C' },

  // List Header
  listHeader: {
    marginBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1E352F', marginBottom: 4 },
  reviewCount: { fontSize: 14, color: '#777', marginBottom: 8 },

  // Filter Chips
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 6,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1D9A6C',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
    backgroundColor: '#fff',
  },
  activeChip: { backgroundColor: '#1D9A6C', borderColor: '#1D9A6C' },
  chipText: { color: '#1D9A6C', marginLeft: 4, fontSize: 13, fontWeight: '500' },
  activeChipText: { color: '#fff' },
});
