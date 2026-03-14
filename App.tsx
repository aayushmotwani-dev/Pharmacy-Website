import React, { useState, useEffect, useContext, createContext } from 'react';
import { 
  Menu, X, ShoppingCart, User as UserIcon, LogOut, Sun, Moon, 
  LayoutDashboard, Package, ShoppingBag, Settings, Store, 
  Trash2, Plus, Edit, Search, MapPin, 
  AlertTriangle, ArrowLeft, Loader2, Check, LogIn, Percent, TrendingUp, Star
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { Button, Input, Card, Modal, Badge, Toast, Select, Textarea } from './components/ui/UIComponents';
import { Product, User, ShopSettings, Order, Language, Theme, CartItem } from './types';
import { DataService } from './services/dataService';
import { TRANSLATIONS, CATEGORIES } from './constants';

// --- Contexts ---

interface AppContextType {
  user: User | null;
  login: (email: string, role: 'admin' | 'customer') => void;
  logout: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  cart: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: (order: Order) => void;
  orders: Order[];
  updateOrderStatus: (id: string, status: Order['status']) => void;
  settings: ShopSettings;
  updateSettings: (s: ShopSettings) => void;
  showNotification: (msg: string, type: 'success' | 'error') => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

// --- Main App Component ---

const App: React.FC = () => {
  // Global State
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(DataService.getSettings());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Initialize Data
  useEffect(() => {
    setProducts(DataService.getProducts());
    setOrders(DataService.getOrders());
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // Actions
  const login = (email: string, role: 'admin' | 'customer') => {
    const u = DataService.login(email, role);
    if (u) {
      setUser(u);
      setIsLoginModalOpen(false);
      showNotification(`Welcome back, ${u.name}!`, 'success');
    } else {
      showNotification("Invalid credentials", 'error');
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    showNotification("Logged out successfully", 'success');
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Inventory Management - these update state immediately for all views
  const updateProduct = (updatedProduct: Product) => {
    const newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(newProducts);
    DataService.saveProducts(newProducts);
    showNotification("Product updated successfully", 'success');
  };

  const addProduct = (newProduct: Product) => {
    const newProducts = [...products, newProduct];
    setProducts(newProducts);
    DataService.saveProducts(newProducts);
    showNotification("Product added successfully", 'success');
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    DataService.saveProducts(newProducts);
    showNotification("Product deleted", 'success');
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showNotification("Added to cart", 'success');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const placeOrder = (order: Order) => {
    const newOrders = [order, ...orders];
    setOrders(newOrders);
    DataService.saveOrders(newOrders);
    setCart([]);
    showNotification("Order placed successfully!", 'success');
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    const newOrders = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(newOrders);
    DataService.saveOrders(newOrders);
    showNotification(`Order status updated to ${status}`, 'success');
  }

  const updateSettings = (newSettings: ShopSettings) => {
    setSettings(newSettings);
    DataService.saveSettings(newSettings);
  };

  const contextValue: AppContextType = {
    user, login, logout,
    language, setLanguage,
    theme, toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light'),
    products, addProduct, updateProduct, deleteProduct,
    cart, addToCart, removeFromCart, updateCartQuantity, clearCart: () => setCart([]),
    orders, placeOrder, updateOrderStatus,
    settings, updateSettings,
    showNotification,
    isLoginModalOpen,
    openLoginModal: () => setIsLoginModalOpen(true),
    closeLoginModal: () => setIsLoginModalOpen(false)
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
        {notification && (
          <Toast 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
        )}
        
        {user?.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <CustomerApp />
        )}

        <LoginModal />
      </div>
    </AppContext.Provider>
  );
};

// --- Login Modal ---

const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal, login } = useAppContext();
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [email, setEmail] = useState('rahul@example.com');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmail(role === 'admin' ? 'admin@shop.com' : 'rahul@example.com');
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email, role);
      setIsLoading(false);
    }, 800);
  };

  return (
    <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal} title="Login Required">
      <div className="text-center mb-6">
        <div className="bg-coral-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-coral-600">
          <Store className="w-6 h-6" />
        </div>
        <p className="text-slate-500 dark:text-slate-400">Log in to access your account or manage the store.</p>
      </div>

      <div className="flex mb-6 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
        <button 
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'customer' ? 'bg-white shadow-sm text-coral-600 dark:bg-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
          onClick={() => setRole('customer')}
        >
          Customer
        </button>
        <button 
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'admin' ? 'bg-white shadow-sm text-coral-600 dark:bg-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
          onClick={() => setRole('admin')}
        >
          Store Owner
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Email Address" 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <Input 
          label="Password" 
          type="password" 
          defaultValue="password"
          helperText="Any password works for demo" 
        />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Login as {role === 'admin' ? 'Owner' : 'Customer'}
        </Button>
      </form>
    </Modal>
  );
};

// --- Admin Panel ---

const AdminDashboard = () => {
  const { logout, theme, toggleTheme } = useAppContext();
  const [view, setView] = useState<'dashboard' | 'products' | 'orders' | 'settings'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ id, icon: Icon, label }: { id: typeof view, icon: any, label: string }) => (
    <button
      onClick={() => { setView(id); setIsMobileMenuOpen(false); }}
      className={`flex items-center w-full px-4 py-3 mb-1 rounded-lg transition-colors ${
        view === id 
          ? 'bg-coral-50 text-coral-600 dark:bg-coral-900/30 dark:text-coral-300 font-medium border-l-4 border-coral-500' 
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-l-4 border-transparent'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-200 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-lg`}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
          <h2 className="text-xl font-bold flex items-center text-coral-500">
            <Store className="w-6 h-6 mr-2" />
            Admin Panel
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-8">Jabalpur Generic Meds</p>
        </div>
        <nav className="p-4 space-y-1">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="products" icon={Package} label="Products" />
          <NavItem id="orders" icon={ShoppingBag} label="Orders" />
          <NavItem id="settings" icon={Settings} label="Settings" />
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <Button variant="ghost" onClick={logout} className="w-full justify-start text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden mr-4 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold capitalize text-slate-800 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
              {view}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center text-white font-bold shadow-sm">
                D
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 hidden sm:block">Dad (Owner)</span>
            </div>
          </div>
        </header>

        <div className="p-6 pb-20 max-w-7xl mx-auto">
          {view === 'dashboard' && <AdminStats />}
          {view === 'products' && <ProductManager />}
          {view === 'orders' && <OrderManager />}
          {view === 'settings' && <SettingsManager />}
        </div>
      </main>
    </div>
  );
};

const AdminStats = () => {
  const { orders, products } = useAppContext();
  
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter(p => p.stock < 50).length;

  const chartData = [
    { name: 'Mon', sales: 400 },
    { name: 'Tue', sales: 300 },
    { name: 'Wed', sales: 600 },
    { name: 'Thu', sales: 800 },
    { name: 'Fri', sales: 500 },
    { name: 'Sat', sales: 900 },
    { name: 'Sun', sales: 700 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Sales</p>
              <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">₹{totalSales.toLocaleString()}</h3>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-xl text-green-600 dark:text-green-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
          </div>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Orders</p>
              <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{orders.length}</h3>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl text-blue-600 dark:text-blue-400">
              <Package className="w-8 h-8" />
            </div>
          </div>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Low Stock Items</p>
              <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{lowStock}</h3>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl text-red-600 dark:text-red-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 h-80 shadow-md">
        <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-white">Weekly Sales Performance</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
            <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} prefix="₹" />
            <RechartsTooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              cursor={{fill: 'rgba(0,0,0,0.05)'}}
            />
            <Bar dataKey="sales" fill="#FF6B5B" radius={[4, 4, 0, 0]} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

const ProductManager = () => {
  const { products, addProduct, updateProduct, deleteProduct, showNotification } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredProducts = products.filter(p => 
    p.name_en.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.generic_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const initialFormState: Product = {
    id: '',
    name_en: '', name_hi: '', generic_name: '', category: CATEGORIES[0],
    price: 0, mrp: 0, stock: 0, type: 'OTC', expiry: '', batch_number: '',
    manufacturer: '', description_en: '', description_hi: '',
    image: '', rating: 0, reviews: 0
  };

  const [formData, setFormData] = useState<Product>(initialFormState);

  // Discount calculation helper
  const calculateDiscount = (price: number, mrp: number) => {
    if (mrp > price && mrp > 0) {
      return Math.round(((mrp - price) / mrp) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount(formData.price, formData.mrp);

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData(p);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({ ...initialFormState, id: Date.now().toString() });
    setIsModalOpen(true);
  };

  const validateForm = () => {
    if (!formData.name_en || formData.price <= 0 || formData.stock < 0) {
      showNotification("Please fix validation errors", 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    if (editingProduct) {
      updateProduct(formData);
    } else {
      addProduct(formData);
    }
    setIsModalOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB
        showNotification("Image too large. Auto-compressing...", 'error');
      }
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          <Input 
            placeholder="Search products..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-5 h-5 mr-2" /> Add Product
        </Button>
      </div>

      <Card className="overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price / MRP</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {product.name_en}
                    <div className="text-xs text-slate-500 dark:text-slate-400">{product.generic_name}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{product.category}</td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">₹{product.price}</span>
                        {product.mrp > product.price && (
                           <div className="text-xs">
                              <span className="text-slate-400 line-through mr-1">₹{product.mrp}</span>
                              <span className="text-green-600 dark:text-green-400 font-bold">
                                {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                              </span>
                           </div>
                        )}
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock < 50 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => setDeleteConfirm(product.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProduct ? "Edit Product" : "Add New Product"}
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Save Product</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input 
            label="Product Name (English)" 
            value={formData.name_en} 
            onChange={e => setFormData({...formData, name_en: e.target.value})}
            error={!formData.name_en ? "Name is required" : undefined}
          />
          <Input 
            label="Product Name (Hindi)" 
            value={formData.name_hi} 
            onChange={e => setFormData({...formData, name_hi: e.target.value})}
          />
          
          {/* Price Calculation Section */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600">
             <h4 className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Pricing & Discount</h4>
             <div className="grid grid-cols-2 gap-4 mb-2">
                <Input 
                  label="Selling Price (₹)" 
                  type="number" 
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                  error={formData.price <= 0 ? "Must be > 0" : undefined}
                />
                <Input 
                  label="MRP (Original Price) (₹)" 
                  type="number" 
                  value={formData.mrp} 
                  onChange={e => setFormData({...formData, mrp: parseFloat(e.target.value)})}
                  helperText={formData.mrp > 0 ? "Displayed as crossed out" : "Optional"}
                />
             </div>
             {discount > 0 && (
                <div className="text-center p-2 bg-green-100 dark:bg-green-900/30 rounded text-green-700 dark:text-green-300 font-bold text-sm">
                   Calculated Discount: {discount}% OFF
                </div>
             )}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Input 
               label="Stock Quantity" 
               type="number" 
               value={formData.stock} 
               onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
               error={formData.stock < 0 ? "Cannot be negative" : undefined}
             />
             <Select 
               label="Category" 
               value={formData.category} 
               onChange={e => setFormData({...formData, category: e.target.value})}
               options={CATEGORIES.map(c => ({ label: c, value: c }))}
             />
          </div>

          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <input type="file" onChange={handleImageUpload} className="hidden" id="img-upload" accept="image/*" />
            <label htmlFor="img-upload" className="cursor-pointer flex flex-col items-center">
              <Package className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-coral-500 font-medium hover:underline">Click to upload image</span>
            </label>
            {formData.image && <p className="text-xs mt-2 text-green-600 flex items-center justify-center"><Check className="w-3 h-3 mr-1" /> Image selected</p>}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Deletion"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { if(deleteConfirm) deleteProduct(deleteConfirm); setDeleteConfirm(null); }}>Delete Permanently</Button>
          </div>
        }
      >
        <p className="text-slate-600 dark:text-slate-300">Are you sure you want to delete this product? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

const OrderManager = () => {
  const { orders, updateOrderStatus } = useAppContext();

  return (
    <Card className="overflow-hidden border border-slate-200 dark:border-slate-700">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-medium text-slate-600 dark:text-slate-300">#{order.id.slice(0, 8)}</td>
                <td className="px-6 py-4 text-slate-800 dark:text-slate-200">
                  <div className="font-medium">{order.address.street}</div>
                  <div className="text-xs text-slate-500">{order.address.zip}</div>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{order.items.length} items</td>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">₹{order.total}</td>
                <td className="px-6 py-4">
                  <Badge variant={order.status === 'Delivered' ? 'success' : order.status === 'Pending' ? 'warning' : 'info'}>
                    {order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                    options={[
                      {value: 'Pending', label: 'Pending'},
                      {value: 'Processing', label: 'Processing'},
                      {value: 'Shipped', label: 'Shipped'},
                      {value: 'Delivered', label: 'Delivered'},
                    ]}
                    className="w-32 text-sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const SettingsManager = () => {
  const { settings, updateSettings } = useAppContext();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');

  useEffect(() => {
    // Auto-save logic with debounce
    if (JSON.stringify(localSettings) !== JSON.stringify(settings)) {
      setSaveStatus('saving');
      const timer = setTimeout(() => {
        updateSettings(localSettings);
        setSaveStatus('saved');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [localSettings, settings, updateSettings]);

  const handleChange = (field: keyof ShopSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Store Settings</h2>
        <div className="flex items-center text-sm font-medium">
          {saveStatus === 'saving' && <span className="text-yellow-600 dark:text-yellow-400 flex items-center"><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Saving...</span>}
          {saveStatus === 'saved' && <span className="text-green-600 dark:text-green-400 flex items-center"><Check className="w-4 h-4 mr-1" /> Saved</span>}
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 pb-2">General Info</h3>
        <Input label="Store Name" value={localSettings.name} onChange={e => handleChange('name', e.target.value)} />
        <Input label="Owner Name" value={localSettings.owner} onChange={e => handleChange('owner', e.target.value)} />
        <Textarea label="Address" value={localSettings.address} onChange={e => handleChange('address', e.target.value)} />
        <Input label="Phone" value={localSettings.phone} onChange={e => handleChange('phone', e.target.value)} />
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 pb-2">Delivery & Loyalty</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Delivery Radius (km)" type="number" 
            value={localSettings.deliveryRadiusKm} onChange={e => handleChange('deliveryRadiusKm', Number(e.target.value))} 
          />
          <Input 
            label="Delivery Charge (₹)" type="number" 
            value={localSettings.deliveryCharge} onChange={e => handleChange('deliveryCharge', Number(e.target.value))} 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Min Order for Free Delivery" type="number" 
            value={localSettings.minFreeDelivery} onChange={e => handleChange('minFreeDelivery', Number(e.target.value))} 
          />
          <Input 
            label="Loyalty Point Value (₹)" type="number" step="0.01" 
            value={localSettings.pointValue} onChange={e => handleChange('pointValue', Number(e.target.value))} 
            helperText="1 Point = ? Rupees"
          />
        </div>
      </Card>
    </div>
  );
};

// --- Customer App ---

const CustomerApp = () => {
  const { logout, cart, language, setLanguage, user, openLoginModal } = useAppContext();
  const [view, setView] = useState<'home' | 'products' | 'cart' | 'profile'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleProfileClick = () => {
    if (!user) {
      openLoginModal();
    } else {
      setView('profile');
    }
  };

  const MobileNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-around p-3 z-50 shadow-lg">
      <button onClick={() => setView('home')} className={`flex flex-col items-center text-xs ${view === 'home' ? 'text-coral-500 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
        <Store className="w-6 h-6 mb-1" /> {TRANSLATIONS[language].home}
      </button>
      <button onClick={() => setView('products')} className={`flex flex-col items-center text-xs ${view === 'products' ? 'text-coral-500 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
        <Search className="w-6 h-6 mb-1" /> {TRANSLATIONS[language].products}
      </button>
      <button onClick={() => setView('cart')} className={`flex flex-col items-center text-xs relative ${view === 'cart' ? 'text-coral-500 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
        <ShoppingCart className="w-6 h-6 mb-1" /> {TRANSLATIONS[language].orders}
        {cart.length > 0 && <span className="absolute top-0 right-4 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] animate-bounce">{cart.length}</span>}
      </button>
      <button onClick={handleProfileClick} className={`flex flex-col items-center text-xs ${view === 'profile' ? 'text-coral-500 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
        {user ? <UserIcon className="w-6 h-6 mb-1" /> : <LogIn className="w-6 h-6 mb-1" />} 
        {user ? TRANSLATIONS[language].myAccount : TRANSLATIONS[language].login}
      </button>
    </div>
  );

  return (
    <div className="pb-20 md:pb-0 min-h-screen flex flex-col">
      <header className="bg-coral-500 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('home')}>
             <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-all">
                <Store className="w-6 h-6" />
             </div>
             <div>
                <h1 className="text-xl font-bold leading-tight">Generic Meds</h1>
                <p className="text-[10px] opacity-90 uppercase tracking-widest font-medium">Jabalpur</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="text-sm font-bold bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition-all border border-white/10"
            >
              {language === 'en' ? 'हिन्दी' : 'English'}
            </button>
            <div className="hidden md:flex items-center gap-6 ml-4">
              <button onClick={() => setView('home')} className={`hover:text-coral-100 font-medium transition-colors ${view === 'home' ? 'text-white border-b-2 border-white' : 'text-white/80'}`}>Home</button>
              <button onClick={() => setView('products')} className={`hover:text-coral-100 font-medium transition-colors ${view === 'products' ? 'text-white border-b-2 border-white' : 'text-white/80'}`}>Products</button>
              <button onClick={() => setView('cart')} className="relative hover:text-coral-100 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && <span className="absolute -top-1 -right-2 w-5 h-5 bg-white text-coral-600 rounded-full text-xs flex items-center justify-center font-bold shadow-sm">{cart.length}</span>}
              </button>
              <button onClick={handleProfileClick} className="hover:text-coral-100 flex items-center gap-1 font-medium bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all">
                {user ? <><UserIcon className="w-4 h-4" /> Account</> : <><LogIn className="w-4 h-4" /> Login</>}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto p-4 w-full">
        {view === 'home' && <CustomerHome onCategoryClick={(c) => { setSelectedCategory(c); setView('products'); }} />}
        {view === 'products' && <CustomerProducts category={selectedCategory} setCategory={setSelectedCategory} />}
        {view === 'cart' && <CustomerCart />}
        {view === 'profile' && <CustomerProfile />}
      </main>

      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
};

const CustomerHome = ({ onCategoryClick }: { onCategoryClick: (c: string) => void }) => {
  const { products, language, addToCart } = useAppContext();
  
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-400 rounded-3xl p-8 text-white text-center shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8 blur-xl"></div>
        <h2 className="text-3xl font-extrabold mb-3 relative z-10 drop-shadow-sm">{language === 'en' ? 'Quality Meds, Lowest Prices' : 'गुणवत्तापूर्ण दवाएं, सबसे कम दाम'}</h2>
        <p className="opacity-95 mb-6 text-lg relative z-10 font-medium">{language === 'en' ? 'Free delivery on orders over ₹500' : '₹500 से ऊपर के ऑर्डर पर मुफ्त डिलीवरी'}</p>
        <button onClick={() => onCategoryClick(CATEGORIES[0])} className="bg-white text-teal-600 px-6 py-2.5 rounded-full font-bold hover:bg-teal-50 hover:scale-105 transition-all shadow-md">
          {language === 'en' ? 'Shop Now' : 'अभी खरीदें'}
        </button>
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
             <Package className="w-5 h-5 mr-2 text-coral-500" /> Categories
           </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.slice(0, 8).map(cat => (
            <button 
              key={cat}
              onClick={() => onCategoryClick(cat)}
              className="group bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:border-coral-200 dark:hover:border-coral-500/30 transition-all text-center"
            >
              <div className="w-12 h-12 bg-coral-50 dark:bg-coral-900/20 rounded-full flex items-center justify-center mx-auto mb-3 text-coral-500 group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm group-hover:text-coral-500 transition-colors">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
             <TrendingUp className="w-5 h-5 mr-2 text-coral-500" /> Featured Products
           </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featuredProducts.map(p => {
             const discount = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
             return (
              <div key={p.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-3 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group">
                {discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md z-10 animate-pulse">
                    {discount}% {TRANSLATIONS[language].discount}
                  </div>
                )}
                <div className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-xl mb-3 overflow-hidden relative">
                  <img src={p.image} alt={p.name_en} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 truncate text-sm">{language === 'en' ? p.name_en : p.name_hi || p.name_en}</h4>
                <div className="mt-auto pt-3">
                  <div className="flex items-baseline gap-2 mb-2">
                     <span className="font-bold text-lg text-slate-900 dark:text-white">₹{p.price}</span>
                     {discount > 0 && <span className="text-xs text-slate-400 line-through">₹{p.mrp}</span>}
                  </div>
                  <button 
                    onClick={() => addToCart(p)}
                    className="w-full bg-slate-900 dark:bg-slate-700 text-white p-2 rounded-lg text-xs font-bold hover:bg-coral-500 dark:hover:bg-coral-500 transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3 mr-1" /> {TRANSLATIONS[language].addToCart}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CustomerProducts = ({ category, setCategory }: { category: string | null, setCategory: (c: string | null) => void }) => {
  const { products, addToCart, language } = useAppContext();
  const [search, setSearch] = useState('');

  const filtered = products.filter(p => 
    (category ? p.category === category : true) &&
    (p.name_en.toLowerCase().includes(search.toLowerCase()) || 
     p.name_hi?.includes(search))
  );

  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm z-30 py-3 -mx-4 px-4 border-b border-transparent space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          <Input 
            placeholder={TRANSLATIONS[language].search} 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="shadow-sm pl-10 bg-white dark:bg-slate-800"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button 
            onClick={() => setCategory(null)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === null 
                ? 'bg-coral-500 text-white' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat 
                  ? 'bg-coral-500 text-white' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(p => {
           const discount = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
           return (
            <Card key={p.id} className="flex p-4 gap-4 hover:shadow-md transition-shadow dark:border-slate-700">
              <div className="relative w-24 h-24 flex-shrink-0">
                <img src={p.image} className="w-full h-full object-cover rounded-lg bg-slate-100 dark:bg-slate-700" />
                {discount > 0 && (
                  <div className="absolute -top-2 -left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                    -{discount}%
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white leading-tight mb-1">{language === 'en' ? p.name_en : p.name_hi || p.name_en}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{p.generic_name}</p>
                  <Badge variant={p.type === 'Prescription' ? 'warning' : 'success'}>{p.type}</Badge>
                </div>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                     <div className="text-lg font-bold text-slate-900 dark:text-white">₹{p.price}</div>
                     {discount > 0 && <div className="text-xs text-slate-400 line-through">₹{p.mrp}</div>}
                  </div>
                  <Button size="sm" onClick={() => addToCart(p)} disabled={p.stock === 0} className={p.stock === 0 ? 'opacity-50' : 'bg-coral-500 hover:bg-coral-600'}>
                    {p.stock === 0 ? TRANSLATIONS[language].outOfStock : <Plus className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const CustomerCart = () => {
  const { cart, removeFromCart, updateCartQuantity, user, settings, placeOrder, openLoginModal } = useAppContext();
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [address, setAddress] = useState(user?.addresses.find(a => a.isDefault) || user?.addresses[0] || { street: '', zip: '' });
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = pointsToRedeem * settings.pointValue;
  const delivery = subtotal >= settings.minFreeDelivery ? 0 : settings.deliveryCharge;
  const total = Math.max(0, subtotal + delivery - discount);

  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="text-center py-20 opacity-50">
        <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-slate-400" />
        <p className="text-slate-500 dark:text-slate-400">Your cart is empty</p>
      </div>
    );
  }

  const handleCheckout = () => {
    if (step === 'cart') setStep('checkout');
    else {
      // Final Order
      placeOrder({
        id: Date.now().toString(),
        userId: user ? user.id : 'guest',
        items: cart,
        total,
        discount,
        pointsRedeemed: pointsToRedeem,
        status: 'Pending',
        date: new Date().toISOString(),
        address: { ...address, id: 'temp', city: 'Jabalpur', state: 'MP', isDefault: false }
      });
      setStep('cart');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
        <span className={step === 'cart' ? 'text-coral-500 font-bold' : ''}>Cart</span>
        <span>/</span>
        <span className={step === 'checkout' ? 'text-coral-500 font-bold' : ''}>Checkout</span>
      </div>

      {step === 'cart' ? (
        <div className="space-y-4">
          {cart.map(item => (
            <Card key={item.id} className="p-4 flex items-center gap-4 dark:border-slate-700">
              <img src={item.image} className="w-16 h-16 rounded object-cover bg-slate-100 dark:bg-slate-700" />
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 dark:text-white">{item.name_en}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold">-</button>
                <span className="w-4 text-center text-slate-800 dark:text-white font-medium">{item.quantity}</span>
                <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold">+</button>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"><Trash2 className="w-5 h-5" /></button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 space-y-4 border-l-4 border-l-coral-500">
          <h3 className="font-bold border-b dark:border-slate-700 pb-2 text-slate-800 dark:text-white">Delivery Details {user ? '' : '(Guest)'}</h3>
          <Input label="Street Address" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
          <Input label="Pincode (Jabalpur)" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} />
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded text-sm text-yellow-700 dark:text-yellow-400 flex items-start border border-yellow-100 dark:border-yellow-900/30">
             <MapPin className="w-4 h-4 mr-2 mt-0.5" /> 
             We verify address is within 30km radius of Wright Town.
          </div>
        </Card>
      )}

      <Card className="p-6 space-y-3 shadow-lg border-none bg-white dark:bg-slate-800">
        <div className="flex justify-between text-slate-600 dark:text-slate-300">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-300">
          <span>Delivery</span>
          <span>{delivery === 0 ? <span className="text-green-600 font-bold">Free</span> : `₹${delivery}`}</span>
        </div>
        
        {user && user.points > 0 && (
          <div className="py-3 border-y border-dashed border-slate-200 dark:border-slate-700 my-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-coral-600 font-bold flex items-center"><Star className="w-3 h-3 mr-1 fill-current" /> Use Loyalty Points ({user.points})</span>
              <input 
                type="range" min="0" max={Math.min(user.points, subtotal / settings.pointValue)} 
                value={pointsToRedeem}
                onChange={(e) => setPointsToRedeem(parseInt(e.target.value))}
                className="accent-coral-500 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            {pointsToRedeem > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400 text-sm font-medium">
                <span>Discount ({pointsToRedeem} pts)</span>
                <span>-₹{discount.toFixed(0)}</span>
              </div>
            )}
          </div>
        )}

        {!user && step === 'cart' && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm mb-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-100 dark:border-blue-900/30" onClick={openLoginModal}>
            <span className="font-bold">✨ Tip:</span> Log in to earn loyalty points on this order!
          </div>
        )}

        <div className="flex justify-between text-2xl font-bold pt-4 border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
          <span>Total</span>
          <span>₹{total.toFixed(0)}</span>
        </div>

        <div className="flex gap-3 pt-2">
          {step === 'checkout' && (
             <Button variant="outline" className="flex-1" onClick={() => setStep('cart')}>Back</Button>
          )}
          <Button className="flex-[2] py-3 text-lg shadow-lg shadow-coral-500/20" onClick={handleCheckout}>
            {step === 'cart' ? 'Proceed to Checkout' : 'Confirm Order'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

const CustomerProfile = () => {
  const { user, orders, logout } = useAppContext();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-coral-500 to-coral-600 text-white shadow-lg border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl font-bold shadow-inner">
            {user.name[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="opacity-90 font-medium">{user.email}</p>
            <Badge variant="info" className="mt-2 bg-white/20 text-white border-none backdrop-blur-sm">Gold Member</Badge>
          </div>
        </div>
        <div className="mt-8 flex gap-4 relative z-10">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl flex-1 border border-white/10">
            <p className="text-xs opacity-80 uppercase tracking-wider font-semibold">Loyalty Points</p>
            <p className="text-3xl font-bold mt-1">{user.points}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl flex-1 border border-white/10">
            <p className="text-xs opacity-80 uppercase tracking-wider font-semibold">Wallet Value</p>
            <p className="text-3xl font-bold mt-1">₹{(user.points * 0.1).toFixed(0)}</p>
          </div>
        </div>
      </Card>

      <h3 className="font-bold text-lg text-slate-800 dark:text-white mt-8">Order History</h3>
      <div className="space-y-4">
        {orders.filter(o => o.userId === user.id).map(order => (
          <Card key={order.id} className="p-5 hover:shadow-md transition-shadow dark:border-slate-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">#{order.id.slice(0, 8)}</span>
                <p className="font-bold text-slate-800 dark:text-white mt-2">{order.items.length} Items</p>
              </div>
              <Badge variant={order.status === 'Delivered' ? 'success' : 'warning'}>{order.status}</Badge>
            </div>
            <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-100 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">{new Date(order.date).toLocaleDateString()}</span>
              <span className="font-bold text-lg text-slate-900 dark:text-white">₹{order.total}</span>
            </div>
          </Card>
        ))}
        {orders.filter(o => o.userId === user.id).length === 0 && (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-slate-400">No orders yet</p>
          </div>
        )}
      </div>

      <Button variant="outline" className="w-full text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-red-900/50" onClick={logout}>
        <LogOut className="w-4 h-4 mr-2" /> Log Out
      </Button>
    </div>
  );
};

export default App;