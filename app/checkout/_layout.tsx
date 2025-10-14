// app/checkout/_layout.tsx
import { Stack } from 'expo-router';

export default function CheckoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
        animation: 'slide_from_right', // animation
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Checkout Home' }}
      />
  
    </Stack>
  );
}
