import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Palette, ListFilter, Sparkles, Image as ImageIcon, HelpCircle, CheckCircle2 } from 'lucide-react';
import { McqItem, DesignConfig, FacebookPageConfig } from './types';
import { SAMPLE_MCQS } from './data/sampleMcqs';
import { Navbar } from './components/Navbar';
import { ExcelUploader } from './components/ExcelUploader';
import { TemplateCustomizer } from './components/TemplateCustomizer';
import { McqTableEditor } from './components/McqTableEditor';
import { SinglePreviewCard } from './components/SinglePreviewCard';
import { BulkGeneratorModal } from './components/BulkGeneratorModal';
import { FacebookSettingsModal } from './components/FacebookSettingsModal';
import { FacebookPublisherModal } from './components/FacebookPublisherModal';

export default function App() {
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

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar Header */}
      <Navbar
        mcqCount={mcqs.length}
        onOpenBulkModal={() => setIsBulkModalOpen(true)}
        onResetSampleMcqs={handleResetSample}
        facebookConfig={facebookConfig}
        onOpenFacebookSettings={() => setIsFbSettingsOpen(true)}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Feature Welcome / Instruction Strip */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                Welcome to MCQ Canvas Studio!
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Upload Excel spreadsheets or edit MCQs directly to generate high-resolution social media posters in bulk.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded shadow-xs transition-all cursor-pointer shrink-0"
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
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 border border-slate-200 rounded-md">
              <button
                onClick={() => setActiveTab('customizer')}
                className={`flex-1 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
                className={`flex-1 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
                className={`flex-1 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
              <div className="p-8 bg-white border border-slate-200 rounded-lg text-center text-slate-500 shadow-xs">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-semibold">No MCQ questions loaded</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-3 px-4 sm:px-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">MCQ Canvas Studio</span>
          <span>•</span>
          <span>Professional Image Generator Engine</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Realtime HD Preview, Facebook Page Direct Post & Bulk Export
        </div>
      </footer>

      {/* Bulk Generator Modal */}
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
