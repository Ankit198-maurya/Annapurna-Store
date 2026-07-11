export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  mrp: number;
  unit: string;
  description: string;
  isVeg: boolean;
  specialOffer?: string; // e.g. "Special Price Rs. 10", "20% Extra", "Save 10%"
  colorTheme: string; // e.g. 'orange', 'blue', 'emerald', 'yellow', 'red', 'purple'
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: {
    name: string;
    phone: string;
    flat: string;
    area: string;
    landmark: string;
    city: string;
    pincode: string;
    email?: string;
    address?: string;
    latitude?: string;
    longitude?: string;
  };
  paymentMethod: 'cod' | 'upi' | 'card';
  status: 'pending' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled';
  timestamp: string;
  eta: number; // minutes remaining
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  description: string;
  color: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imagePlaceholder: string;
  ingredients: {
    productId: string;
    quantityRequired: number;
    customNote?: string;
  }[];
  steps: string[];
}
