import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useAuth } from "@/context/auth";
import { CartProvider } from "@/context/CartContext";
import { LikedProvider } from "@/context/LikedContext";
import { LocationProvider } from "@/context/LocationContext";
import { OrderProvider } from "@/context/OrderContext";
import { AppProvider } from "@/context/Provider";
import { ReviewProvider } from "@/context/ReviewContext";
import { RideProvider } from "@/context/rideContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function RootNavigator() {
  const { user } = useAuth();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" },
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="ride" />
          <Stack.Screen name="food" />
          <Stack.Screen name="shopping" />
          <Stack.Screen name="checkout" />
        </>
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RideProvider>
        <OrderProvider>
          <CartProvider>
            <LikedProvider>
              <ReviewProvider>
                <LocationProvider>
                  <RootNavigator />
                  <StatusBar
                    style="dark"
                    backgroundColor="#FFFFFF"
                    translucent={false}
                  />
                </LocationProvider>
              </ReviewProvider>
            </LikedProvider>
          </CartProvider>
        </OrderProvider>
      </RideProvider>
    </AppProvider>
  );
}
