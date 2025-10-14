import { HTTP_URL } from "@/constants/urls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface User {
  id?: string;
  name?: string;
  phoneNumber?: string;
  address?: string;
  lng?: number;
  lat?: number;
}

interface AuthContextProps {
  user: User | null;
  updateUser: (userData: User) => void;
  saveToken: (token: string) => void;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  // we will use this fn on the time when we need to save the token like when the user will verify the otp
  const saveToken = async (token: string) => {
    await AsyncStorage.setItem("token", token);
  };

  // for getting token where we need to do the validation
  const getToken = async (): Promise<string | null> => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      return token;
    }
    return null;
  };

  const updateUser = (userData: User) => {
    setUser((prev) => ({
      ...prev,
      ...userData,
    }));
  };

  // for fetching real details by verifying the token on the backend
  const fetchUser = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${HTTP_URL}/common/get-user`, {
        method: "GET",
        headers: {
          Cookie: token ? `token=${token}` : "",
        },
      });

      const data = await res.json();

      if (res.ok) {
        updateUser(data.user);
      }

      router.push("/(auth)/signup");
    } catch (error) {
      console.log(error);
      router.push("/(auth)/signup");
    }
  };

  // useEffect(() => {
  //   fetchUser();
  // }, []);
  return (
    <AuthContext.Provider value={{ user, updateUser, saveToken, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
