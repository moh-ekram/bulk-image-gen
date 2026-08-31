import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Heart,
  Star,
  Search,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Plus,
  Minus,
  Zap,
  Info,
  Sparkles,
} from 'lucide-react';
import { TShirtProduct, TShirtSize } from '../../types';
import { TSHIRT_COLORS, TSHIRT_CATEGORIES, SIZE_CHART } from '../../data/tshirtPresets';
import { TShirtMockupView, TShirtViewMode } from './TShirtMockupView';

interface TShirtStorefrontProps {
  products: TShirtProduct[];
  onAddToCart: (product: TShirtProduct, size: TShirtSize, color: string, quantity: number) => void;
  onDirectCheckout: (product: TShirtProduct, size: TShirtSize, color: string, quantity: number) => void;
  onOpenStudio: () => void;
}

export const TShirtStorefront: React.FC<TShirtStorefrontProps> = ({
  products,
  onAddToCart,
  onDirectCheckout,
  onOpenStudio,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [previewProduct, setPreviewProduct] = useState<TShirtProduct | null>(null);
  const [modalColor, setModalColor] = useState<string>('#18181b');
  const [modalSize, setModalSize] = useState<TShirtSize>('L');
  const [modalQty, setModalQty] = useState<number>(1);
  const [modalViewMode, setModalViewMode] = useState<TShirtViewMode>('front');
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [activeCardColors, setActiveCardColors] = useState<Record<string, string>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.isPublished) return false;
        const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.createdAt - a.createdAt;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleOpenDetailModal = (product: TShirtProduct) => {
    setPreviewProduct(product);
    setModalColor(activeCardColors[product.id] || product.defaultColor || '#18181b');
    setModalSize(product.availableSizes[0] || 'L');
    setModalQty(1);
    setModalViewMode('front');
  };

  const handleAddToCartWithToast = (product: TShirtProduct, size: TShirtSize, color: string, qty: number) => {
    onAddToCart(product, size, color, qty);
    setToastMsg(`"${product.title.slice(0, 24)}..." added to cart!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Hero E-Commerce Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>240+ GSM Heavyweight Combed Cotton • Streetwear Drop Shoulder Cut</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Premium Oversized Graphic Tee Collection
          </h1>

          <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-normal">
            Ultra-soft, heavyweight combed cotton with high-density durable prints. Choose your custom shade, select your size, and enjoy fast doorstep delivery.
          </p>

          {/* Quick Perks */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] sm:text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              <Truck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Fast Doorstep Delivery</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Cotton & Print Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>7-Day Easy Exchange</span>
            </div>
          </div>
        </div>

        {/* Floating Mockup Preview on Banner Right */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-72 h-72 pointer-events-none drop-shadow-2xl">
          {products[0] && (
            <TShirtMockupView
              color="#18181b"
              designImage={products[0].designImage}
              designScale={54}
              className="scale-110 rotate-3"
            />
          )}
        </div>
      </div>

      {/* Category Pills & Search / Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {TSHIRT_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-black text-white shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search & Sort Bar */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search t-shirts & designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-600 shadow-2xs"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none shadow-2xs cursor-pointer"
            >
              <option value="featured">Featured Drops</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Customer Rating</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Found {filteredProducts.length} premium design{filteredProducts.length !== 1 ? 's' : ''}</span>
          {products.length === 0 && (
            <button
              onClick={onOpenStudio}
              className="text-indigo-400 hover:underline font-bold"
            >
              Upload PNG designs from Admin Studio
            </button>
          )}
        </div>
      </div>

      {/* Product Showcase Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-white">No Products Found</h3>
            <p className="text-xs text-slate-400">
              Try resetting your search query or upload fresh PNG designs in the Bulk Mockup Studio.
            </p>
          </div>
          <button
            onClick={onOpenStudio}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            Go to Bulk Mockup Studio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const currentColor = activeCardColors[product.id] || product.defaultColor || '#18181b';

            return (
              <div
                key={product.id}
                className="bg-slate-900 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Mockup Card Header & Interactive Image */}
                <div className="relative bg-slate-950 p-2 overflow-hidden">
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-black/90 backdrop-blur-xs text-white text-[10px] font-bold rounded-lg shadow-xs">
                      {product.badge}
                    </span>
                  )}

                  {/* Interactive 3D Oversized Mockup */}
                  <div
                    onClick={() => handleOpenDetailModal(product)}
                    className="cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
                  >
                    <TShirtMockupView
                      color={currentColor}
                      designImage={product.designImage}
                      customMockupImage={product.customMockupImage}
                      designScale={product.designScale}
                      designPositionX={product.designPositionX}
                      designPositionY={product.designPositionY}
                      mockupStyle={product.mockupStyle}
                      showViewToggle={true}
                    />
                  </div>

                  {/* Quick Color Swatch Preview Dots on Bottom of Card */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-800/80 shadow-xs">
                    <div className="flex items-center gap-1.5">
                      {product.availableColors.slice(0, 5).map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCardColors((prev) => ({ ...prev, [product.id]: hex }));
                          }}
                          className={`w-4 h-4 rounded-full border cursor-pointer transition-transform ${
                            currentColor === hex ? 'border-indigo-600 scale-125 ring-1 ring-indigo-300' : 'border-slate-700 hover:scale-110'
                          }`}
                          style={{ backgroundColor: hex }}
                          title={`Color: ${hex}`}
                        />
                      ))}
                    </div>

                    <span className="text-[10px] font-bold text-slate-400">
                      {product.availableColors.length} Shades
                    </span>
                  </div>
                </div>

                {/* Card Content & Order CTA */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-indigo-400">{product.category}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{product.rating.toFixed(1)}</span>
                        <span className="text-slate-400">({product.reviewsCount})</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => handleOpenDetailModal(product)}
                      className="font-bold text-white text-sm leading-snug line-clamp-2 hover:text-indigo-400 cursor-pointer transition-colors"
                    >
                      {product.title}
                    </h3>
                  </div>

                  {/* Pricing and Quick Order Buttons */}
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-extrabold text-white">
                          ৳{product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-slate-400 line-through">
                            ৳{product.originalPrice}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                        In Stock ({product.stock})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCartWithToast(product, product.availableSizes[0] || 'L', currentColor, 1)}
                        className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDirectCheckout(product, product.availableSizes[0] || 'L', currentColor, 1)}
                        className="py-2 px-2.5 bg-black hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Buy Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 relative my-8">
            <button
              onClick={() => setPreviewProduct(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Big Interactive Mockup View with Front/Back Toggle */}
              <div className="bg-slate-950 rounded-2xl p-2 border border-slate-800 relative">
                <TShirtMockupView
                  color={modalColor}
                  designImage={previewProduct.designImage}
                  customMockupImage={previewProduct.customMockupImage}
                  designScale={previewProduct.designScale}
                  designPositionX={previewProduct.designPositionX}
                  designPositionY={previewProduct.designPositionY}
                  mockupStyle={previewProduct.mockupStyle}
                  viewMode={modalViewMode}
                  onToggleViewMode={setModalViewMode}
                  showViewToggle={true}
                />
                <div className="text-center pt-2 pb-1 text-[11px] font-bold text-slate-400">
                  Streetwear 3D Boxy Cut • Click Front / Back to Preview
                </div>
              </div>

              {/* Product Specifications & Order Form */}
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded-md">
                    {previewProduct.category}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
                    {previewProduct.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="ml-1">{previewProduct.rating.toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <span>{previewProduct.reviewsCount} reviews</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">In Stock ({previewProduct.stock} pcs)</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-2xl font-black text-white">
                    ৳{previewProduct.price}
                  </span>
                  {previewProduct.originalPrice > previewProduct.price && (
                    <span className="text-sm text-slate-400 line-through">
                      ৳{previewProduct.originalPrice}
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-900/70 px-2 py-0.5 rounded ml-auto">
                    Cash on Delivery
                  </span>
                </div>

                {/* Color Selection Palette */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-100">
                    Select Fabric Color:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TSHIRT_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setModalColor(c.hex)}
                        className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center ${
                          modalColor === c.hex
                            ? 'border-indigo-600 scale-110 shadow-sm ring-2 ring-indigo-800'
                            : 'border-slate-700 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selection & Size Guide */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-100">Select Size:</label>
                    <button
                      type="button"
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className="text-[11px] font-bold text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3 h-3" />
                      <span>Size Guide Chart</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {previewProduct.availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setModalSize(size)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          modalSize === size
                            ? 'bg-black text-white shadow-xs'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* Size Guide Table Toggle */}
                  {showSizeGuide && (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] space-y-2 animate-in fade-in">
                      <div className="font-bold text-slate-100">Measurement Chart (Inches):</div>
                      <div className="grid grid-cols-4 gap-1 text-slate-300 font-mono text-center">
                        <div className="font-bold bg-slate-700 py-1 rounded">Size</div>
                        <div className="font-bold bg-slate-700 py-1 rounded">Chest</div>
                        <div className="font-bold bg-slate-700 py-1 rounded">Length</div>
                        <div className="font-bold bg-slate-700 py-1 rounded">Sleeve</div>
                        {SIZE_CHART.map((sc) => (
                          <React.Fragment key={sc.size}>
                            <div className="font-bold bg-slate-900 py-1">{sc.size}</div>
                            <div className="bg-slate-900 py-1">{sc.chest}</div>
                            <div className="bg-slate-900 py-1">{sc.length}</div>
                            <div className="bg-slate-900 py-1">{sc.sleeve}</div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-100">Quantity:</span>
                  <div className="flex items-center border border-slate-700 rounded-xl overflow-hidden bg-slate-950">
                    <button
                      type="button"
                      onClick={() => setModalQty((prev) => Math.max(1, prev - 1))}
                      className="p-2 hover:bg-slate-700 text-slate-200 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 font-bold text-xs text-white">{modalQty}</span>
                    <button
                      type="button"
                      onClick={() => setModalQty((prev) => prev + 1)}
                      className="p-2 hover:bg-slate-700 text-slate-200 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCartWithToast(previewProduct, modalSize, modalColor, modalQty);
                      setPreviewProduct(null);
                    }}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <ShoppingBag className="w-4 h-4 text-indigo-400" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onDirectCheckout(previewProduct, modalSize, modalColor, modalQty);
                      setPreviewProduct(null);
                    }}
                    className="py-3 px-4 bg-black hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
