import React, { useRef, useState } from 'react';
import { Download, ChevronLeft, ChevronRight, Image as ImageIcon, Sparkles, Check, Copy, Facebook } from 'lucide-react';
import { McqItem, DesignConfig } from '../types';
import { McqCardRenderer } from './mcq-templates/McqCardRenderer';
import { nodeToDataUrl, triggerDownload } from '../utils/imageExporter';

interface Props {
  mcq: McqItem;
  config: DesignConfig;
  currentIndex: number;
  totalCount: number;
  onPrev: () => void;
  onNext: () => void;
  onOpenFacebookPost?: (mcq: McqItem, imageDataUrl: string) => void;
}

export const SinglePreviewCard: React.FC<Props> = ({
  mcq,
  config,
  currentIndex,
  totalCount,
  onPrev,
  onNext,
  onOpenFacebookPost,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [isPreparingFb, setIsPreparingFb] = useState(false);

  const handleOpenFbModal = async () => {
    if (!cardRef.current || !onOpenFacebookPost) return;
    setIsPreparingFb(true);

    try {
      const dataUrl = await nodeToDataUrl(cardRef.current, {
        pixelRatio: 2.5,
        quality: 0.95,
        type: 'png',
      });
      onOpenFacebookPost(mcq, dataUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPreparingFb(false);
    }
  };

  const handleDownload = async (format: 'jpeg' | 'png' = 'jpeg') => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      const dataUrl = await nodeToDataUrl(cardRef.current, {
        pixelRatio: 2.5,
        quality: 0.95,
        type: format,
      });

      const cleanQuestionName = (mcq.question || 'mcq')
        .replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, '_')
        .substring(0, 25);
      const filename = `MCQ_${currentIndex + 1}_${cleanQuestionName}.${format === 'jpeg' ? 'jpg' : 'png'}`;

      triggerDownload(dataUrl, filename);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyDataUrl = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await nodeToDataUrl(cardRef.current, { pixelRatio: 2 });
      await navigator.clipboard.writeText(dataUrl);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg p-6 shadow-xs text-slate-800 flex flex-col items-center justify-between">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 border border-indigo-100 rounded text-indigo-600">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Live Photo Preview
            </h3>
            <p className="text-xs text-slate-500">
              Question {currentIndex + 1} of {totalCount}
            </p>
          </div>
        </div>

        {/* Carousel Navigation */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-indigo-700 px-2">
            {currentIndex + 1}/{totalCount}
          </span>
          <button
            onClick={onNext}
            disabled={currentIndex >= totalCount - 1}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rendered Template Container */}
      <div className="w-full flex items-center justify-center p-4 bg-slate-100/70 rounded-lg border border-slate-200 my-auto min-h-[380px] overflow-auto shadow-inner">
        <div className="transform scale-[0.7] sm:scale-[0.82] md:scale-[0.88] origin-center shadow-lg transition-all">
          <McqCardRenderer ref={cardRef} mcq={mcq} config={config} index={currentIndex + 1} />
        </div>
      </div>

      {/* Download Bar for Single Item */}
      <div className="w-full pt-4 mt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>High-Resolution HD Export (JPG / PNG)</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {onOpenFacebookPost && (
            <button
              onClick={handleOpenFbModal}
              disabled={isPreparingFb}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
              title="Post image directly to connected Facebook Page"
            >
              <Facebook className="w-4 h-4" />
              <span>{isPreparingFb ? 'Preparing...' : 'Post to Facebook Page'}</span>
            </button>
          )}

          <button
            onClick={handleCopyDataUrl}
            className="flex-1 sm:flex-none px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            {copiedMsg ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Data URL</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleDownload('jpeg')}
            disabled={isDownloading}
            className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Exporting...' : 'Download JPG'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
