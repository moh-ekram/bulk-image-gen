import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { Download, FileArchive, CheckCircle2, RefreshCw, X, Image as ImageIcon, Zap, Sparkles, Facebook, ExternalLink, Send, Calendar, Clock, Shuffle, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { McqItem, DesignConfig, GeneratedImageResult, FacebookPageConfig } from '../types';
import { McqCardRenderer } from './mcq-templates/McqCardRenderer';
import { nodeToDataUrl, triggerDownload } from '../utils/imageExporter';

interface Props {
  mcqs: McqItem[];
  config: DesignConfig;
  isOpen: boolean;
  onClose: () => void;
  facebookConfig?: FacebookPageConfig;
  onOpenFacebookSettings?: () => void;
}

export const BulkGeneratorModal: React.FC<Props> = ({
  mcqs,
  config,
  isOpen,
  onClose,
  facebookConfig,
  onOpenFacebookSettings,
}) => {
  const [results, setResults] = useState<GeneratedImageResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZipping, setIsZipping] = useState(false);
  const [autoDownloading, setAutoDownloading] = useState(false);

  // Bulk Facebook Posting states
  const [isBulkPostingToFb, setIsBulkPostingToFb] = useState(false);
  const [fbPostingIndex, setFbPostingIndex] = useState(0);
  const [fbPostLogs, setFbPostLogs] = useState<{ id: string; success: boolean; url?: string; error?: string; scheduledTimeText?: string }[]>([]);

  // Facebook Schedule Configuration States
  const [publishMode, setPublishMode] = useState<'now' | 'scheduled'>('now');

  const getDefaultStartTime = () => {
    const d = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes in future
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [startDateTime, setStartDateTime] = useState<string>(getDefaultStartTime);
  const [intervalType, setIntervalType] = useState<'fixed' | 'random_range'>('fixed');
  const [fixedIntervalMins, setFixedIntervalMins] = useState<number>(30);
  const [randomMinMins, setRandomMinMins] = useState<number>(15);
  const [randomMaxMins, setRandomMaxMins] = useState<number>(45);
  const [showScheduleList, setShowScheduleList] = useState<boolean>(false);
  const [randomSeed, setRandomSeed] = useState<number>(0);

  const hiddenCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && mcqs.length > 0 && results.length === 0 && !isProcessing) {
      startBulkGeneration();
    }
  }, [isOpen, mcqs]);

  // Calculate projected schedule times array
  const getCalculatedScheduleTimes = (): Date[] => {
    const times: Date[] = [];
    const baseDate = new Date(startDateTime);
    let current = isNaN(baseDate.getTime()) ? new Date(Date.now() + 20 * 60 * 1000) : new Date(baseDate);

    for (let i = 0; i < results.length; i++) {
      if (i === 0) {
        times.push(new Date(current));
      } else {
        let addMins = fixedIntervalMins;
        if (intervalType === 'random_range') {
          const min = Math.min(randomMinMins, randomMaxMins);
          const max = Math.max(randomMinMins, randomMaxMins);
          // Pseudo-random calculation bound to item index & randomSeed for preview consistency
          const rand = Math.sin((randomSeed + 1) * 999 + i * 17) * 10000;
          const norm = Math.abs(rand - Math.floor(rand));
          addMins = Math.floor(norm * (max - min + 1)) + min;
        }
        current = new Date(current.getTime() + addMins * 60 * 1000);
        times.push(new Date(current));
      }
    }
    return times;
  };

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

  const handleBulkFacebookPost = async () => {
    if (!facebookConfig || !facebookConfig.isConnected || !facebookConfig.pageId || !facebookConfig.pageAccessToken) {
      if (onOpenFacebookSettings) onOpenFacebookSettings();
      return;
    }

    if (results.length === 0) return;

    let scheduledTimes: Date[] = [];
    if (publishMode === 'scheduled') {
      scheduledTimes = getCalculatedScheduleTimes();
      const firstTime = scheduledTimes[0];
      const diffMins = (firstTime.getTime() - Date.now()) / (1000 * 60);

      if (isNaN(firstTime.getTime()) || diffMins < 10) {
        alert('শিডিউল করার সময় বর্তমান সময় থেকে কমপক্ষে ১০ মিনিট ভবিষ্যতের হতে হবে। প্রথম পোস্টের সময় আপডেট করা হলো।');
        setStartDateTime(getDefaultStartTime());
        return;
      }
    }

    setIsBulkPostingToFb(true);
    setFbPostingIndex(0);
    setFbPostLogs([]);

    for (let i = 0; i < results.length; i++) {
      const resItem = results[i];
      setFbPostingIndex(i + 1);

      let text = `📌 ${resItem.mcq.category ? `[${resItem.mcq.category}] ` : ''}MCQ Quiz Question (${i + 1}/${results.length})\n\n`;
      text += `❓ ${resItem.mcq.question}\n\n`;
      text += `A) ${resItem.mcq.optionA}\n`;
      text += `B) ${resItem.mcq.optionB}\n`;
      if (resItem.mcq.optionC) text += `C) ${resItem.mcq.optionC}\n`;
      if (resItem.mcq.optionD) text += `D) ${resItem.mcq.optionD}\n`;
      if (resItem.mcq.correctAnswer) {
        text += `\n💡 Correct Answer: Option ${resItem.mcq.correctAnswer}\n`;
      }
      text += `\n#MCQ #Quiz #Education #StudyGram #BanglaMCQ`;

      let scheduledPublishTimeSec: number | undefined = undefined;
      let scheduledText: string | undefined = undefined;

      if (publishMode === 'scheduled' && scheduledTimes[i]) {
        const targetDate = scheduledTimes[i];
        scheduledPublishTimeSec = Math.floor(targetDate.getTime() / 1000);
        scheduledText = targetDate.toLocaleString('bn-BD', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
      }

      try {
        const res = await fetch('/api/facebook/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageId: facebookConfig.pageId,
            pageAccessToken: facebookConfig.pageAccessToken,
            imageBase64: resItem.dataUrl,
            caption: text,
            published: publishMode === 'now',
            scheduledPublishTime: scheduledPublishTimeSec,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setFbPostLogs((prev) => [
            ...prev,
            {
              id: resItem.id,
              success: true,
              url: data.postUrl,
              scheduledTimeText: scheduledText,
            },
          ]);
        } else {
          setFbPostLogs((prev) => [
            ...prev,
            { id: resItem.id, success: false, error: data.error || 'Failed' },
          ]);
        }
      } catch (err: any) {
        setFbPostLogs((prev) => [
          ...prev,
          { id: resItem.id, success: false, error: err.message },
        ]);
      }

      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setIsBulkPostingToFb(false);
  };

  if (!isOpen) return null;

  const progressPercent = mcqs.length > 0 ? Math.round(((currentIndex + 1) / mcqs.length) * 100) : 0;
  const currentItem = mcqs[currentIndex] || mcqs[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Hidden Render Engine Node */}
      <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none opacity-0">
        {currentItem && (
          <McqCardRenderer ref={hiddenCardRef} mcq={currentItem} config={config} index={currentIndex + 1} />
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-950 border border-indigo-900 rounded text-indigo-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Bulk Image Processing & Auto Download
                <span className="text-[11px] bg-indigo-900 text-indigo-400 px-2.5 py-0.5 rounded uppercase font-bold">
                  {mcqs.length} MCQ Items
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Once rendering completes, download all images as a single ZIP archive or auto-download sequentially
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Progress Section */}
          {isProcessing ? (
            <div className="bg-slate-950 p-8 rounded-lg border border-slate-800 text-center space-y-4">
              <div className="flex items-center justify-between text-sm font-bold text-indigo-300">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                  Rendering Images ({currentIndex + 1} / {mcqs.length})...
                </span>
                <span>{progressPercent}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-xs text-slate-300 italic">
                {currentItem?.question}
              </p>
            </div>
          ) : (
            <div className="bg-green-950 border border-green-800 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-green-300">
                    All {results.length} MCQ images generated successfully!
                  </h3>
                  <p className="text-xs text-green-400">
                    Choose one of the bulk download options below to save them to your computer.
                  </p>
                </div>
              </div>

              <button
                onClick={startBulkGeneration}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-950 text-slate-200 text-xs font-semibold rounded border border-slate-800 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-generate All</span>
              </button>
            </div>
          )}

          {/* Quick Actions & Facebook Auto-Posting Control Center */}
          {!isProcessing && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadZip}
                  disabled={isZipping || results.length === 0}
                  className="p-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <FileArchive className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{isZipping ? 'Creating ZIP...' : 'Download All as ZIP File'}</span>
                </button>

                <button
                  onClick={handleAutoDownloadQueue}
                  disabled={autoDownloading || results.length === 0}
                  className="p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-100 font-semibold text-xs sm:text-sm rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                  <span>{autoDownloading ? 'Downloading...' : 'Auto-Download Files Sequentially'}</span>
                </button>
              </div>

              {/* Facebook Auto-Posting & Scheduling Control Center */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                      <Facebook className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">
                        ফেসবুক পেজ অটো-পোস্টিং ও শিডিউলিং (Facebook Auto Publisher)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {facebookConfig?.isConnected && facebookConfig.pageName
                          ? `কানেক্টেড পেজ: ${facebookConfig.pageName}`
                          : 'ফেসবুক পেজে সরাসরি পোস্ট বা ভবিষ্যতের জন্য সময়সূচী শিডিউল করুন'}
                      </p>
                    </div>
                  </div>

                  {facebookConfig?.isConnected ? (
                    <button
                      onClick={onOpenFacebookSettings}
                      className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>পেজ চেঞ্জ করুন</span>
                    </button>
                  ) : (
                    <button
                      onClick={onOpenFacebookSettings}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
                    >
                      পেজ কানেক্ট করুন
                    </button>
                  )}
                </div>

                {/* Mode Selection: Publish Now vs Scheduled */}
                <div className="grid grid-cols-2 gap-2 bg-slate-700/60 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPublishMode('now')}
                    className={`py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      publishMode === 'now'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>এখনই পোস্ট করুন (Instant)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPublishMode('scheduled')}
                    className={`py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      publishMode === 'scheduled'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>টাইম শিডিউল পোস্ট (Scheduled)</span>
                  </button>
                </div>

                {/* Schedule Configuration Panel */}
                {publishMode === 'scheduled' && (
                  <div className="bg-slate-900 p-4 rounded-lg border border-blue-900 shadow-2xs space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Start Date & Time */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-400" />
                          <span>প্রথম পোস্ট শুরুর সময় (Start Date & Time)</span>
                        </label>
                        <input
                          type="datetime-local"
                          value={startDateTime}
                          onChange={(e) => setStartDateTime(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-semibold focus:outline-none focus:border-blue-600"
                        />
                        <div className="flex gap-1.5 pt-0.5">
                          <button
                            type="button"
                            onClick={() => setStartDateTime(getDefaultStartTime())}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-medium text-slate-200 rounded cursor-pointer"
                          >
                            +২০ মিনিট পর
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date();
                              d.setHours(18, 0, 0, 0);
                              if (d.getTime() < Date.now()) d.setDate(d.getDate() + 1);
                              const year = d.getFullYear();
                              const month = String(d.getMonth() + 1).padStart(2, '0');
                              const day = String(d.getDate()).padStart(2, '0');
                              setStartDateTime(`${year}-${month}-${day}T18:00`);
                            }}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-medium text-slate-200 rounded cursor-pointer"
                          >
                            আজ সন্ধ্যা ৬:০০
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date();
                              d.setDate(d.getDate() + 1);
                              d.setHours(9, 0, 0, 0);
                              const year = d.getFullYear();
                              const month = String(d.getMonth() + 1).padStart(2, '0');
                              const day = String(d.getDate()).padStart(2, '0');
                              setStartDateTime(`${year}-${month}-${day}T09:00`);
                            }}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-medium text-slate-200 rounded cursor-pointer"
                          >
                            আগামীকাল সকাল ৯:০০
                          </button>
                        </div>
                      </div>

                      {/* Interval Strategy Switcher */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Shuffle className="w-3.5 h-3.5 text-blue-400" />
                          <span>পোস্টিং টাইম ইন্টারভাল (Interval Type)</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setIntervalType('fixed')}
                            className={`p-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                              intervalType === 'fixed'
                                ? 'bg-blue-950 border-blue-500 text-blue-300'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>নির্দিষ্ট সময় (Fixed)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setIntervalType('random_range')}
                            className={`p-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                              intervalType === 'random_range'
                                ? 'bg-purple-950 border-purple-500 text-purple-300'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <Shuffle className="w-3.5 h-3.5" />
                            <span>র্যান্ডম সময় (Random Range)</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Fixed Interval Controls */}
                    {intervalType === 'fixed' && (
                      <div className="space-y-2 pt-1 border-t border-slate-800">
                        <span className="text-[11px] font-bold text-slate-300">
                          প্রতিটি পোস্টের মধ্যবর্তী সময়:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { label: '১৫ মিনিট', mins: 15 },
                            { label: '৩০ মিনিট', mins: 30 },
                            { label: '১ ঘণ্টা', mins: 60 },
                            { label: '২ ঘণ্টা', mins: 120 },
                            { label: '৪ ঘণ্টা', mins: 240 },
                            { label: '৬ ঘণ্টা', mins: 360 },
                            { label: '১২ ঘণ্টা', mins: 720 },
                            { label: '২৪ ঘণ্টা', mins: 1440 },
                          ].map((preset) => (
                            <button
                              key={preset.mins}
                              type="button"
                              onClick={() => setFixedIntervalMins(preset.mins)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                                fixedIntervalMins === preset.mins
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Random Range Controls */}
                    {intervalType === 'random_range' && (
                      <div className="space-y-3 pt-1 border-t border-slate-800">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                          <span>র্যান্ডম সময় রেন্জ (Min to Max Minutes):</span>
                          <button
                            type="button"
                            onClick={() => setRandomSeed((prev) => prev + 1)}
                            className="text-purple-400 hover:underline text-[11px] flex items-center gap-1 cursor-pointer font-semibold"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>র্যান্ডম সময় রিফ্রেশ করুন</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                              সর্বনিম্ন বিরতি (মিনিট):
                            </label>
                            <input
                              type="number"
                              min={10}
                              max={1440}
                              value={randomMinMins}
                              onChange={(e) => setRandomMinMins(Math.max(10, parseInt(e.target.value) || 10))}
                              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs font-bold text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                              সর্বোচ্চ বিরতি (মিনিট):
                            </label>
                            <input
                              type="number"
                              min={randomMinMins}
                              max={2880}
                              value={randomMaxMins}
                              onChange={(e) => setRandomMaxMins(Math.max(randomMinMins, parseInt(e.target.value) || 30))}
                              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs font-bold text-white"
                            />
                          </div>
                        </div>

                        <p className="text-[11px] text-purple-300 bg-purple-950 p-2.5 rounded border border-purple-900 leading-relaxed">
                          💡 <strong>হিউম্যান পোস্টিং প্যাটার্ন:</strong> প্রতিটি পোস্ট আগের পোস্ট থেকে{' '}
                          <span className="font-bold underline">{randomMinMins}</span> থেকে{' '}
                          <span className="font-bold underline">{randomMaxMins}</span> মিনিটের মধ্যে এলোমেলো সময়ে শিডিউল হবে।
                        </p>
                      </div>
                    )}

                    {/* Schedule Timeline Preview Box */}
                    <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 space-y-2">
                      <div
                        onClick={() => setShowScheduleList(!showScheduleList)}
                        className="flex items-center justify-between cursor-pointer text-xs font-bold text-slate-100"
                      >
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span>
                            গণনাকৃত শিডিউল সময়সূচী ({results.length}টি পোস্ট)
                          </span>
                        </span>
                        <div className="flex items-center gap-2">
                          {getCalculatedScheduleTimes().length > 0 && (
                            <span className="text-[10px] bg-blue-900 text-blue-300 font-mono px-2 py-0.5 rounded">
                              {getCalculatedScheduleTimes()[0]?.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' })} →{' '}
                              {getCalculatedScheduleTimes()[results.length - 1]?.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                          {showScheduleList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>

                      {showScheduleList && (
                        <div className="max-h-40 overflow-y-auto space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
                          {getCalculatedScheduleTimes().map((time, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-800"
                            >
                              <span className="font-bold text-slate-200">Question #{idx + 1}</span>
                              <span className="text-blue-300 font-semibold font-mono">
                                {time.toLocaleString('bn-BD', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Primary Post Trigger Button */}
                <button
                  onClick={handleBulkFacebookPost}
                  disabled={isBulkPostingToFb}
                  className={`w-full p-3.5 text-white font-bold text-xs sm:text-sm rounded-lg shadow-md flex items-center justify-center gap-2.5 cursor-pointer transition-all disabled:opacity-50 ${
                    publishMode === 'scheduled'
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>
                    {isBulkPostingToFb
                      ? `প্রসেসিং চলছে (${fbPostingIndex}/${results.length})...`
                      : publishMode === 'scheduled'
                      ? `সকল ${results.length}টি পোস্ট ফেসবুক শিডিউলে যোগ করুন`
                      : `সকল ${results.length}টি পোস্ট ফেসবুকে এখনই পোস্ট করুন`}
                  </span>
                </button>
              </div>

              {/* Facebook Bulk Post Progress & Logs Box */}
              {(isBulkPostingToFb || fbPostLogs.length > 0) && (
                <div className="p-4 bg-blue-950/70 border border-blue-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-300">
                    <span className="flex items-center gap-2">
                      <Facebook className="w-4 h-4 text-blue-400" />
                      <span>ফেসবুক পেজ বাল্ক পোস্টিং স্ট্যাটাস</span>
                    </span>
                    <span>
                      {fbPostingIndex} / {results.length} Completed
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-blue-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${Math.round((fbPostLogs.length / results.length) * 100)}%` }}
                    />
                  </div>

                  {/* Published / Scheduled Post Links */}
                  <div className="max-h-36 overflow-y-auto space-y-1 pt-1 text-[11px]">
                    {fbPostLogs.map((log, idx) => (
                      <div key={log.id} className="flex items-center justify-between bg-slate-900 p-2 rounded border border-blue-900">
                        <span className="font-mono text-slate-200 font-semibold">Question #{idx + 1}</span>
                        {log.success ? (
                          <div className="flex items-center gap-2">
                            {log.scheduledTimeText ? (
                              <span className="text-purple-300 font-bold bg-purple-950 px-2 py-0.5 rounded border border-purple-800 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-purple-400" />
                                <span>Scheduled: {log.scheduledTimeText}</span>
                              </span>
                            ) : (
                              <a
                                href={log.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                              >
                                <span>Published on Facebook</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-rose-400 font-semibold">{log.error || 'Failed'}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Image Gallery Grid */}
          {!isProcessing && results.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                Generated Image Gallery ({results.length})
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {results.map((res, idx) => (
                  <div
                    key={res.id}
                    className="group bg-slate-950 border border-slate-800 rounded-lg overflow-hidden p-2 flex flex-col justify-between hover:border-indigo-500 transition-all shadow-xs"
                  >
                    <div className="relative aspect-square w-full rounded overflow-hidden bg-slate-900 mb-2 border border-slate-800">
                      <img
                        src={res.dataUrl}
                        alt={`MCQ ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute top-1 left-1 bg-slate-900/90 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-800">
                        #{idx + 1}
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-slate-200 truncate px-1 mb-2">
                      {res.mcq.question}
                    </p>

                    <button
                      onClick={() => triggerDownload(res.dataUrl, res.filename)}
                      className="w-full py-1.5 bg-slate-900 hover:bg-indigo-600 hover:text-white text-slate-200 text-[11px] font-semibold rounded border border-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download JPG</span>
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
