// app/shopping/_layout.tsx
import { Stack } from 'expo-router';

export default function ShoppingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
        animation: 'slide_from_right', // animation
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Shopping Home' }}
      />
      <Stack.Screen
        name="store"
        options={{ title: 'Shopping Stores' }}
      />
   
      <Stack.Screen
        name="subcategory"
        options={{ title: 'Sub-Category' }}
      />
   
      <Stack.Screen
        name="productDetails"
        options={{ title: 'Product Details' }}
      />
   
      <Stack.Screen
        name="AllReviewScreen"
        options={{ title: 'All Reviews' }}
      />
   
    </Stack>
  );
}
