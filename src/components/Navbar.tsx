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
  Lock,
  UserCheck,
  Sliders,
} from 'lucide-react';
import { downloadSampleExcel } from '../data/sampleMcqs';
import { FacebookPageConfig, AdminUser } from '../types';

export type AppMainSection = 'tshirt_store' | 'tshirt_studio' | 'admin_panel' | 'mcq_studio';

interface Props {
  activeSection: AppMainSection;
  onSelectSection: (section: AppMainSection) => void;
  adminUser: AdminUser | null;
  onOpenAdminLogin: () => void;
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
  pendingOrdersCount: number;
  publishedProductsCount: number;
}

export const Navbar: React.FC<Props> = ({
  activeSection,
  onSelectSection,
  adminUser,
  onOpenAdminLogin,
  mcqCount,
  onOpenBulkModal,
  onResetSampleMcqs,
  facebookConfig,
  onOpenFacebookSettings,
  cartItemsCount,
  onOpenCart,
  onOpenOrders,
  ordersCount,
  pendingOrdersCount,
  publishedProductsCount,
}) => {
  const handleAdminPanelClick = () => {
    if (adminUser) {
      onSelectSection('admin_panel');
    } else {
      onOpenAdminLogin();
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Title */}
        <div
          onClick={() => onSelectSection('tshirt_store')}
          className="flex items-center gap-2.5 sm:gap-3 shrink-0 cursor-pointer"
        >
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold shadow-xs">
            {activeSection === 'admin_panel' ? (
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            ) : activeSection.startsWith('tshirt') ? (
              <ShoppingBag className="w-5 h-5 text-amber-400" />
            ) : (
              <Layers className="w-5 h-5 text-indigo-400" />
            )}
          </div>

          <div>
            <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>
                {activeSection === 'admin_panel'
                  ? 'Admin Management Suite'
                  : activeSection.startsWith('tshirt')
                  ? 'Streetwear Studio & Shop'
                  : 'MCQ Canvas Studio'}
              </span>
              <span className="text-[10px] bg-slate-900 text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                {activeSection === 'admin_panel' ? 'ADMIN' : 'PRO'}
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
              {activeSection === 'admin_panel'
                ? 'Storefront Orders, Inventory & Revenue Hub'
                : activeSection.startsWith('tshirt')
                ? 'E-Commerce Storefront & Bulk 3D Mockup Generator'
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
            <span>Storefront</span>
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
            <span className="hidden sm:inline">Bulk Studio</span>
            <span className="sm:hidden">Studio</span>
          </button>

          {/* Admin Management Panel Tab */}
          <button
            onClick={handleAdminPanelClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSection === 'admin_panel'
                ? 'bg-slate-900 text-white shadow-xs'
                : adminUser
                ? 'text-slate-900 bg-amber-100/80 hover:bg-amber-200/80 border border-amber-300/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {adminUser ? (
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="hidden sm:inline">Admin Panel</span>
            <span className="sm:hidden">Admin</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                {pendingOrdersCount}
              </span>
            )}
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
            <span className="hidden md:inline">MCQ</span>
          </button>
        </div>

        {/* Right Section Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Admin Status Pill / Login Button */}
          {adminUser ? (
            <button
              onClick={() => onSelectSection('admin_panel')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold transition-all cursor-pointer"
              title={`Logged in as ${adminUser.name} (${adminUser.role})`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="hidden sm:inline">{adminUser.name.split(' ')[0]}</span>
              <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-black">
                ADMIN
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
              title="Admin Login Gateway"
            >
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              <span>Admin Log In</span>
            </button>
          )}

          {activeSection.startsWith('tshirt') || activeSection === 'admin_panel' ? (
            <>
              {/* Shopping Cart Button */}
              <button
                onClick={onOpenCart}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer relative"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
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

