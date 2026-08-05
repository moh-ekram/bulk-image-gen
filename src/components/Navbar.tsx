import React from 'react';
import { Layers, Download, Sparkles, RefreshCw, FileSpreadsheet, Facebook, ShieldCheck } from 'lucide-react';
import { downloadSampleExcel } from '../data/sampleMcqs';
import { FacebookPageConfig } from '../types';

interface Props {
  mcqCount: number;
  onOpenBulkModal: () => void;
  onResetSampleMcqs: () => void;
  facebookConfig?: FacebookPageConfig;
  onOpenFacebookSettings?: () => void;
}

export const Navbar: React.FC<Props> = ({
  mcqCount,
  onOpenBulkModal,
  onResetSampleMcqs,
  facebookConfig,
  onOpenFacebookSettings,
}) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded flex items-center justify-center text-white font-bold shadow-xs">
            <Layers className="w-5 h-5" />
          </div>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              MCQ Canvas Studio
              <span className="text-[11px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                v2.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Bulk MCQ Social Media Image Generator
            </p>
          </div>
        </div>

        {/* System Status & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenFacebookSettings && (
            <button
              onClick={onOpenFacebookSettings}
              className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold border transition-all cursor-pointer ${
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
            className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-xs font-medium transition-all cursor-pointer"
            title="Download Sample Excel File"
          >
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
            <span>Sample Excel</span>
          </button>

          <button
            onClick={onResetSampleMcqs}
            className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition-all cursor-pointer"
            title="Reset to Sample MCQs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenBulkModal}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Bulk Generate Images</span>
            <span className="sm:hidden">Bulk</span>
            <span className="bg-indigo-800 text-white font-bold px-2 py-0.5 rounded text-[10px]">
              {mcqCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

