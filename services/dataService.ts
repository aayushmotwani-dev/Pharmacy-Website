import { Product, Order, User, ShopSettings } from '../types';
import { MOCK_PRODUCTS, INITIAL_SETTINGS, MOCK_ADMIN_USER, MOCK_CUSTOMER_USER } from '../constants';

// Keys for localStorage
const KEYS = {
  PRODUCTS: 'jabalpur_meds_products',
  ORDERS: 'jabalpur_meds_orders',
  SETTINGS: 'jabalpur_meds_settings',
  USERS: 'jabalpur_meds_users',
  CURRENT_USER: 'jabalpur_meds_current_user'
};

// Helper to load or initialize data
const loadData = <T,>(key: string, defaultData: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch (e) {
    console.error(`Error loading ${key}`, e);
    return defaultData;
  }
};

const saveData = <T,>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Service object
export const DataService = {
  getProducts: (): Product[] => loadData(KEYS.PRODUCTS, MOCK_PRODUCTS),
  saveProducts: (products: Product[]) => saveData(KEYS.PRODUCTS, products),
  
  getOrders: (): Order[] => loadData(KEYS.ORDERS, []),
  saveOrders: (orders: Order[]) => saveData(KEYS.ORDERS, orders),
  
  getSettings: (): ShopSettings => loadData(KEYS.SETTINGS, INITIAL_SETTINGS),
  saveSettings: (settings: ShopSettings) => saveData(KEYS.SETTINGS, settings),

  // Simple Auth Simulation
  login: (email: string, role: 'admin' | 'customer'): User | null => {
    if (role === 'admin' && email === MOCK_ADMIN_USER.email) return MOCK_ADMIN_USER;
    if (role === 'customer') {
      // For demo, just return the mock customer if email matches, or create a new temp one
      if (email === MOCK_CUSTOMER_USER.email) return MOCK_CUSTOMER_USER;
      return { ...MOCK_CUSTOMER_USER, id: 'new-cust', email, name: 'New Customer', points: 0 };
    }
    return null;
  }
};