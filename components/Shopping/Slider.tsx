// src/components/Common/Slider/Slider.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Use @ alias for assets
const SLIDER_IMAGES = [
  require("@/assets/mockups/m1.png"),
  require("@/assets/mockups/m2.png"),
  require("@/assets/mockups/m3.png"),
];

export default function ImageSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  const onViewRef = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  });

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % SLIDER_IMAGES.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const renderItem: ListRenderItem<any> = ({ item }) => (
    <Image source={item} style={styles.slideImage} />
  );

  return (
    <View style={styles.sliderWrapper}>
      <FlatList
        ref={flatListRef}
        data={SLIDER_IMAGES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />
      <View style={styles.pagination}>
        {SLIDER_IMAGES.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, { opacity: index === activeIndex ? 1 : 0.3 }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderWrapper: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  slideImage: {
    width: width - 40,
    height: 130,
    borderRadius: 12,
    resizeMode: "cover",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    justifyContent: "center",
    width: width - 40,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    margin: 4,
  },
});
