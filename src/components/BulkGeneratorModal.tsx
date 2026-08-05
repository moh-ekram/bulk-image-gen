import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { Download, FileArchive, CheckCircle2, RefreshCw, X, Image as ImageIcon, Zap, Sparkles } from 'lucide-react';
import { McqItem, DesignConfig, GeneratedImageResult } from '../types';
import { McqCardRenderer } from './mcq-templates/McqCardRenderer';
import { nodeToDataUrl, triggerDownload } from '../utils/imageExporter';

interface Props {
  mcqs: McqItem[];
  config: DesignConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const BulkGeneratorModal: React.FC<Props> = ({ mcqs, config, isOpen, onClose }) => {
  const [results, setResults] = useState<GeneratedImageResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZipping, setIsZipping] = useState(false);
  const [autoDownloading, setAutoDownloading] = useState(false);

  const hiddenCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && mcqs.length > 0 && results.length === 0 && !isProcessing) {
      startBulkGeneration();
    }
  }, [isOpen, mcqs]);

  const startBulkGeneration = async () => {
    setIsProcessing(true);
    setResults([]);
    setCurrentIndex(0);

    const generatedList: GeneratedImageResult[] = [];

    for (let i = 0; i < mcqs.length; i++) {
      setCurrentIndex(i);
      const item = mcqs[i];

      // Wait for DOM state render update
      await new Promise((resolve) => setTimeout(resolve, 150));

      if (hiddenCardRef.current) {
        try {
          const dataUrl = await nodeToDataUrl(hiddenCardRef.current, {
            pixelRatio: 2.2,
            quality: 0.95,
            type: 'jpeg',
          });

          const res = await fetch(dataUrl);
          const blob = await res.blob();

          const cleanQ = (item.question || `item_${i + 1}`)
            .replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, '_')
            .substring(0, 20);
          const filename = `mcq_${String(i + 1).padStart(2, '0')}_${cleanQ}.jpg`;

          generatedList.push({
            id: item.id,
            mcq: item,
            dataUrl,
            blob,
            filename,
          });
        } catch (e) {
          console.error(`Error generating image for index ${i}:`, e);
        }
      }
    }

    setResults(generatedList);
    setIsProcessing(false);
  };

  const handleDownloadZip = async () => {
    if (results.length === 0) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      const folder = zip.folder('MCQ_Images');

      results.forEach((res) => {
        folder?.file(res.filename, res.blob);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(content);

      triggerDownload(zipUrl, `MCQ_Quiz_Images_Bulk_${Date.now()}.zip`);
    } catch (e) {
      console.error('Zip generation failed:', e);
    } finally {
      setIsZipping(false);
    }
  };

  const handleAutoDownloadQueue = async () => {
    if (results.length === 0) return;
    setAutoDownloading(true);

    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      triggerDownload(item.dataUrl, item.filename);
      // Wait 350ms between downloads to bypass browser multiple download triggers block
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    setAutoDownloading(false);
  };

  if (!isOpen) return null;

  const progressPercent = mcqs.length > 0 ? Math.round(((currentIndex + 1) / mcqs.length) * 100) : 0;
  const currentItem = mcqs[currentIndex] || mcqs[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Hidden Render Engine Node */}
      <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none opacity-0">
        {currentItem && (
          <McqCardRenderer ref={hiddenCardRef} mcq={currentItem} config={config} index={currentIndex + 1} />
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded text-indigo-600">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                বাল্ক ইমেজ প্রসেসিং ও অটো ডাউনলোড
                <span className="text-[11px] bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded uppercase font-bold">
                  {mcqs.length} টি MCQ
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                সবগুলো প্রশ্নের ছবি তৈরি হয়ে গেলে একসাথে ZIP নামান অথবা অটো ডাউনলোড করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Progress Section */}
          {isProcessing ? (
            <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 text-center space-y-4">
              <div className="flex items-center justify-between text-sm font-bold text-indigo-800">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                  ফটো রেন্ডার করা হচ্ছে ({currentIndex + 1} / {mcqs.length})...
                </span>
                <span>{progressPercent}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-xs text-slate-600 italic">
                {currentItem?.question}
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-green-900">
                    সবগুলো ({results.length}) MCQ ফটো সফলভাবে জেনারেট হয়েছে!
                  </h3>
                  <p className="text-xs text-green-700">
                    নিচের যে কোনো একটি পদ্ধতিতে আপনার কম্পিউটারে ডাউনলোড করে নিন।
                  </p>
                </div>
              </div>

              <button
                onClick={startBulkGeneration}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded border border-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>পুনরায় জেনারেট করুন</span>
              </button>
            </div>
          )}

          {/* Quick Download Buttons */}
          {!isProcessing && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleDownloadZip}
                disabled={isZipping || results.length === 0}
                className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded shadow-xs flex items-center justify-center gap-3 cursor-pointer transition-all disabled:opacity-50"
              >
                <FileArchive className="w-5 h-5" />
                <span>{isZipping ? 'জিপ তৈরি হচ্ছে...' : 'সবকিছু এক ক্লিকের ZIP ফাইল নামান'}</span>
              </button>

              <button
                onClick={handleAutoDownloadQueue}
                disabled={autoDownloading || results.length === 0}
                className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-sm rounded shadow-xs flex items-center justify-center gap-3 cursor-pointer transition-all disabled:opacity-50"
              >
                <Download className="w-5 h-5 text-indigo-600" />
                <span>{autoDownloading ? 'ডাউনলোড হচ্ছে...' : 'একটি একটি করে অটো ডাউনলোড করুন'}</span>
              </button>
            </div>
          )}

          {/* Image Gallery Grid */}
          {!isProcessing && results.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                জেনারেট হওয়া সকল ফটোর গ্যালারি ({results.length})
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {results.map((res, idx) => (
                  <div
                    key={res.id}
                    className="group bg-slate-50 border border-slate-200 rounded-lg overflow-hidden p-2 flex flex-col justify-between hover:border-indigo-500 transition-all shadow-xs"
                  >
                    <div className="relative aspect-square w-full rounded overflow-hidden bg-white mb-2 border border-slate-200">
                      <img
                        src={res.dataUrl}
                        alt={`MCQ ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute top-1 left-1 bg-white/90 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
                        #{idx + 1}
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-slate-700 truncate px-1 mb-2">
                      {res.mcq.question}
                    </p>

                    <button
                      onClick={() => triggerDownload(res.dataUrl, res.filename)}
                      className="w-full py-1.5 bg-white hover:bg-indigo-600 hover:text-white text-slate-700 text-[11px] font-semibold rounded border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>ডাউনলোড JPG</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
