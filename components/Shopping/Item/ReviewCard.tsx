import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Review = {
  userName: string;
  date: string;
  rating: number;
  comment: string;
  image?: string;
};

export default function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.comment.length > 100;
  const displayText = expanded ? review.comment : review.comment.substring(0, 100) + (isLong ? '...' : '');

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.userName}>{review.userName}</Text>
        <Text style={styles.date}>{review.date}</Text>
      </View>
      <View style={styles.stars}>
        {[...Array(5)].map((_, i) => (
          <Ionicons key={i} name={i < review.rating ? 'star' : 'star-outline'} size={18} color="#FFD700" />
        ))}
      </View>
      <Text style={styles.comment}>{displayText}</Text>
      {isLong && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.readMore}>{expanded ? 'Show Less' : 'Read More'}</Text>
        </TouchableOpacity>
      )}
      {review.image && <Image source={{ uri: review.image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 16, padding: 14, marginBottom: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  userName: { fontWeight: '600', fontSize: 16 },
  date: { fontSize: 12, color: '#777' },
  stars: { flexDirection: 'row', marginVertical: 6 },
  comment: { fontSize: 14, lineHeight: 20, color: '#333' },
  readMore: { color: '#1D9A6C', fontWeight: '500', marginTop: 4 },
  image: { width: '100%', height: 160, borderRadius: 12, marginTop: 10 },
});
