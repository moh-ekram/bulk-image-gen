import React, { useState } from 'react';
import { Facebook, CheckCircle2, AlertCircle, RefreshCw, X, Send, ExternalLink, Sparkles, FileText } from 'lucide-react';
import { FacebookPageConfig, McqItem } from '../types';

interface FacebookPublisherModalProps {
  isOpen: boolean;
  onClose: () => void;
  mcq: McqItem;
  imageDataUrl: string;
  facebookConfig: FacebookPageConfig;
  onOpenSettings: () => void;
}

export const FacebookPublisherModal: React.FC<FacebookPublisherModalProps> = ({
  isOpen,
  onClose,
  mcq,
  imageDataUrl,
  facebookConfig,
  onOpenSettings,
}) => {
  const buildDefaultCaption = (item: McqItem) => {
    let text = `📌 ${item.category ? `[${item.category}] ` : ''}MCQ Quiz Question\n\n`;
    text += `❓ ${item.question}\n\n`;
    text += `A) ${item.optionA}\n`;
    text += `B) ${item.optionB}\n`;
    if (item.optionC) text += `C) ${item.optionC}\n`;
    if (item.optionD) text += `D) ${item.optionD}\n`;
    
    if (item.correctAnswer) {
      text += `\n💡 Correct Answer: Option ${item.correctAnswer}\n`;
    }
    
    text += `\n#MCQ #Quiz #Education #StudyGram #BanglaMCQ #ExamPrep`;
    return text;
  };

  const [caption, setCaption] = useState(() => buildDefaultCaption(mcq));
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    postUrl?: string;
    postId?: string;
    error?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handlePublish = async () => {
    if (!facebookConfig.isConnected || !facebookConfig.pageId || !facebookConfig.pageAccessToken) {
      setPublishResult({
        success: false,
        error: 'আপনার ফেসবুক পেজ সংযুক্ত করা নেই। অনুগ্রহ করে প্রথমে সেটিংস থেকে পেজ সংযুক্ত করুন।',
      });
      return;
    }

    setIsPublishing(true);
    setPublishResult(null);

    try {
      const res = await fetch('/api/facebook/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: facebookConfig.pageId,
          pageAccessToken: facebookConfig.pageAccessToken,
          imageBase64: imageDataUrl,
          caption: caption,
          published: true,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setPublishResult({
          success: true,
          postId: data.postId,
          postUrl: data.postUrl,
        });
      } else {
        setPublishResult({
          success: false,
          error: data.error || 'ফেসবুক পেজে পোস্ট ব্যর্থ হয়েছে।',
        });
      }
    } catch (err: any) {
      console.error(err);
      setPublishResult({
        success: false,
        error: err.message || 'সার্ভার সমস্যা হয়েছে।',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Facebook className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                ফেসবুক পেজে সরাসরি পোস্ট করুন
              </h2>
              <p className="text-xs text-slate-500">
                {facebookConfig.isConnected && facebookConfig.pageName
                  ? `কানেক্টেড পেজ: ${facebookConfig.pageName}`
                  : 'আপনার ফেসবুক পেজে MCQ ফটো ও ক্যাপশন পাবলিকলি পোস্ট করুন'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!facebookConfig.isConnected ? (
          <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6">
            <Facebook className="w-12 h-12 mx-auto mb-3 text-blue-600 opacity-80" />
            <h3 className="text-sm font-bold text-slate-800">কোনো ফেসবুক পেজ কানেক্ট করা নেই</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              ছবি পোস্ট করার আগে আপনার ফেসবুক পেজের ID এবং Access Token সেটআপ করতে হবে।
            </p>
            <button
              onClick={onOpenSettings}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Facebook className="w-4 h-4" />
              <span>ফেসবুক পেজ সেটিংস সেটআপ করুন</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Image Card Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>পোস্টার প্রিভিউ (Image Preview)</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 font-mono px-2 py-0.5 rounded">
                  1080x1080 HD
                </span>
              </div>
              <div className="bg-slate-100 p-2 rounded-lg border border-slate-200 aspect-square flex items-center justify-center overflow-hidden">
                <img
                  src={imageDataUrl}
                  alt="MCQ Poster"
                  className="max-h-full w-auto object-contain rounded shadow-sm"
                />
              </div>
            </div>

            {/* Right: Caption & Publish Actions */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>পোস্ট ক্যাপশন (Facebook Caption)</span>
                  </span>
                  <button
                    onClick={() => setCaption(buildDefaultCaption(mcq))}
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    অটো রিফ্রেশ
                  </button>
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-sans leading-relaxed"
                />
              </div>

              {/* Status Result Message */}
              {publishResult && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium ${
                    publishResult.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {publishResult.success ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>সফলভাবে ফেসবুক পেজে পোস্ট করা হয়েছে!</span>
                      </div>
                      {publishResult.postUrl && (
                        <a
                          href={publishResult.postUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-bold text-blue-700 hover:underline text-xs"
                        >
                          <span>ফেসবুকে পোস্টটি দেখুন</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{publishResult.error}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={onOpenSettings}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  পেজ চেঞ্জ করুন
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>

                  <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>পোস্ট হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>এখনই পেজে পোস্ট করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
