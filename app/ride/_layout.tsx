// app/ride/_layout.tsx
import { Stack } from 'expo-router';

export default function RideLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
        animation: 'slide_from_right', // animation
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Ride Home' }}
      />
      <Stack.Screen
        name="route"
        options={{ title: 'Route Selection' }}
        />
      <Stack.Screen
        name="details"
        options={{ title: 'Ride Details' }}
        />
        
      <Stack.Screen
        name="assigning"
        options={{ title: 'Assigning' }}
      />
      <Stack.Screen
        name="driverArriving"
        options={{ title: 'Driver Arriving' }}
      />
      <Stack.Screen
        name="rideStarted"
        options={{ title: 'Ride Started' }}
      />
    </Stack>
  );
}
