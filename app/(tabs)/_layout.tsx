import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Tabs.Screen
        name="activity"
        options={{ headerShown: false }}
      />
      <Tabs.Screen
        name="cart"
        options={{ title: "Cart", headerShown: false }}
      />
      <Tabs.Screen
        name="account"
        options={{ title: "Account", headerShown: false }}
      />
    </Tabs>
  );
}

const icons: Record<string, string> = {
  index: "home",
  activity: "book",
  cart: "cart",
  account: "person",
};

function FloatingTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  // Hide tab bar on these screens
  const hideOnScreens = ["activity", "cart", "account"];
  const currentRouteName = state.routes[state.index].name;
  if (hideOnScreens.includes(currentRouteName)) return null;

  return (
    <SafeAreaView style={{ position: "relative" }}>
      <View
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: insets.bottom + 12,
        }}
      >
        <BlurView
          intensity={90}
          tint="light"
          style={{
            flexDirection: "row",
            borderRadius: 25,
            overflow: "hidden",
            paddingVertical: 10,
            paddingHorizontal: 16,
            justifyContent: "space-around",
            backgroundColor: Platform.OS === "android" ? "rgba(0,0,0,0.31)" : "rgba(0,0,0,0.31)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.2)",
            shadowColor: "#00C853",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                Haptics.selectionAsync();
                navigation.navigate(route.name);
              }
            };

            const animatedStyle = useAnimatedStyle(() => ({
              transform: [
                { scale: withSpring(isFocused ? 1.1 : 1) },
                { translateY: withSpring(isFocused ? -6 : 0) },
              ],
            }));

            return (
              <TouchableOpacity
                key={`${route.name}-${index}`}
                onPress={onPress}
                activeOpacity={0.9}
                style={{ flex: 1, alignItems: "center" }}
              >
                <Animated.View
                  style={[
                    {
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 16,
                      width: 50,
                      height: 50,
                      backgroundColor: isFocused ? "rgba(0,200,83,0.15)" : "transparent",
                      shadowColor: isFocused ? "#009940ff" : "transparent",
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                    },
                    animatedStyle,
                  ]}
                >
                  <Ionicons
                    name={icons[route.name] as any}
                    size={24}
                    color={isFocused ? "#096e2bff" : "#fefefe"}
                  />
                </Animated.View>
                <Text
                  style={{
                    color: isFocused ? "#096e2bff" : "#fefefe",
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </BlurView>
      </View>
    </SafeAreaView>
  );
}
