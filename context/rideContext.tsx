// src/contexts/RideContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useState
} from "react";

// Types
export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  profileImage: string;
  location?: { lat: number; lng: number };
}

export interface Vehicle {
  id: string;
  model: string;
  numberPlate: string;
  color: string;
  type: string; // "car" | "bike" | "auto"
}

export interface Ride {
  pickupLocation: string;
  dropoffLocation: string;
  id: string;
  pickup: string;
  drop: string;
  time: string;
  status:
    | "SEARCHING"
    | "DRIVER_ASSIGNED"
    | "ARRIVING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";
  fare: number;
  estimatedFare?: number;
  otp?: string;
  driver?: Driver | null;
  vehicle?: Vehicle | null;
  driverLocation?: { lat: number; lng: number };
  startTime?: string;
  endTime?: string;
}

interface RideContextType {
  rideHistory: Ride[];
  currentRide: Ride | null;
  bookRide: (rideDetails: Omit<Ride, "id" | "status" | "fare">) => void;
}

const RideContext = createContext<RideContextType>({} as RideContextType);

// Provider Component
export const RideProvider = ({ children }: { children: ReactNode }) => {
  const [rideHistory, setRideHistory] = useState<Ride[]>([]);
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);

  const bookRide = (rideDetails: Omit<Ride, "id" | "status" | "fare">) => {
    const newRide: Ride = {
      id: "123",
      pickup: rideDetails.pickup,
      drop: rideDetails.drop,
      time: rideDetails.time,
      status: "COMPLETED",
      fare: Math.floor(Math.random() * 200) + 100, // Random fare
    };

    setRideHistory((prev) => [newRide, ...prev]);
    setCurrentRide(newRide);
  };

  return (
    <RideContext.Provider value={{ rideHistory, currentRide, bookRide }}>
      {children}
    </RideContext.Provider>
  );
};

// Custom Hook
export const useRide = () => {
  const context = useContext(RideContext);
  if (!context) throw new Error("useRide must be used within RideProvider");
  return context;
};
