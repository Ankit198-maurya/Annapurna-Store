// A selectable pack-size option for a product (e.g. "250 g" vs "500 g").
// When a product has `variants`, the customer must pick one before adding to cart.
export interface ProductVariant {
  id: string; // short unique id within the product, e.g. '250g'
  label: string; // shown on the size pill, e.g. '250 g'
  unit: string; // shown as the product's unit once selected, e.g. '250g'
  price: number;
  mrp: number;
  isDefault?: boolean; // pre-selected size when the card first renders
}

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
  variants?: ProductVariant[]; // optional pack-size choices (e.g. Ghee: 250gm / 500gm)
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
