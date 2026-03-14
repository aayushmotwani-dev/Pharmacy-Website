import { Product, ShopSettings, User } from './types';

export const CATEGORIES = [
  'Pain Relief',
  'Antibiotics',
  'Vitamins',
  'Diabetes',
  'Cardiac',
  'Skin Care',
  'First Aid',
  'Baby Care'
];

export const INITIAL_SETTINGS: ShopSettings = {
  name: "Jabalpur Generic Meds",
  owner: "Mr. Sharma",
  address: "123 Wright Town, Jabalpur, MP, 482002",
  phone: "+91 98765 43210",
  deliveryRadiusKm: 30,
  loyaltyRatio: 1, // 1 INR = 1 Point
  pointValue: 0.1, // 1 Point = 0.1 INR (10 points = 1 Rupee)
  minFreeDelivery: 500,
  deliveryCharge: 50
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name_en: 'Paracetamol 500mg',
    name_hi: 'पैरासिटामोल ५०० मिग्रा',
    generic_name: 'Acetaminophen',
    category: 'Pain Relief',
    price: 20,
    mrp: 30,
    stock: 500,
    type: 'OTC',
    expiry: '2025-12-31',
    batch_number: 'B123',
    manufacturer: 'Generic India',
    description_en: 'Effective for fever and mild pain relief.',
    description_hi: 'बुखार और हल्के दर्द से राहत के लिए प्रभावी।',
    image: 'https://picsum.photos/400/400?random=1',
    rating: 4.5,
    reviews: 120
  },
  {
    id: '2',
    name_en: 'Vitamin C 500mg',
    name_hi: 'विटामिन सी ५०० मिग्रा',
    generic_name: 'Ascorbic Acid',
    category: 'Vitamins',
    price: 45,
    mrp: 60,
    stock: 200,
    type: 'OTC',
    expiry: '2024-10-15',
    batch_number: 'V999',
    manufacturer: 'HealthBoost',
    description_en: 'Boosts immunity and skin health.',
    description_hi: 'रोग प्रतिरोधक क्षमता और त्वचा के स्वास्थ्य को बढ़ाता है।',
    image: 'https://picsum.photos/400/400?random=2',
    rating: 4.8,
    reviews: 85
  },
  {
    id: '3',
    name_en: 'Amoxicillin 250mg',
    name_hi: 'एमोक्सिसिलिन २५० मिग्रा',
    generic_name: 'Amoxicillin Trihydrate',
    category: 'Antibiotics',
    price: 80,
    mrp: 120,
    stock: 50,
    type: 'Prescription',
    expiry: '2025-05-20',
    batch_number: 'A555',
    manufacturer: 'MedCure',
    description_en: 'Antibiotic for bacterial infections.',
    description_hi: 'जीवाणु संक्रमण के लिए एंटीबायोटिक।',
    image: 'https://picsum.photos/400/400?random=3',
    rating: 4.2,
    reviews: 40
  },
  {
    id: '4',
    name_en: 'Metformin 500mg',
    name_hi: 'मेटफॉर्मिन ५०० मिग्रा',
    generic_name: 'Metformin Hydrochloride',
    category: 'Diabetes',
    price: 35,
    mrp: 50,
    stock: 1000,
    type: 'Prescription',
    expiry: '2026-01-01',
    batch_number: 'D101',
    manufacturer: 'SugarFree Labs',
    description_en: 'Used for treating type 2 diabetes.',
    description_hi: 'टाइप 2 मधुमेह के उपचार के लिए उपयोग किया जाता है।',
    image: 'https://picsum.photos/400/400?random=4',
    rating: 4.6,
    reviews: 200
  }
];

export const MOCK_ADMIN_USER: User = {
  id: 'admin-1',
  name: 'Dad (Admin)',
  email: 'admin@shop.com',
  role: 'admin',
  points: 0,
  addresses: [],
  wishlist: []
};

export const MOCK_CUSTOMER_USER: User = {
  id: 'cust-1',
  name: 'Rahul Verma',
  email: 'rahul@example.com',
  role: 'customer',
  phone: '9876543210',
  points: 450,
  pointsExpiry: '2025-11-15',
  addresses: [
    {
      id: 'addr-1',
      street: '45 Napier Town',
      city: 'Jabalpur',
      state: 'MP',
      zip: '482001',
      isDefault: true
    }
  ],
  wishlist: ['2']
};

export const TRANSLATIONS = {
  en: {
    dashboard: "Dashboard",
    products: "Products",
    orders: "Orders",
    settings: "Settings",
    login: "Login",
    search: "Search medicines...",
    addToCart: "Add to Cart",
    outOfStock: "Out of Stock",
    home: "Home",
    loyaltyPoints: "Loyalty Points",
    value: "Value",
    expiry: "Expires",
    myAccount: "My Account",
    adminPanel: "Admin Panel",
    welcome: "Welcome",
    totalOrders: "Total Orders",
    totalSales: "Total Sales",
    lowStock: "Low Stock",
    save: "Save",
    saving: "Saving...",
    saved: "Saved ✓",
    validationError: "Please fix errors",
    confirmDelete: "Are you sure you want to delete?",
    required: "Required",
    discount: "OFF",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    products: "उत्पाद",
    orders: "ऑर्डर",
    settings: "सेटिंग्स",
    login: "लॉग इन",
    search: "दवाइयां खोजें...",
    addToCart: "कार्ट में डालें",
    outOfStock: "स्टॉक खत्म",
    home: "होम",
    loyaltyPoints: "लॉयल्टी पॉइंट्स",
    value: "मूल्य",
    expiry: "समाप्ति",
    myAccount: "मेरा खाता",
    adminPanel: "व्यवस्थापक पैनल",
    welcome: "स्वागत है",
    totalOrders: "कुल ऑर्डर",
    totalSales: "कुल बिक्री",
    lowStock: "कम स्टॉक",
    save: "सेव करें",
    saving: "सेव हो रहा है...",
    saved: "सेव हो गया ✓",
    validationError: "कृपया त्रुटियों को ठीक करें",
    confirmDelete: "क्या आप वाकई हटाना चाहते हैं?",
    required: "आवश्यक",
    discount: "छूट",
  }
};