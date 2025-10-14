export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;

  // Shopping-specific
  size?: string;           // S, M, L, XL
  category?: string;       // e.g., Clothing, Electronics
  color?: string;          // Optional for shopping items
  brand?: string;

  // Food-specific
  mealType?: string;       // Breakfast, Lunch, Dinner
  dietary?: string[];      // Vegan, Gluten-free, etc.
  extras?: string[];       // Extra toppings, sauces

  // Ride-specific
  vehicleType?: string;    // Car, Bike, E-Rickshaw
  pickupLocation?: string;
  dropLocation?: string;

  // Generic
  notes?: string;          // User notes for any item
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed" | "in-progress" | "delivered" | "cancelled";
  type: "ride" | "food" | "shopping";
  date: string;
  sides?: CartItem[];

  // Optional meta
  deliveryTime?: string;       // Estimated delivery or pickup time
  paymentMethod?: string;      // Cash, Card, UPI, Wallet
  promoCode?: string;          // Applied discount
  discount?: number;           // Amount of discount
  rating?: number;             // User rating for order
}
