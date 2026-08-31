import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import {
  Upload,
  Sparkles,
  Sliders,
  CheckCircle2,
  Trash2,
  FileArchive,
  ShoppingBag,
  Plus,
  Send,
  Package,
  Check,
} from 'lucide-react';
import { BulkDesignDraft, TShirtProduct, TShirtSize } from '../../types';
import { TSHIRT_COLORS, TSHIRT_CATEGORIES, SAMPLE_GRAPHIC_DESIGNS } from '../../data/tshirtPresets';
import { TShirtMockupView, TShirtViewMode } from './TShirtMockupView';
import { nodeToDataUrl, triggerDownload } from '../../utils/imageExporter';

interface TShirtBulkStudioProps {
  onPublishProducts: (newProducts: TShirtProduct[]) => void;
  onNavigateToStore: () => void;
  publishedCount: number;
}

export const TShirtBulkStudio: React.FC<TShirtBulkStudioProps> = ({
  onPublishProducts,
  onNavigateToStore,
  publishedCount,
}) => {
  // Global Default Config for all uploads
  const [globalDefaults, setGlobalDefaults] = useState({
    titlePrefix: 'Oversized Streetwear Tee: ',
    description: '240+ GSM 100% pure combed heavyweight cotton fabric. Color and high-definition DTF print guaranteed. Drop-shoulder relaxed boxy fit for premium everyday style.',
    price: 550,
    originalPrice: 850,
    stock: 50,
    category: 'Streetwear & Boxy',
    color: '#18181b', // Default Black as in reference mockup
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'] as TShirtSize[],
    designScale: 54,
    designPositionY: -4,
    designPositionX: 0,
    mockupStyle: 'crewneck' as 'crewneck' | 'oversized' | 'hoodie',
  });

  // Drafts array
  const [drafts, setDrafts] = useState<BulkDesignDraft[]>(() => {
    return SAMPLE_GRAPHIC_DESIGNS.map((sample, idx) => ({
      id: `draft_sample_${idx + 1}`,
      fileName: sample.name,
      designDataUrl: sample.dataUrl,
      title: sample.title,
      description: '240+ GSM pure combed heavyweight cotton with durable high-density graphic print.',
      price: sample.price,
      originalPrice: sample.originalPrice,
      stock: 50,
      category: sample.category,
      color: '#18181b', // Default Black
      availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
      designScale: 54,
      designPositionY: -4,
      designPositionX: 0,
      mockupStyle: 'crewneck',
      isSelected: true,
    }));
  });

  const [activeEditingDraft, setActiveEditingDraft] = useState<BulkDesignDraft | null>(null);
  const [editingViewMode, setEditingViewMode] = useState<TShirtViewMode>('back');
  const [customMockupBase, setCustomMockupBase] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mockupBaseInputRef = useRef<HTMLInputElement>(null);

  // Handle Custom Base Mockup Photo Upload (e.g. user's own t-shirt photo)
  const handleBaseMockupUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCustomMockupBase(dataUrl);
      // Also apply to existing drafts if desired
      setDrafts((prev) =>
        prev.map((d) => ({
          ...d,
          customMockupImage: dataUrl,
        }))
      );
    };
    reader.readAsDataURL(file);
  };

  // Handle Multi-file Upload (PNG / JPG)
  const handleFiles = (files: FileList | File[]) => {
    const fileList = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileList.length === 0) return;

    const newDrafts: BulkDesignDraft[] = [];
    let loadedCount = 0;

    fileList.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

        newDrafts.push({
          id: `draft_${Date.now()}_${index}`,
          fileName: file.name,
          designDataUrl: dataUrl,
          title: `${globalDefaults.titlePrefix}${cleanName}`,
          description: globalDefaults.description,
          price: globalDefaults.price,
          originalPrice: globalDefaults.originalPrice,
          stock: globalDefaults.stock,
          category: globalDefaults.category,
          color: globalDefaults.color,
          availableSizes: [...globalDefaults.availableSizes],
          designScale: globalDefaults.designScale,
          designPositionY: globalDefaults.designPositionY,
          designPositionX: globalDefaults.designPositionX,
          mockupStyle: globalDefaults.mockupStyle,
          isSelected: true,
        });

        loadedCount++;
        if (loadedCount === fileList.length) {
          setDrafts((prev) => [...newDrafts, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Load sample designs
  const handleLoadSamples = () => {
    const samples: BulkDesignDraft[] = SAMPLE_GRAPHIC_DESIGNS.map((sample, idx) => ({
      id: `draft_sample_${Date.now()}_${idx}`,
      fileName: sample.name,
      designDataUrl: sample.dataUrl,
      title: sample.title,
      description: globalDefaults.description,
      price: sample.price,
      originalPrice: sample.originalPrice,
      stock: globalDefaults.stock,
      category: sample.category,
      color: globalDefaults.color,
      availableSizes: [...globalDefaults.availableSizes],
      designScale: globalDefaults.designScale,
      designPositionY: globalDefaults.designPositionY,
      designPositionX: globalDefaults.designPositionX,
      mockupStyle: globalDefaults.mockupStyle,
      isSelected: true,
    }));
    setDrafts((prev) => [...samples, ...prev]);
  };

  // Apply Defaults to All Drafts
  const handleApplyDefaultsToAll = () => {
    setDrafts((prev) =>
      prev.map((d) => ({
        ...d,
        description: globalDefaults.description,
        price: globalDefaults.price,
        originalPrice: globalDefaults.originalPrice,
        stock: globalDefaults.stock,
        category: globalDefaults.category,
        color: globalDefaults.color,
        availableSizes: [...globalDefaults.availableSizes],
        designScale: globalDefaults.designScale,
        designPositionY: globalDefaults.designPositionY,
        designPositionX: globalDefaults.designPositionX,
        mockupStyle: globalDefaults.mockupStyle,
      }))
    );
  };

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isSelected: !d.isSelected } : d))
    );
  };

  const handleSelectAll = (select: boolean) => {
    setDrafts((prev) => prev.map((d) => ({ ...d, isSelected: select })));
  };

  // Update specific draft property
  const handleUpdateDraft = (id: string, updates: Partial<BulkDesignDraft>) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    if (activeEditingDraft && activeEditingDraft.id === id) {
      setActiveEditingDraft((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  // Remove draft
  const handleDeleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    if (activeEditingDraft?.id === id) setActiveEditingDraft(null);
  };

  // Publish Selected to Storefront
  const handlePublish = (onlySelected: boolean = true) => {
    const toPublish = drafts.filter((d) => (!onlySelected || d.isSelected));
    if (toPublish.length === 0) {
      alert('Please select at least one t-shirt draft to publish.');
      return;
    }

    const newProducts: TShirtProduct[] = toPublish.map((draft, idx) => ({
      id: `prod_${Date.now()}_${idx}`,
      title: draft.title || 'Premium Oversized Graphic Tee',
      description: draft.description || globalDefaults.description,
      price: Number(draft.price) || 550,
      originalPrice: Number(draft.originalPrice) || 850,
      stock: Number(draft.stock) || 50,
      category: draft.category || 'Streetwear & Boxy',
      tags: [draft.category, 'T-Shirt', 'Graphic Tee', 'Drop Shoulder'],
      designImage: draft.designDataUrl,
      designScale: draft.designScale,
      designPositionY: draft.designPositionY,
      designPositionX: draft.designPositionX,
      designBlendMode: 'normal',
      defaultColor: draft.color,
      availableColors: [draft.color, '#18181b', '#0f172a', '#450a0a', '#064e3b', '#94a3b8'],
      availableSizes: draft.availableSizes.length > 0 ? draft.availableSizes : ['S', 'M', 'L', 'XL', 'XXL'],
      mockupStyle: draft.mockupStyle,
      customMockupImage: draft.customMockupImage || customMockupBase || undefined,
      rating: 5.0,
      reviewsCount: Math.floor(Math.random() * 30) + 12,
      badge: idx % 2 === 0 ? '🔥 Hot Drop' : '★ New Arrival',
      createdAt: Date.now(),
      isPublished: true,
    }));

    onPublishProducts(newProducts);
    setPublishSuccessMsg(`🎉 Successfully published ${newProducts.length} t-shirt(s) to the storefront! Customers can now order them.`);

    // Remove published drafts
    setDrafts((prev) => prev.filter((d) => onlySelected ? !d.isSelected : false));

    setTimeout(() => {
      setPublishSuccessMsg(null);
    }, 6000);
  };

  // Download all mockups as ZIP
  const handleDownloadAllZip = async () => {
    if (drafts.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      for (let i = 0; i < drafts.length; i++) {
        const draft = drafts[i];
        const elem = document.getElementById(`draft-mockup-${draft.id}`);
        if (elem) {
          const dataUrl = await nodeToDataUrl(elem, { pixelRatio: 2 });
          const base64Data = dataUrl.split(',')[1];
          const safeName = (draft.title || `tshirt_${i + 1}`).replace(/[^a-zA-Z0-9_-]/g, '_');
          zip.file(`${i + 1}_${safeName}.png`, base64Data, { base64: true });
        }
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(blob, `TShirt_Mockups_Bulk_${Date.now()}.zip`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate mockup ZIP file.');
    } finally {
      setIsZipping(false);
    }
  };

  const selectedCount = drafts.filter((d) => d.isSelected).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Navigation */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Admin Bulk Mockup Generator & Auto-Publisher</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Bulk T-Shirt Design Studio & Publisher
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Upload multiple transparent PNG design files from your local storage. High-resolution 3D oversized streetwear mockups are instantly generated and ready to list on your storefront with a single click.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToStore}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Storefront ({publishedCount} listed)</span>
            </button>

            <button
              onClick={handleLoadSamples}
              className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Load Sample Designs</span>
            </button>
          </div>
        </div>

        {/* Background glow decoration */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Success Notification Alert */}
      {publishSuccessMsg && (
        <div className="p-4 bg-emerald-950 border border-emerald-800 rounded-xl flex items-center justify-between gap-4 text-emerald-300 text-xs sm:text-sm font-semibold shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{publishSuccessMsg}</span>
          </div>
          <button
            onClick={onNavigateToStore}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shrink-0 cursor-pointer"
          >
            Go to Store
          </button>
        </div>
      )}

      {/* Main Grid: Upload & Global Settings on Left, Drafts Grid on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Box + Global Defaults Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Drag & Drop Bulk Uploader */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 bg-slate-900 shadow-xs ${
              isDragOver
                ? 'border-indigo-500 bg-indigo-950/50 scale-[1.01]'
                : 'border-slate-700 hover:border-indigo-400 hover:bg-slate-950/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-950 border border-indigo-900 flex items-center justify-center text-indigo-400 mb-4 shadow-xs">
              <Upload className="w-7 h-7 animate-bounce" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 mb-1">
              Drop Local PNG Designs or Click to Browse
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Select multiple transparent PNG files to automatically generate mockups
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs">
              <Plus className="w-4 h-4" />
              <span>Browse Local Files</span>
            </div>
          </div>

          {/* Custom Base Mockup Photo Template Uploader */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  T-Shirt Base Mockup Template
                </h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                customMockupBase ? 'bg-indigo-900 text-indigo-400' : 'bg-slate-800 text-slate-300'
              }`}>
                {customMockupBase ? 'Custom Photo Active' : '3D Realistic Studio Mode'}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your own real photoshoot or custom T-shirt photo (PNG/JPG) to use as the base mockup for all designs.
            </p>

            <input
              ref={mockupBaseInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleBaseMockupUpload}
              className="hidden"
            />

            {customMockupBase ? (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={customMockupBase}
                    alt="Active Custom Base Mockup"
                    className="w-14 h-14 object-contain rounded-lg bg-slate-900 border border-slate-800"
                  />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <span className="text-xs font-bold text-slate-100 block truncate">
                      Custom T-Shirt Photo Template
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Applied to all designs
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => mockupBaseInputRef.current?.click()}
                    className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Change Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomMockupBase(null);
                      setDrafts((prev) => prev.map((d) => ({ ...d, customMockupImage: undefined })));
                    }}
                    className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-400 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => mockupBaseInputRef.current?.click()}
                className="w-full py-2.5 px-4 bg-slate-950 hover:bg-indigo-950 border-2 border-dashed border-slate-700 hover:border-indigo-400 text-slate-200 hover:text-indigo-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Custom T-Shirt Photo Template</span>
              </button>
            )}
          </div>

          {/* Global Default Presets Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  Global Defaults (Applied to All)
                </h3>
              </div>
              <button
                type="button"
                onClick={handleApplyDefaultsToAll}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-950 hover:bg-indigo-900 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="Apply settings across all drafts"
              >
                Apply to All ({drafts.length})
              </button>
            </div>

            {/* Default Color Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200 flex items-center justify-between">
                <span>Default T-Shirt Color (Jet Black):</span>
                <span className="font-mono text-[11px] text-slate-400">{globalDefaults.color}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {TSHIRT_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setGlobalDefaults({ ...globalDefaults, color: c.hex })}
                    className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                      globalDefaults.color === c.hex
                        ? 'border-indigo-600 scale-110 shadow-sm ring-2 ring-indigo-800'
                        : 'border-slate-700 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {globalDefaults.color === c.hex && (
                      <Check className={`w-3.5 h-3.5 ${c.textColor === 'light' ? 'text-white' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Pricing & Stock */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-200 mb-1">
                  Sale Price (৳)
                </label>
                <input
                  type="number"
                  value={globalDefaults.price}
                  onChange={(e) => setGlobalDefaults({ ...globalDefaults, price: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-bold text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-200 mb-1">
                  Regular (৳)
                </label>
                <input
                  type="number"
                  value={globalDefaults.originalPrice}
                  onChange={(e) => setGlobalDefaults({ ...globalDefaults, originalPrice: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-bold text-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-200 mb-1">
                  Default Stock
                </label>
                <input
                  type="number"
                  value={globalDefaults.stock}
                  onChange={(e) => setGlobalDefaults({ ...globalDefaults, stock: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-bold text-white"
                />
              </div>
            </div>

            {/* Default Category */}
            <div>
              <label className="block text-[11px] font-bold text-slate-200 mb-1">
                Default Category
              </label>
              <select
                value={globalDefaults.category}
                onChange={(e) => setGlobalDefaults({ ...globalDefaults, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-semibold text-white"
              >
                {TSHIRT_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Default Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-200 mb-1">
                Default Description
              </label>
              <textarea
                value={globalDefaults.description}
                onChange={(e) => setGlobalDefaults({ ...globalDefaults, description: e.target.value })}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 leading-relaxed"
              />
            </div>

            {/* Default Print Scale & Position */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span>Graphic Print Scale:</span>
                <span>{globalDefaults.designScale}%</span>
              </div>
              <input
                type="range"
                min="25"
                max="85"
                value={globalDefaults.designScale}
                onChange={(e) => setGlobalDefaults({ ...globalDefaults, designScale: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span>Vertical Position (Y Offset):</span>
                <span>{globalDefaults.designPositionY}px</span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                value={globalDefaults.designPositionY}
                onChange={(e) => setGlobalDefaults({ ...globalDefaults, designPositionY: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Drafts Grid & Actions Bar */}
        <div className="lg:col-span-7 space-y-4">
          {/* Header Action Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-100">
                <input
                  type="checkbox"
                  checked={drafts.length > 0 && drafts.every((d) => d.isSelected)}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-indigo-400 rounded border-slate-700 focus:ring-indigo-500 cursor-pointer"
                />
                <span>Select All ({selectedCount}/{drafts.length})</span>
              </label>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleDownloadAllZip}
                disabled={isZipping || drafts.length === 0}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <FileArchive className="w-4 h-4 text-indigo-400" />
                <span>{isZipping ? 'Generating ZIP...' : 'Download All Mockups (ZIP)'}</span>
              </button>

              <button
                onClick={() => handlePublish(true)}
                disabled={selectedCount === 0}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Publish Selected to Store ({selectedCount})</span>
              </button>
            </div>
          </div>

          {/* Drafts List / Grid */}
          {drafts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                <Package className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-100">No Drafts Uploaded</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Drag and drop PNG graphic files or click "Load Sample Designs" to test immediately.
                </p>
              </div>
              <button
                onClick={handleLoadSamples}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Load Sample Designs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className={`bg-slate-900 border rounded-2xl p-3.5 transition-all duration-200 shadow-xs space-y-3 relative group ${
                    draft.isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-900'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Header: Checkbox + Action Buttons */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draft.isSelected}
                        onChange={() => handleToggleSelect(draft.id)}
                        className="w-4 h-4 text-indigo-400 rounded border-slate-700 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className="text-[11px] font-bold text-slate-300 truncate max-w-[140px]">
                        {draft.fileName}
                      </span>
                    </label>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setActiveEditingDraft(draft);
                          setEditingViewMode('front');
                        }}
                        className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-indigo-400 rounded-lg cursor-pointer transition-colors"
                        title="Customize Mockup"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="p-1.5 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg cursor-pointer transition-colors"
                        title="Delete Draft"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Rendered Mockup Preview */}
                  <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <TShirtMockupView
                      id={`draft-mockup-${draft.id}`}
                      color={draft.color}
                      designImage={draft.designDataUrl}
                      customMockupImage={draft.customMockupImage || customMockupBase || undefined}
                      designScale={draft.designScale}
                      designPositionX={draft.designPositionX}
                      designPositionY={draft.designPositionY}
                      mockupStyle={draft.mockupStyle}
                      showViewToggle={true}
                    />

                    {/* Color Swatch Dots on Mockup */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-slate-900/90 backdrop-blur-xs p-1 rounded-full border border-slate-800/80 shadow-xs">
                      {TSHIRT_COLORS.slice(0, 5).map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => handleUpdateDraft(draft.id, { color: c.hex })}
                          className={`w-4 h-4 rounded-full border cursor-pointer ${
                            draft.color === c.hex ? 'border-indigo-600 ring-1 ring-indigo-400' : 'border-slate-700'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Inline Metadata Form */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <input
                        type="text"
                        value={draft.title}
                        onChange={(e) => handleUpdateDraft(draft.id, { title: e.target.value })}
                        placeholder="Product title..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-bold text-white focus:outline-none focus:border-indigo-600 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
                        <span className="text-[11px] font-bold text-slate-400">৳</span>
                        <input
                          type="number"
                          value={draft.price}
                          onChange={(e) => handleUpdateDraft(draft.id, { price: Number(e.target.value) })}
                          className="w-full bg-transparent font-bold text-white focus:outline-none text-xs"
                        />
                      </div>

                      <select
                        value={draft.category}
                        onChange={(e) => handleUpdateDraft(draft.id, { category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-200 focus:outline-none"
                      >
                        {TSHIRT_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Single Publish Action */}
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateDraft(draft.id, { isSelected: true });
                      handlePublish(true);
                    }}
                    className="w-full py-2 bg-black hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish to Store</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Single Item Fine-Tuning Modal */}
      {activeEditingDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">
                  Fine-Tune Mockup Placement & Color
                </h3>
              </div>
              <button
                onClick={() => setActiveEditingDraft(null)}
                className="p-1 text-slate-400 hover:text-slate-300 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Live Mockup View */}
              <div className="bg-slate-950 rounded-xl p-2 border border-slate-800">
                <TShirtMockupView
                  color={activeEditingDraft.color}
                  designImage={activeEditingDraft.designDataUrl}
                  customMockupImage={activeEditingDraft.customMockupImage || customMockupBase || undefined}
                  designScale={activeEditingDraft.designScale}
                  designPositionX={activeEditingDraft.designPositionX}
                  designPositionY={activeEditingDraft.designPositionY}
                  mockupStyle={activeEditingDraft.mockupStyle}
                  viewMode={editingViewMode}
                  onToggleViewMode={setEditingViewMode}
                  showViewToggle={true}
                  showPrintAreaGuide={true}
                />
              </div>

              {/* Controls */}
              <div className="space-y-4">
                {/* Color Palette */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-200">T-Shirt Color:</label>
                  <div className="flex flex-wrap gap-2">
                    {TSHIRT_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => handleUpdateDraft(activeEditingDraft.id, { color: c.hex })}
                        className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-all ${
                          activeEditingDraft.color === c.hex ? 'border-indigo-600 ring-2 ring-indigo-800 scale-110' : 'border-slate-700'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Print Scale */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-200">
                    <span>Graphic Scale:</span>
                    <span>{activeEditingDraft.designScale}%</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="90"
                    value={activeEditingDraft.designScale}
                    onChange={(e) => handleUpdateDraft(activeEditingDraft.id, { designScale: Number(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* Vertical Position */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-200">
                    <span>Vertical Position (Y):</span>
                    <span>{activeEditingDraft.designPositionY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    value={activeEditingDraft.designPositionY}
                    onChange={(e) => handleUpdateDraft(activeEditingDraft.id, { designPositionY: Number(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* Horizontal Position */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-200">
                    <span>Horizontal Position (X):</span>
                    <span>{activeEditingDraft.designPositionX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    value={activeEditingDraft.designPositionX}
                    onChange={(e) => handleUpdateDraft(activeEditingDraft.id, { designPositionX: Number(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <button
                  onClick={() => setActiveEditingDraft(null)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Save & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
