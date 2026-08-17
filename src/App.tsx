import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Palette,
  ListFilter,
  Sparkles,
  ShoppingBag,
  HelpCircle,
  Package,
} from 'lucide-react';
import {
  McqItem,
  DesignConfig,
  FacebookPageConfig,
  TShirtProduct,
  CartItem,
  CustomerOrder,
  TShirtSize,
} from './types';
import { SAMPLE_MCQS } from './data/sampleMcqs';
import { INITIAL_PUBLISHED_PRODUCTS } from './data/tshirtPresets';
import { Navbar, AppMainSection } from './components/Navbar';
import { ExcelUploader } from './components/ExcelUploader';
import { TemplateCustomizer } from './components/TemplateCustomizer';
import { McqTableEditor } from './components/McqTableEditor';
import { SinglePreviewCard } from './components/SinglePreviewCard';
import { BulkGeneratorModal } from './components/BulkGeneratorModal';
import { FacebookSettingsModal } from './components/FacebookSettingsModal';
import { FacebookPublisherModal } from './components/FacebookPublisherModal';

// T-Shirt Components
import { TShirtStorefront } from './components/tshirt/TShirtStorefront';
import { TShirtBulkStudio } from './components/tshirt/TShirtBulkStudio';
import { TShirtCartDrawer } from './components/tshirt/TShirtCartDrawer';
import { TShirtCheckoutModal } from './components/tshirt/TShirtCheckoutModal';
import { TShirtOrdersModal } from './components/tshirt/TShirtOrdersModal';

export default function App() {
  // Top-level Navigation Mode: 'tshirt_store' | 'tshirt_studio' | 'mcq_studio'
  const [activeSection, setActiveSection] = useState<AppMainSection>('tshirt_store');

  // ================= T-SHIRT STATE =================
  const [products, setProducts] = useState<TShirtProduct[]>(() => {
    try {
      const saved = localStorage.getItem('tshirt_published_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PUBLISHED_PRODUCTS;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tshirt_cart_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem('tshirt_customer_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'ORD-894102',
        customerName: 'সাকিব হাসান',
        phone: '01712345678',
        address: 'বাড়ি ১২, রোড ৪, সেক্টর ৭, উত্তরা, ঢাকা',
        district: 'ঢাকা সিটি (Inside Dhaka)',
        deliveryFee: 60,
        paymentMethod: 'cod',
        specialNotes: 'বিকেলে ডেলিভারি দিলে ভালো হয়।',
        items: [
          {
            id: 'cart_demo_1',
            product: INITIAL_PUBLISHED_PRODUCTS[0],
            selectedSize: 'L',
            selectedColor: '#18181b',
            quantity: 1,
          },
        ],
        subtotal: 490,
        total: 550,
        status: 'Confirmed',
        createdAt: Date.now() - 1000 * 60 * 60 * 5,
      },
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Sync T-Shirt data with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('tshirt_published_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('tshirt_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('tshirt_customer_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Cart actions
  const handleAddToCart = (
    product: TShirtProduct,
    selectedSize: TShirtSize,
    selectedColor: string,
    quantity: number = 1
  ) => {
    const cartItemId = `${product.id}_${selectedSize}_${selectedColor}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: cartItemId, product, selectedSize, selectedColor, quantity }];
    });
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === cartItemId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleDirectCheckout = (
    product: TShirtProduct,
    selectedSize: TShirtSize,
    selectedColor: string,
    quantity: number = 1
  ) => {
    handleAddToCart(product, selectedSize, selectedColor, quantity);
    setIsCheckoutOpen(true);
  };

  const handlePublishProducts = (newProducts: TShirtProduct[]) => {
    setProducts((prev) => [...newProducts, ...prev]);
  };

  const handleOrderPlaced = (order: CustomerOrder) => {
    setOrders((prev) => [order, ...prev]);
    setCartItems([]); // clear cart
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: CustomerOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // ================= MCQ STUDIO STATE =================
  const [mcqs, setMcqs] = useState<McqItem[]>(SAMPLE_MCQS);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'uploader' | 'customizer' | 'editor'>('customizer');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);

  // Facebook Integration state
  const [facebookConfig, setFacebookConfig] = useState<FacebookPageConfig>(() => {
    try {
      const saved = localStorage.getItem('mcq_facebook_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      pageId: '',
      pageAccessToken: '',
      isConnected: false,
    };
  });

  const [isFbSettingsOpen, setIsFbSettingsOpen] = useState<boolean>(false);
  const [fbPostTarget, setFbPostTarget] = useState<{ mcq: McqItem; imageDataUrl: string } | null>(null);

  const handleSaveFbConfig = (newCfg: FacebookPageConfig) => {
    setFacebookConfig(newCfg);
    try {
      localStorage.setItem('mcq_facebook_config', JSON.stringify(newCfg));
    } catch (e) {
      console.error(e);
    }
  };

  const [designConfig, setDesignConfig] = useState<DesignConfig>({
    templateId: 'playful_quiz',
    aspectRatio: '1:1',
    headerText: 'Quiz Time!',
    footerText: 'Comment your answer',
    fontFamily: 'Hind Siliguri',
    primaryColor: '#fdbd58',
    backgroundColor: '#647cf6',
    cardBgColor: '#fffdf0',
    textColor: '#0f172a',
    highlightCorrect: false,
    correctBadgeColor: '#22c55e',
    watermarkText: 'MCQ Image Studio',
    watermarkOpacity: 0.8,
    watermarkPosition: 'bottom',
    titleFontSize: 26,
    questionFontSize: 18,
    optionsFontSize: 16,
    showReactionsBar: true,
    showDecorativeBorder: true,
    borderWidth: 1,
    cardCornerRadius: 'md',
    cardPadding: 'normal',
    badgeStyle: 'badge',
    questionPrefix: 'Question:',
    showCategoryTag: true,
  });

  const handleMcqsLoaded = (loadedMcqs: McqItem[]) => {
    setMcqs(loadedMcqs);
    setSelectedIndex(0);
    setActiveTab('customizer');
  };

  const handleResetSample = () => {
    setMcqs(SAMPLE_MCQS);
    setSelectedIndex(0);
  };

  const currentMcq = mcqs[selectedIndex] || mcqs[0];
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Navbar */}
      <Navbar
        activeSection={activeSection}
        onSelectSection={(sec) => setActiveSection(sec)}
        mcqCount={mcqs.length}
        onOpenBulkModal={() => setIsBulkModalOpen(true)}
        onResetSampleMcqs={handleResetSample}
        facebookConfig={facebookConfig}
        onOpenFacebookSettings={() => setIsFbSettingsOpen(true)}
        cartItemsCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        ordersCount={orders.length}
        publishedProductsCount={products.filter((p) => p.isPublished).length}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* SECTION 1: T-SHIRT CUSTOMER STOREFRONT */}
        {activeSection === 'tshirt_store' && (
          <TShirtStorefront
            products={products}
            onAddToCart={handleAddToCart}
            onDirectCheckout={handleDirectCheckout}
            onOpenStudio={() => setActiveSection('tshirt_studio')}
          />
        )}

        {/* SECTION 2: T-SHIRT BULK MOCKUP STUDIO (ADMIN) */}
        {activeSection === 'tshirt_studio' && (
          <TShirtBulkStudio
            onPublishProducts={handlePublishProducts}
            onNavigateToStore={() => setActiveSection('tshirt_store')}
            publishedCount={products.filter((p) => p.isPublished).length}
          />
        )}

        {/* SECTION 3: MCQ QUIZ IMAGE GENERATOR */}
        {activeSection === 'mcq_studio' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Feature Welcome / Instruction Strip */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    MCQ Canvas Studio & Social Media Auto-Poster
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Upload Excel spreadsheets or edit MCQs directly to generate high-resolution social media posters and post to Facebook.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Bulk Export All {mcqs.length} Images</span>
              </button>
            </div>

            {/* Workspace Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Tools & Config (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Tab Switching Navigation */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 border border-slate-200 rounded-xl">
                  <button
                    onClick={() => setActiveTab('customizer')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeTab === 'customizer'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Palette className="w-4 h-4" />
                    <span>1. Design & Templates</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('uploader')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeTab === 'uploader'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>2. Upload Excel</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeTab === 'editor'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <ListFilter className="w-4 h-4" />
                    <span>3. MCQ Questions ({mcqs.length})</span>
                  </button>
                </div>

                {/* Active Tab View */}
                <div className="transition-all duration-200">
                  {activeTab === 'customizer' && (
                    <TemplateCustomizer
                      config={designConfig}
                      onChange={(updated) => setDesignConfig(updated)}
                    />
                  )}

                  {activeTab === 'uploader' && (
                    <ExcelUploader onMcqsLoaded={handleMcqsLoaded} />
                  )}

                  {activeTab === 'editor' && (
                    <McqTableEditor
                      mcqs={mcqs}
                      onUpdateMcqs={(updated) => setMcqs(updated)}
                      selectedIndex={selectedIndex}
                      onSelectIndex={(idx) => setSelectedIndex(idx)}
                    />
                  )}
                </div>
              </div>

              {/* Right Column: Live Card Preview & Quick Download (5 cols) */}
              <div className="lg:col-span-5 sticky top-20">
                {currentMcq ? (
                  <SinglePreviewCard
                    mcq={currentMcq}
                    config={designConfig}
                    currentIndex={selectedIndex}
                    totalCount={mcqs.length}
                    onPrev={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
                    onNext={() => setSelectedIndex((prev) => Math.min(mcqs.length - 1, prev + 1))}
                    onOpenFacebookPost={(item, imgUrl) => setFbPostTarget({ mcq: item, imageDataUrl: imgUrl })}
                  />
                ) : (
                  <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500 shadow-xs">
                    <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm font-semibold">No MCQ questions loaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-4 sm:px-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">T-Shirt E-Commerce & MCQ Canvas Studio</span>
          <span>•</span>
          <span>Bulk Mockup & Ordering Engine</span>
        </div>
        <div className="text-[11px] text-slate-400">
          3D Cotton Mockups • Cash on Delivery Store • Facebook Auto-Poster
        </div>
      </footer>

      {/* ================= MODALS & DRAWERS ================= */}

      {/* T-Shirt Cart Slide-over Drawer */}
      <TShirtCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* T-Shirt Checkout Modal */}
      <TShirtCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Admin Orders Dashboard Modal */}
      <TShirtOrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      {/* MCQ Bulk Generator Modal */}
      <BulkGeneratorModal
        mcqs={mcqs}
        config={designConfig}
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        facebookConfig={facebookConfig}
        onOpenFacebookSettings={() => setIsFbSettingsOpen(true)}
      />

      {/* Facebook Page Settings Modal */}
      <FacebookSettingsModal
        isOpen={isFbSettingsOpen}
        onClose={() => setIsFbSettingsOpen(false)}
        config={facebookConfig}
        onSaveConfig={handleSaveFbConfig}
      />

      {/* Facebook Single Publisher Modal */}
      {fbPostTarget && (
        <FacebookPublisherModal
          isOpen={!!fbPostTarget}
          onClose={() => setFbPostTarget(null)}
          mcq={fbPostTarget.mcq}
          imageDataUrl={fbPostTarget.imageDataUrl}
          facebookConfig={facebookConfig}
          onOpenSettings={() => {
            setFbPostTarget(null);
            setIsFbSettingsOpen(true);
          }}
        />
      )}
    </div>
  );
}
