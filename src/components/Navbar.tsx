import React from 'react';
import {
  Layers,
  Sparkles,
  ShoppingBag,
  Palette,
  Package,
  ShoppingCart,
  FileSpreadsheet,
  Facebook,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { downloadSampleExcel } from '../data/sampleMcqs';
import { FacebookPageConfig, CartItem } from '../types';

export type AppMainSection = 'tshirt_store' | 'tshirt_studio' | 'mcq_studio';

interface Props {
  activeSection: AppMainSection;
  onSelectSection: (section: AppMainSection) => void;
  // MCQ Props
  mcqCount: number;
  onOpenBulkModal: () => void;
  onResetSampleMcqs: () => void;
  facebookConfig?: FacebookPageConfig;
  onOpenFacebookSettings?: () => void;
  // T-Shirt Props
  cartItemsCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  ordersCount: number;
  publishedProductsCount: number;
}

export const Navbar: React.FC<Props> = ({
  activeSection,
  onSelectSection,
  mcqCount,
  onOpenBulkModal,
  onResetSampleMcqs,
  facebookConfig,
  onOpenFacebookSettings,
  cartItemsCount,
  onOpenCart,
  onOpenOrders,
  ordersCount,
  publishedProductsCount,
}) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold shadow-xs">
            {activeSection.startsWith('tshirt') ? (
              <ShoppingBag className="w-5 h-5 text-amber-400" />
            ) : (
              <Layers className="w-5 h-5 text-indigo-400" />
            )}
          </div>

          <div>
            <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>{activeSection.startsWith('tshirt') ? 'T-Shirt Studio & Shop' : 'MCQ Canvas Studio'}</span>
              <span className="text-[10px] bg-slate-900 text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                PRO
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
              {activeSection.startsWith('tshirt')
                ? 'E-Commerce Store & Bulk PNG Mockup Studio'
                : 'Social Media Bulk Quiz Image Studio'}
            </p>
          </div>
        </div>

        {/* Center Main Section Switcher Pill */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs">
          <button
            onClick={() => onSelectSection('tshirt_store')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSection === 'tshirt_store'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-indigo-600" />
            <span>টিশার্ট শপ</span>
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full hidden sm:inline">
              {publishedProductsCount}
            </span>
          </button>

          <button
            onClick={() => onSelectSection('tshirt_studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSection === 'tshirt_studio'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-amber-500" />
            <span>বাল্ক মকআপ স্টুডিও</span>
          </button>

          <button
            onClick={() => onSelectSection('mcq_studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSection === 'mcq_studio'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">MCQ কুইজ জেনারেটর</span>
            <span className="md:hidden">MCQ</span>
          </button>
        </div>

        {/* Right Section Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {activeSection.startsWith('tshirt') ? (
            <>
              {/* Admin Orders Button */}
              <button
                onClick={onOpenOrders}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="কাস্টমার অর্ডার ড্যাশবোর্ড"
              >
                <Package className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">অর্ডারসমূহ</span>
                {ordersCount > 0 && (
                  <span className="bg-indigo-600 text-white font-mono text-[10px] px-1.5 py-0.2 rounded-full">
                    {ordersCount}
                  </span>
                )}
              </button>

              {/* Shopping Cart Button */}
              <button
                onClick={onOpenCart}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer relative"
                title="শপিং কার্ট"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">কার্ট</span>
                {cartItemsCount > 0 && (
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </>
          ) : (
            <>
              {/* MCQ Toolbar Actions */}
              {onOpenFacebookSettings && (
                <button
                  onClick={onOpenFacebookSettings}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    facebookConfig?.isConnected
                      ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-900'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                  title="Facebook Page Auto-Posting Settings"
                >
                  <Facebook className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="hidden md:inline">
                    {facebookConfig?.isConnected && facebookConfig.pageName
                      ? facebookConfig.pageName
                      : 'FB Auto-Post'}
                  </span>
                  {facebookConfig?.isConnected && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 hidden sm:inline" />
                  )}
                </button>
              )}

              <button
                onClick={downloadSampleExcel}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                title="Download Sample Excel File"
              >
                <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                <span>Sample Excel</span>
              </button>

              <button
                onClick={onResetSampleMcqs}
                className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
                title="Reset to Sample MCQs"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenBulkModal}
                className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Bulk Export</span>
                <span className="bg-indigo-800 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">
                  {mcqCount}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
