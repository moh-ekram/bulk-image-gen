import React from 'react';
import { Layout, Palette, Type, Sliders, CheckSquare, Sparkles } from 'lucide-react';
import { DesignConfig, TemplateId, AspectRatio } from '../types';

interface Props {
  config: DesignConfig;
  onChange: (updatedConfig: DesignConfig) => void;
}

export const TemplateCustomizer: React.FC<Props> = ({ config, onChange }) => {
  const templates: { id: TemplateId; name: string; desc: string; badge: string; color: string }[] = [
    {
      id: 'playful_quiz',
      name: 'Quiz Time! (Playful)',
      desc: 'হলুদ নোটকার্ড, ফেসবুক রিঅ্যাকশন বার ও অপশন বক্স',
      badge: 'ছবি ১ এর মতো',
      color: 'bg-amber-100 text-amber-800 border border-amber-300',
    },
    {
      id: 'classic_bengali',
      name: 'Academic Exam (ক্লাসিক)',
      desc: 'ট্রেডিশনাল প্রশ্নপত্র ফরম্যাট, অর্নেট ডিভাইডার ও নেভি বর্ডার',
      badge: 'ছবি ২ এর মতো',
      color: 'bg-indigo-100 text-indigo-800 border border-indigo-300',
    },
    {
      id: 'aesthetic_story',
      name: 'Aesthetic Story (স্টোরি)',
      desc: 'টিল কালার ক্যানভাস, সেরিফ হেডার ও ফ্লোটিং কার্ড',
      badge: 'ছবি ৩ এর মতো',
      color: 'bg-teal-100 text-teal-800 border border-teal-300',
    },
    {
      id: 'dark_neon',
      name: 'Dark Cyber Neon',
      desc: 'ডার্ক থিম, গ্লোয়িং সায়ান একসেন্ট ও নিওন ব্যাজ',
      badge: 'ডার্ক মোড',
      color: 'bg-slate-900 text-cyan-300 border border-cyan-500',
    },
    {
      id: 'minimal_clean',
      name: 'Minimal Clean White',
      desc: 'সিম্পল ও ক্লিন হাই-কনট্রাস্ট মিনিমাল ডিজাইন',
      badge: 'মিনিমাল',
      color: 'bg-slate-100 text-slate-800 border border-slate-300',
    },
  ];

  const aspectRatios: { id: AspectRatio; label: string; desc: string; iconStr: string }[] = [
    { id: '1:1', label: '1:1 Square', desc: '1080x1080 (FB/Insta Feed)', iconStr: '▢' },
    { id: '4:5', label: '4:5 Portrait', desc: '1080x1350 (Social Post)', iconStr: '▯' },
    { id: '9:16', label: '9:16 Story/Reel', desc: '1080x1920 (Reels/TikTok)', iconStr: '📱' },
  ];

  const fonts = [
    { id: 'Hind Siliguri', name: 'Hind Siliguri (বাংলা স্ট্যান্ডার্ড)' },
    { id: 'Noto Sans Bengali', name: 'Noto Sans Bengali (বাংলা আধুনিক)' },
    { id: 'Tiro Bangla', name: 'Tiro Bangla (বাংলা সেরিফ)' },
    { id: 'Poppins', name: 'Poppins (English Sans)' },
    { id: 'Playfair Display', name: 'Playfair Display (English Serif)' },
    { id: 'Inter', name: 'Inter (Clean Sans)' },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg p-6 shadow-xs text-slate-800 space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded text-indigo-600">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            ডিজাইন ও টেমপ্লেট কাস্টমাইজেশন
          </h2>
          <p className="text-xs text-slate-500">
            স্টাইল, কালার, ফন্ট ও টেক্সট পরিবর্তন করুন
          </p>
        </div>
      </div>

      {/* Template Selection */}
      <div>
        <label className="block text-[11px] font-bold text-indigo-700 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Layout className="w-4 h-4 text-indigo-600" />
          ১. ডিজাইন টেমপ্লেট নির্বাচন করুন
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map((tpl) => {
            const isSelected = config.templateId === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => onChange({ ...config, templateId: tpl.id })}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">{tpl.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${tpl.color}`}>
                      {tpl.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">{tpl.desc}</p>
                </div>

                {isSelected && (
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-indigo-700">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>সিলেক্ট করা হয়েছে</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Aspect Ratio & Font Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Aspect Ratio */}
        <div>
          <label className="block text-[11px] font-bold text-indigo-700 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Layout className="w-4 h-4 text-indigo-600" />
            ২. রেশিও / সাইজ (Aspect Ratio)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {aspectRatios.map((ar) => {
              const isSelected = config.aspectRatio === ar.id;
              return (
                <button
                  key={ar.id}
                  onClick={() => onChange({ ...config, aspectRatio: ar.id })}
                  className={`p-2.5 rounded border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base mb-0.5">{ar.iconStr}</span>
                  <span className="text-xs font-semibold">{ar.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Selection */}
        <div>
          <label className="block text-[11px] font-bold text-indigo-700 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Type className="w-4 h-4 text-indigo-600" />
            ৩. ফন্ট স্টাইল (Font Family)
          </label>
          <select
            value={config.fontFamily}
            onChange={(e) => onChange({ ...config, fontFamily: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
          >
            {fonts.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Header & Footer Custom Text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            হেডার শিরোনাম (Header Title)
          </label>
          <input
            type="text"
            value={config.headerText}
            onChange={(e) => onChange({ ...config, headerText: e.target.value })}
            placeholder="e.g. Quiz Time! / প্রশ্ন:"
            className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            ফুটার বার্তা / ওয়াটারমার্ক (Footer/Call-To-Action)
          </label>
          <input
            type="text"
            value={config.footerText}
            onChange={(e) => onChange({ ...config, footerText: e.target.value })}
            placeholder="e.g. Comment your answer / কমেন্টে উত্তর দিন"
            className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Font Sizes & Options Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            প্রশ্ন ফন্ট সাইজ: <span className="text-indigo-600 font-bold">{config.questionFontSize}px</span>
          </label>
          <input
            type="range"
            min="14"
            max="32"
            value={config.questionFontSize}
            onChange={(e) => onChange({ ...config, questionFontSize: Number(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            অপশন ফন্ট সাইজ: <span className="text-indigo-600 font-bold">{config.optionsFontSize}px</span>
          </label>
          <input
            type="range"
            min="12"
            max="26"
            value={config.optionsFontSize}
            onChange={(e) => onChange({ ...config, optionsFontSize: Number(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-start pt-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={config.highlightCorrect}
              onChange={(e) => onChange({ ...config, highlightCorrect: e.target.checked })}
              className="w-4 h-4 rounded accent-green-600 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-green-600" />
              সঠিক উত্তর সবুজ রঙে হাইলাইট করুন
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
