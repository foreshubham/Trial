// app/food/_layout.tsx
import { Stack } from 'expo-router';

export default function FoodLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
        animation: 'slide_from_right', // animation
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Food Home' }}
      />
      <Stack.Screen
        name="restaurant"
        options={{ title: 'Restaurants' }}
      />
      <Stack.Screen
        name="item"
        options={{ title: 'Food Item' }}
      />
   
    </Stack>
  );
}
