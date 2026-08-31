import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Settings,
  DollarSign,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Copy,
  Printer,
  Phone,
  MessageCircle,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sliders,
  FileSpreadsheet,
  ArrowUpRight,
  CreditCard,
  KeyRound,
  Database,
  Layers,
} from 'lucide-react';
import {
  CustomerOrder,
  TShirtProduct,
  AdminUser,
  StoreSettings,
  CustomerProfile,
  TShirtSize,
} from '../../types';
import { DEFAULT_STORE_SETTINGS } from '../../data/adminDefaults';
import { TShirtMockupView } from '../tshirt/TShirtMockupView';
import { AdminOrderDetailsModal } from './AdminOrderDetailsModal';
import { AdminInvoiceModal } from './AdminInvoiceModal';
import { AdminProductModal } from './AdminProductModal';

interface Props {
  adminUser: AdminUser;
  onLogout: () => void;
  orders: CustomerOrder[];
  products: TShirtProduct[];
  storeSettings: StoreSettings;
  onUpdateOrderStatus: (orderId: string, newStatus: CustomerOrder['status']) => void;
  onDeleteOrder: (orderId: string) => void;
  onUpdateProduct: (product: TShirtProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: (product: TShirtProduct) => void;
  onUpdateStoreSettings: (settings: StoreSettings) => void;
  onUpdateAdminPassword: (newPassword: string) => void;
  onNavigateToStore: () => void;
  onNavigateToStudio: () => void;
}

type AdminTab = 'overview' | 'orders' | 'products' | 'customers' | 'settings';

export const AdminManagementPanel: React.FC<Props> = ({
  adminUser,
  onLogout,
  orders,
  products,
  storeSettings = DEFAULT_STORE_SETTINGS,
  onUpdateOrderStatus,
  onDeleteOrder,
  onUpdateProduct,
  onDeleteProduct,
  onAddProduct,
  onUpdateStoreSettings,
  onUpdateAdminPassword,
  onNavigateToStore,
  onNavigateToStudio,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Modal States
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<CustomerOrder | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<CustomerOrder | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<TShirtProduct | null>(null);

  // Orders Filtering & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>('all');

  // Products Filtering & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Settings State Form
  const [localSettings, setLocalSettings] = useState<StoreSettings>(storeSettings);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState<string | null>(null);

  // ================= COMPUTED METRICS =================
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const totalDeliveredRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status === 'Delivered')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === 'Pending').length;
  }, [orders]);

  const confirmedOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === 'Confirmed').length;
  }, [orders]);

  const shippedOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === 'Shipped').length;
  }, [orders]);

  const deliveredOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === 'Delivered').length;
  }, [orders]);

  const totalUnitsInStock = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.stock || 0), 0);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) < 10).length;
  }, [products]);

  // Compute Customers (CRM)
  const customersList: CustomerProfile[] = useMemo(() => {
    const map = new Map<string, CustomerProfile>();
    orders.forEach((o) => {
      const key = o.phone.trim();
      if (!map.has(key)) {
        map.set(key, {
          id: `CUST-${key}`,
          name: o.customerName,
          phone: o.phone,
          address: o.address,
          district: o.district,
          totalOrders: 1,
          totalSpent: o.status !== 'Cancelled' ? o.total : 0,
          lastOrderDate: o.createdAt,
          orders: [o],
        });
      } else {
        const existing = map.get(key)!;
        existing.totalOrders += 1;
        if (o.status !== 'Cancelled') {
          existing.totalSpent += o.total;
        }
        if (o.createdAt > existing.lastOrderDate) {
          existing.lastOrderDate = o.createdAt;
          existing.address = o.address;
          existing.district = o.district;
        }
        existing.orders.push(o);
      }
    });
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  // Filtered Orders List
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.phone.includes(orderSearch) ||
        o.district.toLowerCase().includes(orderSearch.toLowerCase());
      const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      const matchesPayment = orderPaymentFilter === 'all' || o.paymentMethod === orderPaymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, orderSearch, orderStatusFilter, orderPaymentFilter]);

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
      const matchesStock =
        productStockFilter === 'all'
          ? true
          : productStockFilter === 'in_stock'
          ? (p.stock || 0) >= 10
          : productStockFilter === 'low_stock'
          ? (p.stock || 0) > 0 && (p.stock || 0) < 10
          : (p.stock || 0) === 0;
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, productSearch, productCategoryFilter, productStockFilter]);

  // Export Orders to CSV (Steadfast / Courier Ready)
  const handleExportOrdersCsv = () => {
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Phone',
      'Delivery Address',
      'District',
      'Payment Method',
      'Status',
      'Items Count',
      'Subtotal',
      'Delivery Fee',
      'Total Amount',
      'Special Notes',
    ];

    const rows = filteredOrders.map((o) => [
      `"${o.id}"`,
      `"${new Date(o.createdAt).toLocaleDateString()}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      `"${o.district.replace(/"/g, '""')}"`,
      `"${o.paymentMethod.toUpperCase()}"`,
      `"${o.status}"`,
      `"${o.items.reduce((s, i) => s + i.quantity, 0)}"`,
      `"${o.subtotal}"`,
      `"${o.deliveryFee}"`,
      `"${o.total}"`,
      `"${(o.specialNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStockAdjustment = (productId: string, delta: number) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    const newStock = Math.max(0, (p.stock || 0) + delta);
    onUpdateProduct({ ...p, stock: newStock });
  };

  const handleTogglePublish = (product: TShirtProduct) => {
    onUpdateProduct({ ...product, isPublished: !product.isPublished });
  };

  const handleDuplicateProduct = (product: TShirtProduct) => {
    const duplicated: TShirtProduct = {
      ...product,
      id: `TSHIRT-${Date.now()}`,
      title: `${product.title} (Copy)`,
      createdAt: Date.now(),
    };
    onAddProduct(duplicated);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreSettings(localSettings);
    setSettingsSuccessMsg('Store & delivery settings updated successfully!');
    setTimeout(() => setSettingsSuccessMsg(null), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput || newPasswordInput.length < 4) {
      alert('Password must be at least 4 characters');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      alert('Passwords do not match');
      return;
    }
    onUpdateAdminPassword(newPasswordInput);
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setPasswordSuccessMsg('Admin master password changed successfully!');
    setTimeout(() => setPasswordSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Executive Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 rounded-2xl p-6 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest uppercase bg-amber-400 text-white px-2 py-0.5 rounded">
                ADMIN CONSOLE
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Store Operational
              </span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white mt-1 flex items-center gap-2">
              <span>{storeSettings.storeName} Management Suite</span>
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Logged in as <b className="text-white">{adminUser.name}</b> ({adminUser.role}) • {adminUser.email}
            </p>
          </div>
        </div>

        {/* Quick Nav & Logout Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onNavigateToStore}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Open Live Customer Store"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>Storefront</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={onNavigateToStudio}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Bulk T-Shirt Mockup Studio"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Bulk Studio</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to log out of the Admin Management Panel?')) {
                onLogout();
              }
            }}
            className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'overview'
              ? 'bg-black text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-950'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>Executive Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'orders'
              ? 'bg-black text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-950'
          }`}
        >
          <Package className="w-4 h-4 text-indigo-400" />
          <span>Orders & Logistics</span>
          {pendingOrdersCount > 0 && (
            <span className="px-1.5 py-0.5 bg-amber-400 text-white font-black text-[10px] rounded-full">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'products'
              ? 'bg-black text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-950'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-emerald-400" />
          <span>Products & Inventory ({products.length})</span>
          {lowStockCount > 0 && (
            <span className="px-1.5 py-0.5 bg-rose-500 text-white font-bold text-[10px] rounded-full">
              {lowStockCount} Low
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'customers'
              ? 'bg-black text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-950'
          }`}
        >
          <Users className="w-4 h-4 text-blue-400" />
          <span>Customers CRM ({customersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'settings'
              ? 'bg-black text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-950'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Store & Security Settings</span>
        </button>
      </div>

      {/* ================= TAB 1: EXECUTIVE OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 5 KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Revenue */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">
                  ৳
                </div>
              </div>
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                ৳{totalRevenue.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>৳{totalDeliveredRevenue.toLocaleString()} delivered & settled</span>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                {orders.length}
              </div>
              <div className="text-[11px] text-slate-400">
                {deliveredOrdersCount} Completed • {shippedOrdersCount} In Transit
              </div>
            </div>

            {/* Pending Orders Alert */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Orders</span>
                <div className="w-8 h-8 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono tracking-tight">
                {pendingOrdersCount}
              </div>
              <div className="text-[11px] text-amber-400 font-semibold">
                Requires courier confirmation
              </div>
            </div>

            {/* Average Order Value (AOV) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value</span>
                <div className="w-8 h-8 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                ৳{orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Per checkout basket
              </div>
            </div>

            {/* Total Stock / Inventory */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Inventory Stock</span>
                <div className="w-8 h-8 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                {totalUnitsInStock} <span className="text-xs text-slate-400 font-normal">units</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Across {products.length} T-shirt designs
              </div>
            </div>
          </div>

          {/* Quick Action & Status Overview Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 cols: Orders Pipeline Status & Recent Activity */}
            <div className="lg:col-span-7 space-y-6">
              {/* Order Status Breakdown Bar */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Order Fulfillment Pipeline</span>
                  <span className="text-xs text-slate-400">{orders.length} total orders</span>
                </h3>

                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  <div className="bg-amber-950 border border-amber-800 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-amber-400 uppercase block">Pending</span>
                    <span className="text-lg font-black text-amber-300 font-mono">{pendingOrdersCount}</span>
                  </div>
                  <div className="bg-purple-950 border border-purple-800 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-purple-400 uppercase block">Confirmed</span>
                    <span className="text-lg font-black text-purple-300 font-mono">{confirmedOrdersCount}</span>
                  </div>
                  <div className="bg-blue-950 border border-blue-800 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-blue-400 uppercase block">Shipped</span>
                    <span className="text-lg font-black text-blue-300 font-mono">{shippedOrdersCount}</span>
                  </div>
                  <div className="bg-emerald-950 border border-emerald-800 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase block">Delivered</span>
                    <span className="text-lg font-black text-emerald-300 font-mono">{deliveredOrdersCount}</span>
                  </div>
                  <div className="bg-rose-950 border border-rose-800 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-rose-400 uppercase block">Cancelled</span>
                    <span className="text-lg font-black text-rose-300 font-mono">
                      {orders.filter((o) => o.status === 'Cancelled').length}
                    </span>
                  </div>
                </div>

                {/* Visual Status Progress Bar */}
                {orders.length > 0 && (
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${(pendingOrdersCount / orders.length) * 100}%` }}
                      className="bg-amber-400 h-full"
                      title="Pending"
                    />
                    <div
                      style={{ width: `${(confirmedOrdersCount / orders.length) * 100}%` }}
                      className="bg-purple-500 h-full"
                      title="Confirmed"
                    />
                    <div
                      style={{ width: `${(shippedOrdersCount / orders.length) * 100}%` }}
                      className="bg-blue-500 h-full"
                      title="Shipped"
                    />
                    <div
                      style={{ width: `${(deliveredOrdersCount / orders.length) * 100}%` }}
                      className="bg-emerald-500 h-full"
                      title="Delivered"
                    />
                    <div
                      style={{
                        width: `${
                          (orders.filter((o) => o.status === 'Cancelled').length / orders.length) * 100
                        }%`,
                      }}
                      className="bg-rose-400 h-full"
                      title="Cancelled"
                    />
                  </div>
                )}
              </div>

              {/* Recent Orders Live Stream */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Orders</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-800">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="py-3 flex items-center justify-between gap-3 hover:bg-slate-950/80 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                          {order.id.slice(-3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white">{order.customerName}</span>
                            <span className="text-[10px] font-mono text-slate-400">#{order.id}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {order.phone} • {order.district} • {order.items.length} items
                          </p>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="text-xs font-black font-mono text-white">৳{order.total}</div>
                        <button
                          onClick={() => setSelectedOrderForDetails(order)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-900 text-emerald-300'
                              : order.status === 'Shipped'
                              ? 'bg-blue-900 text-blue-300'
                              : order.status === 'Confirmed'
                              ? 'bg-purple-900 text-purple-300'
                              : 'bg-amber-900 text-amber-300'
                          }`}
                        >
                          {order.status}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 cols: Top Selling Products & Fast Actions */}
            <div className="lg:col-span-5 space-y-6">
              {/* Quick Admin Actions Box */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-black tracking-wide uppercase text-amber-400">
                    Fast Administrative Tools
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      setProductToEdit(null);
                      setIsProductModalOpen(true);
                    }}
                    className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-amber-400 mb-1" />
                    <span className="text-xs font-bold block">Add New T-Shirt</span>
                    <span className="text-[10px] text-slate-300">Custom drop or photo</span>
                  </button>

                  <button
                    onClick={onNavigateToStudio}
                    className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-indigo-400 mb-1" />
                    <span className="text-xs font-bold block">Bulk Mockup Studio</span>
                    <span className="text-[10px] text-slate-300">Upload 50+ PNGs at once</span>
                  </button>

                  <button
                    onClick={handleExportOrdersCsv}
                    className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-400 mb-1" />
                    <span className="text-xs font-bold block">Export Courier CSV</span>
                    <span className="text-[10px] text-slate-300">Steadfast / Pathao ready</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-blue-400 mb-1" />
                    <span className="text-xs font-bold block">Store Settings</span>
                    <span className="text-[10px] text-slate-300">Delivery fees & bKash</span>
                  </button>
                </div>
              </div>

              {/* Active Product Catalog Snapshot */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Featured Streetwear Drops</h3>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage Inventory</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {products.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="w-12 h-12 bg-black rounded-lg overflow-hidden shrink-0">
                        <TShirtMockupView
                          color={p.defaultColor}
                          designImage={p.designImage}
                          customMockupImage={p.customMockupImage}
                          designScale={50}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-white block truncate">{p.title}</span>
                        <span className="text-[10px] text-slate-400">{p.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-white">৳{p.price}</div>
                        <span className={`text-[10px] font-bold ${
                          (p.stock || 0) < 10 ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {p.stock} in stock
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: ORDERS MANAGEMENT & LOGISTICS ================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
          {/* Top Controls: Search, Filters, Export */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search by Order ID, Customer, Phone, or District..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 focus:border-indigo-600 focus:bg-slate-900 rounded-xl text-xs font-medium outline-hidden"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 outline-hidden cursor-pointer"
              >
                <option value="all">All Statuses ({orders.length})</option>
                <option value="Pending">Pending ({pendingOrdersCount})</option>
                <option value="Confirmed">Confirmed ({confirmedOrdersCount})</option>
                <option value="Shipped">Shipped ({shippedOrdersCount})</option>
                <option value="Delivered">Delivered ({deliveredOrdersCount})</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <select
                value={orderPaymentFilter}
                onChange={(e) => setOrderPaymentFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 outline-hidden cursor-pointer"
              >
                <option value="all">All Payment Methods</option>
                <option value="cod">Cash on Delivery (COD)</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
              </select>

              <button
                onClick={handleExportOrdersCsv}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV ({filteredOrders.length})</span>
              </button>
            </div>
          </div>

          {/* Orders Master Table */}
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Package className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-200">No matching orders found</p>
              <p className="text-xs">Try adjusting your search criteria or status filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-300 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Order ID & Date</th>
                    <th className="p-3">Customer Contact</th>
                    <th className="p-3">Delivery Zone</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Total (৳)</th>
                    <th className="p-3">Fulfillment Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {filteredOrders.map((order) => {
                    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
                    const waLink = `https://wa.me/${cleanPhone.startsWith('880') ? cleanPhone : '880' + cleanPhone.replace(/^0+/, '')}`;

                    return (
                      <tr key={order.id} className="hover:bg-slate-950/80 transition-colors">
                        {/* Order ID & Date */}
                        <td className="p-3">
                          <button
                            onClick={() => setSelectedOrderForDetails(order)}
                            className="font-bold font-mono text-indigo-400 hover:underline block text-xs cursor-pointer"
                          >
                            #{order.id}
                          </button>
                          <span className="text-[10px] text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        {/* Customer Info */}
                        <td className="p-3">
                          <div className="font-bold text-white">{order.customerName}</div>
                          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] mt-0.5">
                            <span>{order.phone}</span>
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:text-emerald-300"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`tel:${order.phone}`}
                              className="text-slate-400 hover:text-slate-100"
                              title="Call Customer"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>

                        {/* District */}
                        <td className="p-3">
                          <span className="font-bold text-slate-100 block truncate max-w-[140px]">
                            {order.district}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                            {order.address}
                          </span>
                        </td>

                        {/* Items Preview */}
                        <td className="p-3">
                          <div className="flex items-center -space-x-2">
                            {order.items.slice(0, 3).map((it) => (
                              <div
                                key={it.id}
                                className="w-8 h-8 rounded-lg bg-black border-2 border-slate-900 overflow-hidden shadow-2xs"
                                title={`${it.product.title} (${it.selectedSize})`}
                              >
                                <TShirtMockupView
                                  color={it.selectedColor}
                                  designImage={it.product.designImage}
                                  customMockupImage={it.product.customMockupImage}
                                  designScale={50}
                                />
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <span className="w-8 h-8 rounded-lg bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-200">
                                +{order.items.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Payment */}
                        <td className="p-3">
                          <span className="font-bold uppercase text-slate-100 block text-[11px]">
                            {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod}
                          </span>
                        </td>

                        {/* Total */}
                        <td className="p-3 font-mono font-black text-white text-sm">
                          ৳{order.total}
                        </td>

                        {/* Status Select Updater */}
                        <td className="p-3">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              onUpdateOrderStatus(order.id, e.target.value as CustomerOrder['status'])
                            }
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg border outline-hidden cursor-pointer ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                                : order.status === 'Shipped'
                                ? 'bg-blue-950 border-blue-700 text-blue-300'
                                : order.status === 'Confirmed'
                                ? 'bg-purple-950 border-purple-700 text-purple-300'
                                : order.status === 'Cancelled'
                                ? 'bg-rose-950 border-rose-700 text-rose-300'
                                : 'bg-amber-950 border-amber-700 text-amber-300'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedOrderForDetails(order)}
                              className="p-1.5 text-slate-300 hover:text-indigo-400 hover:bg-indigo-950 rounded-lg transition-colors cursor-pointer"
                              title="View Full Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedOrderForInvoice(order)}
                              className="p-1.5 text-slate-300 hover:text-amber-400 hover:bg-amber-950 rounded-lg transition-colors cursor-pointer"
                              title="Print Invoice / Packing Slip"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to permanently delete order #${order.id}?`)) {
                                  onDeleteOrder(order.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950 rounded-lg transition-colors cursor-pointer"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: PRODUCTS & INVENTORY CONTROL ================= */}
      {activeTab === 'products' && (
        <div className="space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
          {/* Product Controls Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by title or category..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 focus:border-indigo-600 focus:bg-slate-900 rounded-xl text-xs font-medium outline-hidden"
              />
            </div>

            {/* Filter & Add Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 outline-hidden cursor-pointer"
              >
                <option value="all">All Categories</option>
                {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={productStockFilter}
                onChange={(e) => setProductStockFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 outline-hidden cursor-pointer"
              >
                <option value="all">All Stock Statuses</option>
                <option value="in_stock">In Stock (10+)</option>
                <option value="low_stock">Low Stock (1-9)</option>
                <option value="out_of_stock">Out of Stock (0)</option>
              </select>

              <button
                onClick={() => {
                  setProductToEdit(null);
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2 bg-black hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Add New Design</span>
              </button>
            </div>
          </div>

          {/* Product Grid / Inventory Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3 relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3">
                    {/* Visual Mockup Thumbnail */}
                    <div className="w-20 h-20 bg-black rounded-xl overflow-hidden shrink-0 border border-slate-800">
                      <TShirtMockupView
                        color={p.defaultColor}
                        designImage={p.designImage}
                        customMockupImage={p.customMockupImage}
                        designScale={50}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] bg-slate-700 text-slate-200 font-bold px-1.5 py-0.2 rounded">
                          {p.category}
                        </span>
                        {p.badge && (
                          <span className="text-[10px] bg-amber-900 text-amber-300 font-bold px-1.5 py-0.2 rounded">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-black text-white mt-1 truncate">{p.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-black font-mono text-white">৳{p.price}</span>
                        {p.originalPrice > p.price && (
                          <span className="text-xs font-mono text-slate-400 line-through">
                            ৳{p.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stock Level & Inline Adjuster */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Stock Count</span>
                      <span className={`font-mono font-black text-xs ${
                        (p.stock || 0) === 0
                          ? 'text-rose-400'
                          : (p.stock || 0) < 10
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}>
                        {p.stock} units
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                      <button
                        onClick={() => handleStockAdjustment(p.id, -5)}
                        className="px-1.5 py-0.5 text-slate-300 hover:bg-slate-800 font-bold text-xs rounded cursor-pointer"
                        title="Reduce 5 units"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => handleStockAdjustment(p.id, -1)}
                        className="px-1.5 py-0.5 text-slate-300 hover:bg-slate-800 font-bold text-xs rounded cursor-pointer"
                        title="Reduce 1 unit"
                      >
                        -1
                      </button>
                      <span className="px-1 font-mono font-bold text-slate-100">{p.stock}</span>
                      <button
                        onClick={() => handleStockAdjustment(p.id, 1)}
                        className="px-1.5 py-0.5 text-slate-300 hover:bg-slate-800 font-bold text-xs rounded cursor-pointer"
                        title="Add 1 unit"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleStockAdjustment(p.id, 5)}
                        className="px-1.5 py-0.5 text-slate-300 hover:bg-slate-800 font-bold text-xs rounded cursor-pointer"
                        title="Add 5 units"
                      >
                        +5
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleTogglePublish(p)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                      p.isPublished
                        ? 'bg-emerald-900 text-emerald-300 hover:bg-emerald-800'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {p.isPublished ? <CheckCircle2 className="w-3 h-3" /> : null}
                    <span>{p.isPublished ? 'Storefront: Active' : 'Hidden'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicateProduct(p)}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                      title="Duplicate Product"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setProductToEdit(p);
                        setIsProductModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${p.title}" permanently?`)) {
                          onDeleteProduct(p.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: CUSTOMER CRM DATABASE ================= */}
      {activeTab === 'customers' && (
        <div className="space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Customer Relationship Directory (CRM)</h3>
              <p className="text-xs text-slate-400">
                Aggregated purchase history, customer lifetime values (LTV), and direct contact channels.
              </p>
            </div>
            <span className="text-xs font-bold bg-indigo-950 text-indigo-400 px-3 py-1 rounded-full">
              {customersList.length} Unique Verified Customers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-300 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Phone & Direct WhatsApp</th>
                  <th className="p-3">Primary Location</th>
                  <th className="p-3 text-center">Orders Count</th>
                  <th className="p-3 text-right">Lifetime Spent (৳)</th>
                  <th className="p-3 text-right">Last Purchase</th>
                  <th className="p-3 text-right">Direct Outreach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {customersList.map((cust) => {
                  const cleanPhone = cust.phone.replace(/[^0-9]/g, '');
                  const intlPhone = cleanPhone.startsWith('880') ? cleanPhone : `880${cleanPhone.replace(/^0+/, '')}`;
                  const waMsg = encodeURIComponent(
                    `Hi ${cust.name}! Special VIP discount code 'DROP15' is now active for you at ${storeSettings.storeName}. Check out our newest street apparel!`
                  );
                  const waUrl = `https://wa.me/${intlPhone}?text=${waMsg}`;

                  return (
                    <tr key={cust.id} className="hover:bg-slate-950/80 transition-colors">
                      <td className="p-3 font-bold text-white">{cust.name}</td>
                      <td className="p-3 font-mono text-slate-200">{cust.phone}</td>
                      <td className="p-3 text-slate-300">
                        <span className="font-bold text-slate-100 block">{cust.district}</span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[200px]">
                          {cust.address}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-100 font-bold rounded-full font-mono">
                          {cust.totalOrders}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-black text-indigo-400">
                        ৳{cust.totalSpent.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-slate-400 text-[11px]">
                        {new Date(cust.lastOrderDate).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-bold text-[11px] rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>WhatsApp VIP</span>
                          </a>
                          <a
                            href={`tel:${cust.phone}`}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                            title="Call Customer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 5: STORE CONFIGURATION & SECURITY ================= */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Store & Payment Settings (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span>Store Profile & Delivery Rates</span>
                </h3>
                {settingsSuccessMsg && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {settingsSuccessMsg}
                  </span>
                )}
              </div>

              {/* Store Name & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Store Brand Name</label>
                  <input
                    type="text"
                    value={localSettings.storeName}
                    onChange={(e) => setLocalSettings({ ...localSettings, storeName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Customer Hotline Phone</label>
                  <input
                    type="text"
                    value={localSettings.hotlinePhone}
                    onChange={(e) => setLocalSettings({ ...localSettings, hotlinePhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-medium outline-hidden"
                  />
                </div>
              </div>

              {/* Support Email & Physical Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Support Email</label>
                  <input
                    type="email"
                    value={localSettings.supportEmail}
                    onChange={(e) => setLocalSettings({ ...localSettings, supportEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-medium outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Store Dispatch Address</label>
                  <input
                    type="text"
                    value={localSettings.address}
                    onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-medium outline-hidden"
                  />
                </div>
              </div>

              {/* Courier Delivery Charges */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white block">Courier Delivery Rates (BDT ৳)</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Inside Dhaka</label>
                    <input
                      type="number"
                      value={localSettings.deliveryInsideDhaka}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, deliveryInsideDhaka: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono font-bold outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Outside Dhaka</label>
                    <input
                      type="number"
                      value={localSettings.deliveryOutsideDhaka}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, deliveryOutsideDhaka: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono font-bold outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Free Shipping (৳)</label>
                    <input
                      type="number"
                      value={localSettings.freeShippingThreshold}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, freeShippingThreshold: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono font-bold outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods Config */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-white block">Payment Gateway Instructions</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">bKash Merchant / Personal No.</label>
                    <input
                      type="text"
                      value={localSettings.bkashNumber}
                      onChange={(e) => setLocalSettings({ ...localSettings, bkashNumber: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Nagad Account No.</label>
                    <input
                      type="text"
                      value={localSettings.nagadNumber}
                      onChange={(e) => setLocalSettings({ ...localSettings, nagadNumber: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Announcement Bar */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Store Announcement Bar Text</label>
                <input
                  type="text"
                  value={localSettings.announcementText}
                  onChange={(e) => setLocalSettings({ ...localSettings, announcementText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-medium outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-black hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Store Settings
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Admin Password & Data Management (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Change Admin Password */}
            <form onSubmit={handleChangePassword} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  <span>Admin Credentials & Security</span>
                </h3>
              </div>

              {passwordSuccessMsg && (
                <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{passwordSuccessMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Active Admin Username</label>
                <input
                  type="text"
                  disabled
                  value={adminUser.username}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-800 rounded-xl text-xs font-mono text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">New Admin Password</label>
                <input
                  type="password"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Enter new master password..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-indigo-600 focus:bg-slate-900 rounded-xl text-xs font-medium outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Confirm new password..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-indigo-600 focus:bg-slate-900 rounded-xl text-xs font-medium outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Update Admin Password
              </button>
            </form>

            {/* Database Backup & Reset */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span>Data Backup & State Recovery</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download a complete JSON snapshot of all customer orders, catalog products, and configurations.
              </p>

              <button
                onClick={() => {
                  const backup = {
                    version: '2.4',
                    timestamp: Date.now(),
                    orders,
                    products,
                    storeSettings,
                  };
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
                  const dl = document.createElement('a');
                  dl.setAttribute('href', dataStr);
                  dl.setAttribute('download', `store_backup_${new Date().toISOString().slice(0, 10)}.json`);
                  dl.click();
                }}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Export Full Store Backup (JSON)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}
      {/* Order Details Drilldown */}
      <AdminOrderDetailsModal
        isOpen={!!selectedOrderForDetails}
        onClose={() => setSelectedOrderForDetails(null)}
        order={selectedOrderForDetails}
        onUpdateStatus={onUpdateOrderStatus}
        onOpenInvoice={(ord) => {
          setSelectedOrderForDetails(null);
          setSelectedOrderForInvoice(ord);
        }}
        storeSettings={storeSettings}
      />

      {/* Printable Invoice */}
      <AdminInvoiceModal
        isOpen={!!selectedOrderForInvoice}
        onClose={() => setSelectedOrderForInvoice(null)}
        order={selectedOrderForInvoice}
        storeSettings={storeSettings}
      />

      {/* Product Add / Edit Modal */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onSave={(saved) => {
          if (productToEdit) {
            onUpdateProduct(saved);
          } else {
            onAddProduct(saved);
          }
        }}
      />
    </div>
  );
};
