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
    <header className="w-full bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Title */}
        <div
          onClick={() => onSelectSection('tshirt_store')}
          className="flex items-center gap-2.5 sm:gap-3 shrink-0 cursor-pointer"
        >
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white font-bold shadow-xs">
            {activeSection === 'admin_panel' ? (
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            ) : activeSection.startsWith('tshirt') ? (
              <ShoppingBag className="w-5 h-5 text-amber-400" />
            ) : (
              <Layers className="w-5 h-5 text-indigo-400" />
            )}
          </div>

          <div>
            <h1 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1.5">
              <span>
                {activeSection === 'admin_panel'
                  ? 'Admin Management Suite'
                  : activeSection.startsWith('tshirt')
                  ? 'Streetwear Studio & Shop'
                  : 'MCQ Canvas Studio'}
              </span>
              <span className="text-[10px] bg-black text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                {activeSection === 'admin_panel' ? 'ADMIN' : 'PRO'}
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              {activeSection === 'admin_panel'
                ? 'Storefront Orders, Inventory & Revenue Hub'
                : activeSection.startsWith('tshirt')
                ? 'E-Commerce Storefront & Bulk 3D Mockup Generator'
                : 'Social Media Bulk Quiz Image Studio'}
            </p>
          </div>
        </div>

        {/* Center Main Section Switcher Pill */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-800 text-xs font-bold shadow-2xs">
          <button
            onClick={() => onSelectSection('tshirt_store')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSection === 'tshirt_store'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
            <span>Storefront</span>
            <span className="bg-indigo-900 text-indigo-300 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full hidden sm:inline">
              {publishedProductsCount}
            </span>
          </button>

          <button
            onClick={() => onSelectSection('tshirt_studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSection === 'tshirt_studio'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
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
                ? 'bg-black text-white shadow-xs'
                : adminUser
                ? 'text-white bg-amber-900/80 hover:bg-amber-800/80 border border-amber-700/60'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {adminUser ? (
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="hidden sm:inline">Admin Panel</span>
            <span className="sm:hidden">Admin</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-amber-400 text-white font-black text-[10px] px-1.5 py-0.2 rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectSection('mcq_studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSection === 'mcq_studio'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">MCQ</span>
          </button>
        </div>

        {/* Right Section Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Admin Status Pill / Login Button */}
          {adminUser ? (
            <button
              onClick={() => onSelectSection('admin_panel')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-950 border border-emerald-800 hover:bg-emerald-900 text-emerald-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-800 text-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
              title="Admin Login Gateway"
            >
              <Lock className="w-3.5 h-3.5 text-slate-300" />
              <span>Admin Log In</span>
            </button>
          )}

          {activeSection.startsWith('tshirt') || activeSection === 'admin_panel' ? (
            <>
              {/* Shopping Cart Button */}
              <button
                onClick={onOpenCart}
                className="flex items-center gap-2 px-3.5 py-2 bg-black hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer relative"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemsCount > 0 && (
                  <span className="bg-amber-400 text-white font-black text-[10px] px-1.5 py-0.2 rounded-full">
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
                      ? 'bg-blue-950 hover:bg-blue-900 border-blue-800 text-blue-300'
                      : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
                  }`}
                  title="Facebook Page Auto-Posting Settings"
                >
                  <Facebook className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="hidden md:inline">
                    {facebookConfig?.isConnected && facebookConfig.pageName
                      ? facebookConfig.pageName
                      : 'FB Auto-Post'}
                  </span>
                  {facebookConfig?.isConnected && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 hidden sm:inline" />
                  )}
                </button>
              )}

              <button
                onClick={downloadSampleExcel}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                title="Download Sample Excel File"
              >
                <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                <span>Sample Excel</span>
              </button>

              <button
                onClick={onResetSampleMcqs}
                className="p-2 text-slate-400 hover:text-slate-100 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all cursor-pointer"
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

