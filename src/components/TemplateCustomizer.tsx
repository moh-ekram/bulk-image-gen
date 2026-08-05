import React from 'react';
import { Layout, Palette, Type, Sliders, CheckSquare, Sparkles, Shield, Maximize2, Layers } from 'lucide-react';
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
      desc: 'Yellow note card with social reaction icons & bold option pills',
      badge: 'Playful',
      color: 'bg-amber-100 text-amber-800 border border-amber-300',
    },
    {
      id: 'classic_bengali',
      name: 'Academic Exam',
      desc: 'Classic exam paper layout with ornate dividers & navy borders',
      badge: 'Academic',
      color: 'bg-indigo-100 text-indigo-800 border border-indigo-300',
    },
    {
      id: 'aesthetic_story',
      name: 'Aesthetic Story',
      desc: 'Teal canvas with elegant serif headers for social reels',
      badge: 'Social Story',
      color: 'bg-teal-100 text-teal-800 border border-teal-300',
    },
    {
      id: 'gradient_poster',
      name: 'Gradient Poster (NEW)',
      desc: 'Vibrant multi-color gradient canvas with glassmorphism card',
      badge: 'Vibrant',
      color: 'bg-purple-100 text-purple-800 border border-purple-300',
    },
    {
      id: 'academic_formal',
      name: 'Board Exam Formal (NEW)',
      desc: 'Official double-border academic test layout with crisp typography',
      badge: 'Official',
      color: 'bg-slate-100 text-slate-900 border border-slate-300',
    },
    {
      id: 'modern_magazine',
      name: 'Modern Magazine (NEW)',
      desc: 'Editorial journal style with top accent line & serif headline',
      badge: 'Editorial',
      color: 'bg-stone-100 text-stone-800 border border-stone-300',
    },
    {
      id: 'tech_terminal',
      name: 'Tech Terminal (NEW)',
      desc: 'Developer console code terminal theme with green highlights',
      badge: 'Terminal',
      color: 'bg-sky-950 text-sky-300 border border-sky-800',
    },
    {
      id: 'dark_neon',
      name: 'Dark Cyber Neon',
      desc: 'Dark theme with glowing cyan accents & neon option badges',
      badge: 'Dark Mode',
      color: 'bg-slate-900 text-cyan-300 border border-cyan-500',
    },
    {
      id: 'minimal_clean',
      name: 'Minimal Clean White',
      desc: 'Simple high-contrast white layout for maximum readability',
      badge: 'Minimal',
      color: 'bg-slate-100 text-slate-800 border border-slate-300',
    },
  ];

  const aspectRatios: { id: AspectRatio; label: string; desc: string; iconStr: string }[] = [
    { id: '1:1', label: '1:1 Square', desc: '1080x1080 (Feed)', iconStr: '▢' },
    { id: '4:5', label: '4:5 Portrait', desc: '1080x1350 (Post)', iconStr: '▯' },
    { id: '9:16', label: '9:16 Story/Reel', desc: '1080x1920 (Reels/TikTok)', iconStr: '📱' },
  ];

  const fonts = [
    { id: 'Hind Siliguri', name: 'Hind Siliguri (Bengali Standard)' },
    { id: 'Noto Sans Bengali', name: 'Noto Sans Bengali (Bengali Modern)' },
    { id: 'Tiro Bangla', name: 'Tiro Bangla (Bengali Serif)' },
    { id: 'Poppins', name: 'Poppins (English Sans)' },
    { id: 'Playfair Display', name: 'Playfair Display (English Serif)' },
    { id: 'Inter', name: 'Inter (Clean Sans)' },
  ];

  const presetColors = [
    '#647cf6', '#4f46e5', '#0284c7', '#0d9488', '#16a34a',
    '#ca8a04', '#ea580c', '#e11d48', '#9333ea', '#1e293b'
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
            Design & Template Customization
          </h2>
          <p className="text-xs text-slate-500">
            Choose templates, adjust layout dimensions, colors, fonts, and borders
          </p>
        </div>
      </div>

      {/* Template Selection */}
      <div>
        <label className="block text-[11px] font-bold text-indigo-700 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Layout className="w-4 h-4 text-indigo-600" />
          1. Select Design Template ({templates.length} Templates Available)
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
                    <span>Active Template</span>
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
            <Maximize2 className="w-4 h-4 text-indigo-600" />
            2. Canvas Aspect Ratio
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
                  <span className="text-[10px] text-slate-400">{ar.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Selection */}
        <div>
          <label className="block text-[11px] font-bold text-indigo-700 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Type className="w-4 h-4 text-indigo-600" />
            3. Typography Font Family
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

          {/* Question Prefix Option */}
          <div className="mt-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Question Numbering Prefix
            </label>
            <input
              type="text"
              value={config.questionPrefix}
              onChange={(e) => onChange({ ...config, questionPrefix: e.target.value })}
              placeholder="e.g. Question: or Q."
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Header & Footer Custom Text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Header Title Text
          </label>
          <input
            type="text"
            value={config.headerText}
            onChange={(e) => onChange({ ...config, headerText: e.target.value })}
            placeholder="e.g. Quiz Time! or EXAM QUESTION"
            className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Footer / Call-To-Action Subtitle
          </label>
          <input
            type="text"
            value={config.footerText}
            onChange={(e) => onChange({ ...config, footerText: e.target.value })}
            placeholder="e.g. Comment your answer below"
            className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Color Customization Palette */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-[11px] font-bold text-indigo-700 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-600" />
          4. Custom Theme Color Palette
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Accent Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => onChange({ ...config, primaryColor: e.target.value })}
                className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0"
              />
              <input
                type="text"
                value={config.primaryColor}
                onChange={(e) => onChange({ ...config, primaryColor: e.target.value })}
                className="flex-1 bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-mono text-slate-900 uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.backgroundColor.startsWith('#') ? config.backgroundColor : '#647cf6'}
                onChange={(e) => onChange({ ...config, backgroundColor: e.target.value })}
                className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0"
              />
              <input
                type="text"
                value={config.backgroundColor}
                onChange={(e) => onChange({ ...config, backgroundColor: e.target.value })}
                className="flex-1 bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-mono text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Watermark / Branding Tag
            </label>
            <input
              type="text"
              value={config.watermarkText}
              onChange={(e) => onChange({ ...config, watermarkText: e.target.value })}
              placeholder="e.g. MCQ Canvas Studio"
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-900"
            />
          </div>
        </div>

        {/* Preset palette buttons */}
        <div className="flex items-center gap-1.5 mt-3">
          <span className="text-[11px] font-semibold text-slate-500 mr-2">Quick Presets:</span>
          {presetColors.map((color) => (
            <button
              key={color}
              onClick={() => onChange({ ...config, primaryColor: color, backgroundColor: color })}
              style={{ backgroundColor: color }}
              className="w-6 h-6 rounded-full border border-white shadow-xs cursor-pointer hover:scale-110 transition-transform"
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Font Sizes & Options Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Question Font Size: <span className="text-indigo-600 font-bold">{config.questionFontSize}px</span>
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
            Options Font Size: <span className="text-indigo-600 font-bold">{config.optionsFontSize}px</span>
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
              Highlight Correct Answer in Green
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

