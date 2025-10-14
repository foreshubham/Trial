import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { ReactNode } from "react";
import { useColorScheme } from "react-native";
import { AuthProvider } from "./auth";
import { CartProvider } from "./CartContext";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();

  return (
    <>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        ;
      </ThemeProvider>
    </>
  );
};
