// src/context/LocationContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationContextProps {
  location: Location | null;
  setLocation: (location: Location) => void;
}

const LocationContext = createContext<LocationContextProps | undefined>(
  undefined
);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<Location | null>(null);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

// ✅ Custom hook for easier usage
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error(
      "useLocation must be used within a LocationProvider"
    );
  }
  return context;
};
