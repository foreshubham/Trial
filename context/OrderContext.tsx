import { CartItem, Order } from "@/types/CartItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface OrderContextProps {
  orders: Order[];
  placeOrder: (
    items: CartItem[],
    type: Order["type"],
    meta?: Partial<Order>
  ) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  updateOrderRating: (id: string, rating: number) => void;
  clearOrders: () => void;
  getOrdersByType: (type: Order["type"]) => Order[];
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load from AsyncStorage
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const saved = await AsyncStorage.getItem("orders");
        if (saved) setOrders(JSON.parse(saved));
      } catch (err) {
        console.warn("Failed to load orders:", err);
      }
    };
    loadOrders();
  }, []);

  // Save to AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem("orders", JSON.stringify(orders)).catch((err) =>
      console.warn("Failed to save orders:", err)
    );
  }, [orders]);

  // Place a new order
  const placeOrder = (
    items: CartItem[],
    type: Order["type"],
    meta?: Partial<Order>
  ) => {
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const newOrder: Order = {
      id: Date.now().toString(),
      items,
      total,
      status: "pending",
      type,
      date: new Date().toISOString(),
      ...meta,
    };
    setOrders((prev) => [...prev, newOrder]);
  };

  // Update status
  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  // Update rating
  const updateOrderRating = (id: string, rating: number) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, rating } : o)));
  };

  // Clear all orders
  const clearOrders = () => setOrders([]);

  // Get orders filtered by type
  const getOrdersByType = (type: Order["type"]) =>
    orders.filter((o) => o.type === type);

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateOrderStatus,
        updateOrderRating,
        clearOrders,
        getOrdersByType,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Hook
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
};
