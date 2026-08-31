import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  ShoppingBag,
  Layers,
  Sliders,
  DollarSign,
  Package,
  CheckCircle2,
} from 'lucide-react';
import { TShirtProduct, TShirtSize } from '../../types';
import { TSHIRT_COLORS, TSHIRT_CATEGORIES, TSHIRT_SIZES } from '../../data/tshirtPresets';
import { TShirtMockupView } from '../tshirt/TShirtMockupView';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: TShirtProduct) => void;
  productToEdit?: TShirtProduct | null;
}

export const AdminProductModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
}) => {
  const isEditing = !!productToEdit;

  const [title, setTitle] = useState(productToEdit?.title || '');
  const [description, setDescription] = useState(
    productToEdit?.description || 'Heavyweight 240+ GSM 100% Combed Cotton. Streetwear drop-shoulder boxy cut.'
  );
  const [price, setPrice] = useState<number>(productToEdit?.price || 590);
  const [originalPrice, setOriginalPrice] = useState<number>(productToEdit?.originalPrice || 850);
  const [stock, setStock] = useState<number>(productToEdit?.stock || 45);
  const [category, setCategory] = useState(productToEdit?.category || 'Streetwear & Boxy');
  const [badge, setBadge] = useState(productToEdit?.badge || '🔥 Hot Drop');
  const [defaultColor, setDefaultColor] = useState(productToEdit?.defaultColor || '#18181b');
  const [selectedSizes, setSelectedSizes] = useState<TShirtSize[]>(
    productToEdit?.availableSizes || ['S', 'M', 'L', 'XL', 'XXL']
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    productToEdit?.availableColors || ['#18181b', '#0f172a', '#450a0a', '#064e3b', '#94a3b8']
  );
  const [designImage, setDesignImage] = useState<string>(productToEdit?.designImage || '');
  const [customMockupImage, setCustomMockupImage] = useState<string | undefined>(
    productToEdit?.customMockupImage
  );
  const [designScale, setDesignScale] = useState<number>(productToEdit?.designScale || 52);
  const [designPositionY, setDesignPositionY] = useState<number>(productToEdit?.designPositionY || -4);
  const [designPositionX, setDesignPositionX] = useState<number>(productToEdit?.designPositionX || 0);
  const [isPublished, setIsPublished] = useState<boolean>(productToEdit ? productToEdit.isPublished : true);

  const graphicInputRef = useRef<HTMLInputElement>(null);
  const customPhotoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleGraphicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setDesignImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomMockupImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const toggleSize = (size: TShirtSize) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (hex: string) => {
    setSelectedColors((prev) =>
      prev.includes(hex) ? prev.filter((c) => c !== hex) : [...prev, hex]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const savedProduct: TShirtProduct = {
      id: productToEdit?.id || `TSHIRT-${Date.now()}`,
      title: title.trim(),
      description,
      price: Number(price) || 490,
      originalPrice: Number(originalPrice) || 750,
      stock: Number(stock) || 0,
      category,
      badge: badge.trim() || undefined,
      defaultColor,
      availableColors: selectedColors.length > 0 ? selectedColors : [defaultColor],
      availableSizes: selectedSizes.length > 0 ? selectedSizes : ['M', 'L', 'XL'],
      designImage: designImage || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><text x="250" y="250" fill="white" font-size="30" text-anchor="middle">GRAPHIC</text></svg>',
      customMockupImage: customMockupImage || undefined,
      designScale,
      designPositionY,
      designPositionX,
      rating: productToEdit?.rating || 5.0,
      reviewsCount: productToEdit?.reviewsCount || 14,
      createdAt: productToEdit?.createdAt || Date.now(),
      isPublished,
    };

    onSave(savedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-6 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-black px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                {isEditing ? 'Edit Product & Inventory' : 'Add New T-Shirt Design to Catalog'}
              </h2>
              <p className="text-xs text-slate-400">
                Configure pricing, stock count, graphic mockup, and storefront visibility.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Grid */}
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[80vh] overflow-y-auto">
          {/* Left Preview Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
              <span className="absolute top-3 left-3 text-[10px] font-bold bg-white/10 text-white px-2 py-0.5 rounded backdrop-blur-xs z-10">
                Live Mockup Preview
              </span>

              <div className="w-full aspect-square max-w-[260px]">
                <TShirtMockupView
                  color={defaultColor}
                  designImage={designImage}
                  customMockupImage={customMockupImage}
                  designScale={designScale}
                  designPositionX={designPositionX}
                  designPositionY={designPositionY}
                />
              </div>
            </div>

            {/* Scale & Position Fine-Tuning */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3 text-xs">
              <span className="font-bold text-slate-200 block text-[11px] uppercase tracking-wider">
                Graphic Scaling & Placement
              </span>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Graphic Scale:</span>
                  <span className="font-bold font-mono">{designScale}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={designScale}
                  onChange={(e) => setDesignScale(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Vertical (Y):</span>
                    <span className="font-bold font-mono">{designPositionY}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={designPositionY}
                    onChange={(e) => setDesignPositionY(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Horizontal (X):</span>
                    <span className="font-bold font-mono">{designPositionX}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={designPositionX}
                    onChange={(e) => setDesignPositionX(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Artwork Upload Controls */}
            <div className="space-y-2">
              <input
                ref={graphicInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleGraphicUpload}
                className="hidden"
              />
              <input
                ref={customPhotoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleCustomPhotoUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => graphicInputRef.current?.click()}
                className="w-full py-2 px-3 bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload PNG Graphic Art</span>
              </button>

              <button
                type="button"
                onClick={() => customPhotoInputRef.current?.click()}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-800 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom T-Shirt Photo Template</span>
              </button>
            </div>
          </div>

          {/* Right Product Fields Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Title & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Heavyweight Cyberpunk Oversized Tee"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-indigo-600 focus:bg-slate-900 rounded-xl text-xs font-bold outline-hidden transition-all text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Badge / Tag
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. 🔥 Hot Drop"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-indigo-600 focus:bg-slate-900 rounded-xl text-xs font-medium outline-hidden transition-all text-white"
                />
              </div>
            </div>

            {/* Category & Visibility */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-indigo-600 focus:bg-slate-900 rounded-xl text-xs font-semibold outline-hidden text-white cursor-pointer"
                >
                  {TSHIRT_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Storefront Visibility
                </label>
                <div className="flex items-center gap-2 pt-1.5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-400 focus:ring-indigo-500"
                    />
                    <span>Publish live in customer store</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Pricing & Stock Numbers */}
            <div className="grid grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Sale Price (৳) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 focus:border-indigo-600 rounded-lg text-xs font-mono font-bold text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Regular Price (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 focus:border-indigo-600 rounded-lg text-xs font-mono text-slate-400 line-through outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Inventory Units *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 focus:border-indigo-600 rounded-lg text-xs font-mono font-bold text-white outline-hidden"
                />
              </div>
            </div>

            {/* Available Sizes Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Available Sizes ({selectedSizes.length} active)
              </label>
              <div className="flex items-center gap-2">
                {TSHIRT_SIZES.map((size) => {
                  const isChecked = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer border ${
                        isChecked
                          ? 'bg-black border-slate-700 text-white shadow-2xs'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Available Colors Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Available Colors & Default Base
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {TSHIRT_COLORS.slice(0, 8).map((c) => {
                  const isSelected = selectedColors.includes(c.hex);
                  const isDefault = defaultColor === c.hex;
                  return (
                    <div
                      key={c.hex}
                      className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2 py-1 rounded-lg"
                    >
                      <button
                        type="button"
                        onClick={() => toggleColor(c.hex)}
                        className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                          isSelected ? 'ring-2 ring-indigo-600 ring-offset-1' : 'opacity-40'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                      <span className="text-[10px] font-semibold text-slate-200">{c.name}</span>
                      {isSelected && (
                        <button
                          type="button"
                          onClick={() => setDefaultColor(c.hex)}
                          className={`text-[9px] px-1 rounded font-bold cursor-pointer ${
                            isDefault ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {isDefault ? 'Primary' : 'Set'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Product Description & Fabric Specs
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Fabric weight, GSM, fit specs..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-indigo-600 focus:bg-slate-900 rounded-xl text-xs font-medium outline-hidden transition-all text-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEditing ? 'Save Product Changes' : 'Publish New Product'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
