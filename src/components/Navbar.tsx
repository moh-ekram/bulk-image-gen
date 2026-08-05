import React from 'react';
import { Layers, Download, Sparkles, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { downloadSampleExcel } from '../data/sampleMcqs';

interface Props {
  mcqCount: number;
  onOpenBulkModal: () => void;
  onResetSampleMcqs: () => void;
}

export const Navbar: React.FC<Props> = ({ mcqCount, onOpenBulkModal, onResetSampleMcqs }) => {
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
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Ready
          </div>

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
