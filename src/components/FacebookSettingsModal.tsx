import React, { useState, useEffect } from 'react';
import { Facebook, CheckCircle2, AlertCircle, RefreshCw, Key, HelpCircle, ExternalLink, X, ShieldCheck, Globe } from 'lucide-react';
import { FacebookPageConfig } from '../types';

interface FacebookSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FacebookPageConfig;
  onSaveConfig: (newConfig: FacebookPageConfig) => void;
}

export const FacebookSettingsModal: React.FC<FacebookSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [pageId, setPageId] = useState(config.pageId || '');
  const [pageAccessToken, setPageAccessToken] = useState(config.pageAccessToken || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [verifiedPage, setVerifiedPage] = useState<Partial<FacebookPageConfig> | null>(
    config.isConnected ? {
      pageName: config.pageName,
      pagePictureUrl: config.pagePictureUrl,
      category: config.category,
      followersCount: config.followersCount,
    } : null
  );

  useEffect(() => {
    setPageId(config.pageId || '');
    setPageAccessToken(config.pageAccessToken || '');
    if (config.isConnected) {
      setVerifiedPage({
        pageName: config.pageName,
        pagePictureUrl: config.pagePictureUrl,
        category: config.category,
        followersCount: config.followersCount,
      });
    }
  }, [config]);

  if (!isOpen) return null;

  const handleVerifyAndSave = async () => {
    if (!pageId.trim()) {
      setStatusMsg({ type: 'error', text: 'অনুগ্রহ করে ফেসবুক পেজ আইডি (Page ID) ইনপুট দিন।' });
      return;
    }
    if (!pageAccessToken.trim()) {
      setStatusMsg({ type: 'error', text: 'অনুগ্রহ করে পেজ এক্সেস টোকেন (Page Access Token) প্রদান করুন।' });
      return;
    }

    setIsVerifying(true);
    setStatusMsg({ type: 'info', text: 'ফেসবুক গ্রাফ এপিআই এর সাথে কানেকশন টেস্ট করা হচ্ছে...' });

    try {
      const res = await fetch(`/api/facebook/verify-page?pageId=${encodeURIComponent(pageId.trim())}&pageAccessToken=${encodeURIComponent(pageAccessToken.trim())}`);
      const data = await res.json();

      if (!data.success) {
        setStatusMsg({ type: 'error', text: data.error || 'ফেসবুক পেজ কানেক্ট করা সম্ভব হয়নি। এক্সেস টোকেন এবং পেজ আইডি সঠিক আছে কি না চেক করুন।' });
        setVerifiedPage(null);
      } else {
        const pageData = data.page;
        setVerifiedPage({
          pageName: pageData.name,
          pagePictureUrl: pageData.pictureUrl,
          category: pageData.category,
          followersCount: pageData.followersCount,
        });

        const newCfg: FacebookPageConfig = {
          pageId: pageId.trim(),
          pageAccessToken: pageAccessToken.trim(),
          pageName: pageData.name,
          pagePictureUrl: pageData.pictureUrl,
          category: pageData.category,
          followersCount: pageData.followersCount,
          isConnected: true,
        };

        onSaveConfig(newCfg);
        setStatusMsg({ type: 'success', text: `সফলভাবে ${pageData.name} পেজের সাথে সংযুক্ত হয়েছে!` });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ type: 'error', text: 'সার্ভার কানেকশনে সমস্যা হয়েছে: ' + err.message });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-slate-800 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Facebook className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                ফেসবুক পেজ অটো-পোস্টিং সেটআপ
                <span className="text-[10px] bg-blue-900 text-blue-300 font-bold px-2 py-0.5 rounded uppercase">
                  Facebook Graph API
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                এক ক্লিকে আপনার ফেসবুক পেজে অটোমেটিক MCQ ফটো পোস্ট ও শিডিউল করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Connected Page Badge Status */}
        {verifiedPage && (
          <div className="mb-5 p-4 bg-emerald-950 border border-emerald-800 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              {verifiedPage.pagePictureUrl ? (
                <img
                  src={verifiedPage.pagePictureUrl}
                  alt={verifiedPage.pageName}
                  className="w-11 h-11 rounded-full border border-emerald-700 object-cover"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                  FB
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-sm">{verifiedPage.pageName}</h3>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-slate-300">
                  {verifiedPage.category || 'Facebook Page'} • {verifiedPage.followersCount ? `${verifiedPage.followersCount} Followers` : 'Active'}
                </p>
              </div>
            </div>
            <span className="text-[11px] bg-emerald-900 text-emerald-300 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              সংযুক্ত আছে
            </span>
          </div>
        )}

        {/* Form Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center justify-between">
              <span>ফেসবুক পেজ আইডি (Page ID) <span className="text-red-500">*</span></span>
              <a
                href="https://www.facebook.com/me/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
              >
                <Globe className="w-3 h-3" />
                Page ID কিভাবে পাবেন?
              </a>
            </label>
            <input
              type="text"
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
              placeholder="যেমন: 1002348192301"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center justify-between">
              <span>পেজ এক্সেস টোকেন (Page Access Token) <span className="text-red-500">*</span></span>
              <span className="text-[11px] text-slate-400 font-mono">pages_manage_posts</span>
            </label>
            <textarea
              value={pageAccessToken}
              onChange={(e) => setPageAccessToken(e.target.value)}
              placeholder="EAAG..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-blue-600 font-mono break-all"
            />
          </div>

          {/* Status Message */}
          {statusMsg && (
            <div
              className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : statusMsg.type === 'error'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-blue-950 text-blue-300 border border-blue-800'
              }`}
            >
              {statusMsg.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
              {statusMsg.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
              {statusMsg.type === 'info' && <RefreshCw className="w-4 h-4 shrink-0 text-blue-400 animate-spin" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              বন্ধ করুন
            </button>
            <button
              onClick={handleVerifyAndSave}
              disabled={isVerifying}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>যাচাই ও কানেক্ট করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step-by-Step Guide for Getting Facebook Access Token */}
        <div className="mt-6 pt-5 border-t border-slate-800 bg-slate-950/80 p-4 rounded-lg border border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>কিভাবে ফেসবুক পেজ এক্সেস টোকেন (Page Access Token) তৈরি করবেন?</span>
          </h4>
          <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
            <li>
              <a
                href="https://developers.facebook.com/tools/explorer/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 font-semibold hover:underline inline-flex items-center gap-1"
              >
                Meta Graph API Explorer <ExternalLink className="w-3 h-3" />
              </a> এ প্রবেশ করুন।
            </li>
            <li>আপনার Facebook App এবং সংশ্লিষ্ট <strong className="text-slate-100">Facebook Page</strong> টি সিলেক্ট করুন।</li>
            <li>
              Permissions মেনু থেকে <code className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-blue-400 font-bold">pages_manage_posts</code> এবং <code className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-blue-400 font-bold">pages_read_engagement</code> পারমিশন যোগ করে <strong className="text-slate-100">Generate Access Token</strong> এ ক্লিক করুন।
            </li>
            <li>জেনারেট হওয়া টোকেনটি কপি করে উপরের বক্সে পেস্ট করুন।</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
