import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Package, Users, LogOut, Check, ArrowRight, Plus, 
  Trash2, Edit, X, Upload, IndianRupee, Eye, Star, Info, ListFilter 
} from 'lucide-react';
import { Product, Order } from '../types';
import { products as fallbackProducts } from '../data';
import { supabase, normalizeSupabaseOrder, normalizeSupabaseProduct } from '../supabase';
interface OwnerDashboardProps {
  onLogout: () => void;
  token: string;
  onBackToStore?: () => void;
}

export default function OwnerDashboard({ onLogout, token, onBackToStore }: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'customers'>('orders');
  
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  
  // Loaders / Errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Modals / Forms
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Product Form State
  const [pName, setPName] = useState('');
  const [pBrand, setPBrand] = useState('');
  const [pCategory, setPCategory] = useState('essential-grains');
  const [pPrice, setPPrice] = useState('');
  const [pMrp, setPMrp] = useState('');
  const [pUnit, setPUnit] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pIsVeg, setPIsVeg] = useState(true);
  const [pSpecialOffer, setPSpecialOffer] = useState('');
  const [pColorTheme, setPColorTheme] = useState('emerald');
  const [pImageFile, setPImageFile] = useState<File | null>(null);
  const [pImageUrl, setPImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchDashboardData();

    // Setup periodic silent polling to fetch fresh orders instantly (every 3 seconds)
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 3000);

    // Cross-tab storage listener to sync immediately when an order is placed locally
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'grocery_orders' || e.key === 'annapurna_local_products') {
        fetchDashboardData(true);
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const fetchDashboardData = async (isBackground = false) => {
    if (!isBackground) {
      setLoading(true);
    }
    setError(null);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      let ordData: Order[] = [];
      try {
        const { data, error } = await supabase.from('orders').select('*');
        if (error) throw error;
        ordData = (data || []).map(normalizeSupabaseOrder);
      } catch (ordErr) {
        console.warn('Failed to load orders from Supabase:', ordErr);
      }
      
      // Merge with localStorage orders
      const savedOrdersStr = localStorage.getItem('grocery_orders');
      if (savedOrdersStr) {
        try {
          const savedOrders = JSON.parse(savedOrdersStr) as Order[];
          const normalizedLocalOrders = (savedOrders || []).map(normalizeSupabaseOrder);
          if (ordData.length === 0) {
            ordData = normalizedLocalOrders;
          } else {
            const existingIds = new Set(ordData.map(o => o.id));
            normalizedLocalOrders.forEach(o => {
              if (o && o.id && !existingIds.has(o.id)) {
                ordData.push(o);
              }
            });
          }
        } catch (jsonErr) {
          console.warn('Failed to parse or normalize grocery_orders from localStorage:', jsonErr);
        }
      }
      setOrders(ordData);

      let prodData: Product[] = [];
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        prodData = (data || []).map(normalizeSupabaseProduct);
      } catch (prodErr) {
        console.warn('Failed to load products from Supabase:', prodErr);
      }

      // Merge / Fallback with local products
      const localProductsStr = localStorage.getItem('annapurna_local_products');
      if (localProductsStr) {
        try {
          const parsed = JSON.parse(localProductsStr) as Product[];
          prodData = (parsed || []).map(normalizeSupabaseProduct);
        } catch (e) {
          console.warn('Failed to parse local products from localStorage:', e);
        }
      } else if (prodData.length === 0) {
        prodData = fallbackProducts.map(normalizeSupabaseProduct);
        localStorage.setItem('annapurna_local_products', JSON.stringify(fallbackProducts));
      } else {
        localStorage.setItem('annapurna_local_products', JSON.stringify(prodData));
      }
      setProducts(prodData);

      // Extract customers list from orders dynamically
      const customerMap = new Map();
      ordData.forEach((o: any) => {
        const addr = o.deliveryAddress;
        if (addr && addr.email) {
          customerMap.set(addr.email, {
            name: addr.name,
            email: addr.email,
            phone: addr.phone,
            address: addr.address || `${addr.flat || ''}, ${addr.area || ''}, ${addr.city || ''}`,
            latitude: addr.latitude || '',
            longitude: addr.longitude || '',
            orderCount: (customerMap.get(addr.email)?.orderCount || 0) + 1,
            totalSpent: (customerMap.get(addr.email)?.totalSpent || 0) + o.totalAmount,
          });
        }
      });
      setCustomers(Array.from(customerMap.values()));

    } catch (err: any) {
      console.warn('Dashboard Load Warning:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        });
        
        if (!response.ok) {
          const d = await response.json();
          throw new Error(d.error || 'Failed to update order');
        }
      } catch (backendErr) {
        console.warn('[Backend Offline] Updating order status locally:', backendErr);
      }

      // Seamless local update fallback
      const savedOrdersStr = localStorage.getItem('grocery_orders');
      if (savedOrdersStr) {
        const savedOrders = JSON.parse(savedOrdersStr) as Order[];
        const idx = savedOrders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
          savedOrders[idx].status = status;
          if (status === 'preparing') savedOrders[idx].eta = 8;
          else if (status === 'dispatched') savedOrders[idx].eta = 4;
          else if (status === 'delivered') savedOrders[idx].eta = 0;
          localStorage.setItem('grocery_orders', JSON.stringify(savedOrders));
        }
      }
      
      showSuccess(`Order ${orderId} is now ${status}`);
      fetchDashboardData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleToggleStock = async (product: Product) => {
    try {
      try {
        const response = await fetch(`/api/products/${product.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ inStock: !product.inStock }),
        });

        if (!response.ok) throw new Error('Failed to update product stock');
      } catch (backendErr) {
        console.warn('[Backend Offline] Toggling product stock locally:', backendErr);
      }

      // Seamless local product update fallback
      const localProductsStr = localStorage.getItem('annapurna_local_products');
      if (localProductsStr) {
        const localProducts = JSON.parse(localProductsStr) as Product[];
        const idx = localProducts.findIndex(p => p.id === product.id);
        if (idx !== -1) {
          localProducts[idx].inStock = !product.inStock;
          localStorage.setItem('annapurna_local_products', JSON.stringify(localProducts));
        }
      }
      
      showSuccess(`${product.name} is now ${!product.inStock ? 'In Stock' : 'Out of Stock'}`);
      fetchDashboardData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = (productId: string, name: string) => {
    setProductToDelete({ id: productId, name });
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    const { id, name } = productToDelete;

    try {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to delete product');
      } catch (backendErr) {
        console.warn('[Backend Offline] Deleting product locally:', backendErr);
      }

      // Seamless local product delete fallback
      const localProductsStr = localStorage.getItem('annapurna_local_products');
      if (localProductsStr) {
        const localProducts = JSON.parse(localProductsStr) as Product[];
        const updated = localProducts.filter(p => p.id !== id);
        localStorage.setItem('annapurna_local_products', JSON.stringify(updated));
      }
      
      showSuccess(`"${name}" deleted from store`);
      setProductToDelete(null);
      fetchDashboardData();
    } catch (err: any) {
      setError(err.message);
      setProductToDelete(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPImageFile(file);
    setUploadingImage(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to upload image');

      setPImageUrl(data.imageUrl);
      showSuccess('Product image uploaded successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setPName('');
    setPBrand('');
    setPCategory('essential-grains');
    setPPrice('');
    setPMrp('');
    setPUnit('');
    setPDescription('');
    setPIsVeg(true);
    setPSpecialOffer('');
    setPColorTheme('emerald');
    setPImageUrl('');
    setPImageFile(null);
    setIsProductModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setPName(p.name);
    setPBrand(p.brand);
    setPCategory(p.category);
    setPPrice(String(p.price));
    setPMrp(String(p.mrp));
    setPUnit(p.unit);
    setPDescription(p.description || '');
    setPIsVeg(p.isVeg ?? true);
    setPSpecialOffer(p.specialOffer || '');
    setPColorTheme(p.colorTheme || 'emerald');
    setPImageUrl(p.image || '');
    setPImageFile(null);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pBrand || !pPrice || !pMrp || !pUnit) {
      setError('Please fill in all mandatory fields');
      return;
    }

    const payload: any = {
      name: pName,
      brand: pBrand,
      category: pCategory,
      price: Number(pPrice),
      mrp: Number(pMrp),
      unit: pUnit,
      description: pDescription,
      isVeg: pIsVeg,
      specialOffer: pSpecialOffer,
      colorTheme: pColorTheme,
    };

    if (pImageUrl) {
      payload.image = pImageUrl;
    }

    try {
      try {
        const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
        const method = editingProduct ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const contentType = response.headers.get('content-type');
        if (response.ok && contentType && contentType.includes('application/json')) {
          await response.json();
        } else {
          throw new Error('Non-JSON response from save product');
        }
      } catch (backendErr) {
        console.warn('[Backend Offline] Saving product locally:', backendErr);
      }

      // Seamless local product save/create fallback
      const localProductsStr = localStorage.getItem('annapurna_local_products');
      let localProducts = localProductsStr ? (JSON.parse(localProductsStr) as Product[]) : [...fallbackProducts];
      
      if (editingProduct) {
        const idx = localProducts.findIndex(p => p.id === editingProduct.id);
        if (idx !== -1) {
          localProducts[idx] = {
            ...localProducts[idx],
            ...payload,
            id: editingProduct.id,
            image: pImageUrl || localProducts[idx].image
          };
        }
      } else {
        const newProd: Product = {
          id: 'prod-' + Math.floor(Math.random() * 100000),
          inStock: true,
          image: pImageUrl || 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/zhakaas.jpeg',
          ...payload,
        };
        localProducts.unshift(newProd);
      }
      
      localStorage.setItem('annapurna_local_products', JSON.stringify(localProducts));

      showSuccess(editingProduct ? 'Product edited successfully!' : 'Product added successfully!');
      setIsProductModalOpen(false);
      fetchDashboardData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Analytics Helpers
  const totalRevenue = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;
  const dispatchedCount = orders.filter((o) => o.status === 'dispatched').length;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      {/* Header Banner */}
      <header className="bg-neutral-900 text-white shadow-md px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center text-xl shadow-lg border border-emerald-600">
            🪔
          </div>
          <div>
            <h1 className="text-md font-black uppercase tracking-tight text-yellow-400">Annapurna Store</h1>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Owner Control Center</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {onBackToStore && (
            <button
              onClick={onBackToStore}
              className="flex items-center space-x-1 bg-emerald-800 text-emerald-100 hover:bg-emerald-700 hover:text-white text-xs font-black px-3 py-1.5 rounded-xl transition-all border border-emerald-700"
            >
              <span>← GO TO SHOP</span>
            </button>
          )}
          <span className="bg-neutral-800 text-neutral-300 text-xs font-bold px-3 py-1.5 rounded-full border border-neutral-700 hidden sm:inline">
            👑 Administrator
          </span>
          <button
            onClick={onLogout}
            className="flex items-center space-x-1 bg-red-950 text-red-200 border border-red-900 hover:bg-red-900 hover:text-white text-xs font-black px-3 py-1.5 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>EXIT PANEL</span>
          </button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Analytics Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-3xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Delivered Revenue</span>
            <div className="flex items-baseline mt-2">
              <span className="text-2xl font-black text-neutral-900 tracking-tight">₹{totalRevenue.toLocaleString('en-IN')}</span>
            </div>
            <span className="text-[9px] text-emerald-600 font-bold mt-1">✓ Complete Orders</span>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Pending Bookings</span>
            <div className="flex items-baseline mt-2">
              <span className="text-2xl font-black text-amber-600 tracking-tight">{pendingCount}</span>
              <span className="text-xs font-bold text-neutral-400 ml-1">orders</span>
            </div>
            <span className="text-[9px] text-amber-500 font-bold mt-1">⌛ Needs Dispatch</span>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Transit Pipeline</span>
            <div className="flex items-baseline mt-2">
              <span className="text-2xl font-black text-blue-600 tracking-tight">{preparingCount + dispatchedCount}</span>
              <span className="text-xs font-bold text-neutral-400 ml-1">orders</span>
            </div>
            <span className="text-[9px] text-blue-500 font-bold mt-1">🚚 In Kitchen / Route</span>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Total Products</span>
            <div className="flex items-baseline mt-2">
              <span className="text-2xl font-black text-emerald-800 tracking-tight">{products.length}</span>
              <span className="text-xs font-bold text-neutral-400 ml-1">items</span>
            </div>
            <span className="text-[9px] text-emerald-700 font-bold mt-1">📦 Active Catalog</span>
          </div>
        </div>

        {/* Global Notifications */}
        {error && (
          <div className="bg-rose-50 text-rose-600 text-xs font-bold p-4 rounded-2xl border border-rose-100 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-800 font-black">Dismiss</button>
          </div>
        )}

        {actionSuccess && (
          <div className="bg-emerald-50 text-emerald-700 text-xs font-bold p-4 rounded-2xl border border-emerald-100 flex justify-between items-center">
            <span>{actionSuccess}</span>
            <button onClick={() => setActionSuccess(null)} className="text-emerald-500 hover:text-emerald-800 font-black">Dismiss</button>
          </div>
        )}

        {/* Workspace Section Container */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm overflow-hidden flex flex-col">
          {/* Tabs Nav */}
          <div className="flex justify-between items-center bg-neutral-50 px-4 sm:px-6 py-3 border-b border-neutral-200/80">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'orders' 
                    ? 'bg-neutral-900 text-white shadow-sm' 
                    : 'text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Orders Pipeline ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'products' 
                    ? 'bg-neutral-900 text-white shadow-sm' 
                    : 'text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Products Catalog ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'customers' 
                    ? 'bg-neutral-900 text-white shadow-sm' 
                    : 'text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Customer Base ({customers.length})</span>
              </button>
            </div>

            {activeTab === 'products' && (
              <button
                onClick={openAddModal}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold px-4 py-2 rounded-2xl flex items-center space-x-1 shadow-sm transition-all uppercase tracking-wide"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            )}
          </div>

          {/* Tab Contents */}
          <div className="p-4 sm:p-6 flex-1 min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin text-3xl mb-3">🪔</div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Loading Records...</span>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {/* 1. ORDERS TAB */}
                {activeTab === 'orders' && (
                  <motion.div
                    key="orders-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {orders.length === 0 ? (
                      <div className="text-center py-20">
                        <span className="text-3xl">📦</span>
                        <h3 className="text-sm font-black text-neutral-700 mt-2">No orders recorded yet</h3>
                        <p className="text-xs text-neutral-400 mt-1">When customers place orders, they will appear here dynamically in real-time.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((o) => (
                          <div 
                            key={o.id} 
                            className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow"
                          >
                            <div className="space-y-2 flex-1">
                              {/* Order metadata */}
                              <div className="flex flex-wrap gap-2 items-center text-xs">
                                <span className="font-black bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-lg">
                                  #{o.id}
                                </span>
                                <span className="text-neutral-400 font-bold">{o.timestamp}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  o.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                  o.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                                  o.status === 'dispatched' ? 'bg-indigo-100 text-indigo-800' :
                                  'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {o.status === 'pending' ? 'Order Placed' :
                                   o.status === 'preparing' ? 'Packing' :
                                   o.status === 'dispatched' ? 'On The Way' :
                                   'Delivered'}
                                </span>
                              </div>

                              {/* Customer Details */}
                              <div className="text-xs bg-neutral-50 p-3 rounded-xl border border-neutral-100 space-y-2">
                                <p className="font-extrabold text-neutral-800">{(o.deliveryAddress?.name) || 'Unknown Customer'} ({(o.deliveryAddress?.phone) || 'No Phone'})</p>
                                <p className="text-neutral-500 font-semibold text-[11px] leading-tight">
                                  {(o.deliveryAddress?.address) || `${(o.deliveryAddress?.flat) || ''}, ${(o.deliveryAddress?.area) || ''}, ${(o.deliveryAddress?.city) || ''}` || 'No Address Provided'}
                                </p>
                                
                                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-dashed border-neutral-200">
                                  {o.deliveryAddress?.latitude && o.deliveryAddress?.longitude ? (
                                    <>
                                      <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                                        GPS Locked: {o.deliveryAddress.latitude}, {o.deliveryAddress.longitude}
                                      </span>
                                      <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${o.deliveryAddress.latitude},${o.deliveryAddress.longitude}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-neutral-900 text-yellow-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-1 shadow-xs"
                                      >
                                        <span>📍 Navigate to Coordinates</span>
                                      </a>
                                    </>
                                  ) : (
                                    <>
                                      <span className="bg-amber-50 text-amber-700 text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border border-amber-100">
                                        No GPS tag (Using Text Address)
                                      </span>
                                      <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                          o.deliveryAddress?.address || `${o.deliveryAddress?.flat || ''}, ${o.deliveryAddress?.area || ''}, ${o.deliveryAddress?.city || ''}`
                                        )}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-neutral-900 text-yellow-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-1 shadow-xs"
                                      >
                                        <span>🗺️ Navigate via Address Search</span>
                                      </a>
                                    </>
                                  )}
                                </div>

                                <p className="text-neutral-400 font-bold text-[10px]">Payment: {String(o.paymentMethod || 'COD').toUpperCase()}</p>
                              </div>

                              {/* Order items */}
                              <div className="text-xs font-semibold text-neutral-600">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Items Included:</p>
                                <ul className="list-disc list-inside space-y-0.5">
                                  {o.items.map((it, idx) => (
                                    <li key={idx}>
                                      {it.product?.name || 'Unknown Product'} - <span className="font-extrabold text-neutral-800">{it.quantity} x ₹{it.product?.price || 0}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Total and Actions */}
                            <div className="flex flex-col items-end gap-2 shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                              <div className="text-right">
                                <span className="text-[10px] text-neutral-400 font-bold uppercase">Total Amount</span>
                                <p className="text-xl font-black text-neutral-900">₹{o.totalAmount}</p>
                              </div>

                              {/* Pipeline status controller */}
                              <div className="flex flex-col items-end gap-1.5 mt-2">
                                <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Set Delivery Status:</span>
                                <div className="flex flex-wrap gap-1 bg-neutral-100 p-1 rounded-xl">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateOrderStatus(o.id, 'pending')}
                                    className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg transition-all ${
                                      o.status === 'pending'
                                        ? 'bg-amber-600 text-white shadow-xs'
                                        : 'text-neutral-500 hover:text-neutral-850 hover:bg-neutral-200'
                                    }`}
                                  >
                                    Order Placed
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateOrderStatus(o.id, 'preparing')}
                                    className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg transition-all ${
                                      o.status === 'preparing'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-neutral-500 hover:text-neutral-850 hover:bg-neutral-200'
                                    }`}
                                  >
                                    Packing
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateOrderStatus(o.id, 'dispatched')}
                                    className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg transition-all ${
                                      o.status === 'dispatched'
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'text-neutral-500 hover:text-neutral-850 hover:bg-neutral-200'
                                    }`}
                                  >
                                    On The Way
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateOrderStatus(o.id, 'delivered')}
                                    className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg transition-all ${
                                      o.status === 'delivered'
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'text-neutral-500 hover:text-neutral-850 hover:bg-neutral-200'
                                    }`}
                                  >
                                    Delivered
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 2. PRODUCTS TAB */}
                {activeTab === 'products' && (
                  <motion.div
                    key="products-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="overflow-x-auto rounded-2xl border border-neutral-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-neutral-50 text-neutral-500 font-extrabold uppercase border-b border-neutral-200">
                            <th className="p-3 pl-4">Product Info</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Price / MRP</th>
                            <th className="p-3">Stock Status</th>
                            <th className="p-3 pr-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-150">
                          {products.map((p) => (
                            <tr key={p.id} className="hover:bg-neutral-50">
                              <td className="p-3 pl-4">
                                <div className="flex items-center space-x-3">
                                  {p.image ? (
                                    <img 
                                      src={p.image} 
                                      alt={p.name} 
                                      className="w-10 h-10 object-cover rounded-xl border border-neutral-100 shadow-inner shrink-0" 
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-neutral-100 text-xl flex items-center justify-center rounded-xl border border-neutral-100 shrink-0">
                                      📦
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-extrabold text-neutral-800">{p.name}</p>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{p.brand} ({p.unit})</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded-md uppercase text-[9px] font-extrabold">
                                  {(p.category || 'general').replace('-', ' ')}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="font-bold">
                                  <span className="text-neutral-800 font-black">₹{p.price}</span>
                                  <span className="text-neutral-400 line-through text-[10px] ml-1.5 font-semibold">₹{p.mrp}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <button
                                  onClick={() => handleToggleStock(p)}
                                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border transition-all ${
                                    p.inStock 
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                                      : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                                  }`}
                                >
                                  {p.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                                </button>
                              </td>
                              <td className="p-3 pr-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => openEditModal(p)}
                                    className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors"
                                    title="Edit Product"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id, p.name)}
                                    className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* 3. CUSTOMERS TAB */}
                {activeTab === 'customers' && (
                  <motion.div
                    key="customers-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {customers.length === 0 ? (
                      <div className="col-span-2 text-center py-20">
                        <span className="text-3xl">👥</span>
                        <h3 className="text-sm font-black text-neutral-700 mt-2">No active customer records</h3>
                        <p className="text-xs text-neutral-400 mt-1">When customers place orders, their contact and shipping profiles will populate here automatically.</p>
                      </div>
                    ) : (
                      customers.map((c, i) => (
                        <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-extrabold text-neutral-800">{c.name}</h3>
                                <p className="text-[11px] text-neutral-400 font-semibold">{c.email}</p>
                              </div>
                              <span className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-xl">
                                {c.orderCount} {c.orderCount === 1 ? 'Order' : 'Orders'}
                              </span>
                            </div>

                            <div className="text-[11px] font-semibold text-neutral-500 space-y-1 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                              <p className="flex items-center text-neutral-700">📞 {c.phone}</p>
                              <p className="leading-tight flex items-start gap-1">
                                <span>📍</span>
                                <span>{c.address}</span>
                              </p>
                              <div className="pt-1.5 mt-1.5 border-t border-neutral-200/60 flex items-center gap-1.5">
                                {c.latitude && c.longitude ? (
                                  <>
                                    <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">GPS Pinned</span>
                                    <a
                                      href={`https://www.google.com/maps/search/?api=1&query=${c.latitude},${c.longitude}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[9px] font-black uppercase text-neutral-900 bg-yellow-400 px-2 py-0.5 rounded shadow-2xs hover:bg-neutral-800 hover:text-white transition-all"
                                    >
                                      Open Google Maps
                                    </a>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-[9px] font-semibold uppercase text-neutral-400">No GPS Tag</span>
                                    <a
                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[9px] font-black uppercase text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded border hover:bg-neutral-800 hover:text-white transition-all"
                                    >
                                      Search Location
                                    </a>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-neutral-100 mt-3 pt-2 flex justify-between items-center">
                            <span className="text-[9px] text-neutral-400 font-bold uppercase">Total Order Value:</span>
                            <span className="text-xs font-black text-emerald-800">₹{c.totalSpent.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      {/* 4. PRODUCT EDIT / ADD MODAL */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-neutral-100 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 transition-colors text-neutral-500"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-md font-black uppercase text-neutral-900 tracking-tight mb-4">
                {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Catalog Product'}
              </h2>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                {/* 2-Column fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Premium Basmati Rice"
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-850 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Brand Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Annapurna, Tata, Fortune"
                      value={pBrand}
                      onChange={(e) => setPBrand(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-850 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Price * (₹)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                        <span className="text-xs">₹</span>
                      </div>
                      <input
                        type="number"
                        required
                        placeholder="Discounted selling price"
                        value={pPrice}
                        onChange={(e) => setPPrice(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 text-neutral-850 text-xs font-semibold rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">MRP * (₹)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                        <span className="text-xs">₹</span>
                      </div>
                      <input
                        type="number"
                        required
                        placeholder="Maximum Retail Price"
                        value={pMrp}
                        onChange={(e) => setPMrp(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 text-neutral-850 text-xs font-semibold rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Unit Weight/Size *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1 Litre, 5 Kg, 400g"
                      value={pUnit}
                      onChange={(e) => setPUnit(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-850 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Category *</label>
                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-850 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    >
                      <option value="oils-ghee">🧴 Oils & Ghee</option>
                      <option value="essential-grains">🌾 Essential Grains (Rice/Flour)</option>
                      <option value="spices-masalas">🌶️ Spices & Masalas</option>
                      <option value="snacks-beverages">🍪 Snacks & Beverages</option>
                      <option value="household-care">🧼 Household Care & Soap</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Product Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe nutrients, purity guarantee, or organic details..."
                    value={pDescription}
                    onChange={(e) => setPDescription(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-850 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                  />
                </div>

                {/* Veg Flag and Offer */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                    <input
                      type="checkbox"
                      id="isVegCheckbox"
                      checked={pIsVeg}
                      onChange={(e) => setPIsVeg(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-neutral-300 rounded"
                    />
                    <label htmlFor="isVegCheckbox" className="text-xs font-extrabold text-neutral-700 flex items-center space-x-1 cursor-pointer">
                      <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full inline-block"></span>
                      <span>100% Vegetarian (Pure)</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Special Tag / Offer</label>
                    <input
                      type="text"
                      placeholder="e.g. Buy 1 Get 1 Free, SAVE 15%"
                      value={pSpecialOffer}
                      onChange={(e) => setPSpecialOffer(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-850 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                {/* IMAGE FILE UPLOAD MODULE */}
                <div className="bg-neutral-50 p-4 rounded-2xl border border-dashed border-neutral-300">
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-2">Product Image (File Upload)</label>
                  
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-neutral-200 rounded-xl border border-neutral-300 overflow-hidden shrink-0 flex items-center justify-center">
                      {pImageUrl ? (
                        <img 
                          src={pImageUrl} 
                          alt="Uploaded product preview" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Package className="w-6 h-6 text-neutral-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="ownerProductImageInput"
                        />
                        <label
                          htmlFor="ownerProductImageInput"
                          className="inline-flex items-center space-x-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-[11px] font-extrabold px-3 py-2 rounded-xl shadow-sm cursor-pointer transition-all uppercase tracking-wide"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingImage ? 'Uploading...' : 'Choose File'}</span>
                        </label>
                      </div>
                      <p className="text-[10px] text-neutral-400 font-bold mt-1.5 leading-none">JPEG, JPG, PNG or WEBP. Max size 5MB.</p>
                    </div>
                  </div>
                </div>

                {/* Theme Selector */}
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Color Palette (Card Accent)</label>
                  <div className="flex space-x-2">
                    {['emerald', 'amber', 'rose', 'sky', 'indigo'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setPColorTheme(c)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          pColorTheme === c ? 'border-neutral-900 scale-110 shadow-md' : 'border-transparent opacity-60'
                        } ${
                          c === 'emerald' ? 'bg-emerald-500' :
                          c === 'amber' ? 'bg-amber-500' :
                          c === 'rose' ? 'bg-rose-500' :
                          c === 'sky' ? 'bg-sky-500' : 'bg-indigo-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="w-1/2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold text-xs py-3 rounded-xl transition-colors uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-colors uppercase tracking-wider"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {productToDelete && (
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-neutral-100 text-center"
              id="delete-confirm-modal"
            >
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 border border-red-100">
                ⚠️
              </div>
              <h3 className="text-base font-extrabold text-neutral-900 mb-2">Delete Product?</h3>
              <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
                Are you sure you want to delete <b className="text-neutral-800">"{productToDelete.name}"</b>? This action cannot be undone.
              </p>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  className="w-1/2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold text-xs py-3 rounded-xl transition-colors uppercase"
                  id="cancel-delete-btn"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteProduct}
                  className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-colors uppercase tracking-wider"
                  id="confirm-delete-btn"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
