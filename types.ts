export type Language = 'en' | 'hi';
export type Theme = 'light' | 'dark';
export type UserRole = 'admin' | 'customer' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  points: number;
  pointsExpiry?: string; // ISO Date
  addresses: Address[];
  wishlist: string[]; // Product IDs
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface Product {
  id: string;
  name_en: string;
  name_hi: string;
  generic_name: string;
  category: string;
  price: number; // Selling Price
  mrp: number;   // Maximum Retail Price (Original Price)
  stock: number;
  type: 'OTC' | 'Prescription';
  expiry: string; // ISO Date
  batch_number: string;
  manufacturer: string;
  description_en: string;
  description_hi: string;
  image: string;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  discount: number;
  pointsRedeemed: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  address: Address;
}

export interface ShopSettings {
  name: string;
  owner: string;
  address: string;
  phone: string;
  deliveryRadiusKm: number;
  loyaltyRatio: number; // Spend X get 1 point
  pointValue: number; // 1 point = X rupees
  minFreeDelivery: number;
  deliveryCharge: number;
}

export interface StatData {
  name: string;
  value: number;
}