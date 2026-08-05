import React from 'react';
import { McqItem, DesignConfig } from '../../types';

interface Props {
  mcq: McqItem;
  config: DesignConfig;
  index?: number;
}

export const ModernMagazineTemplate: React.FC<Props> = ({ mcq, config, index = 1 }) => {
  const options = [
    { label: 'A', text: mcq.optionA },
    { label: 'B', text: mcq.optionB },
    { label: 'C', text: mcq.optionC },
    { label: 'D', text: mcq.optionD },
  ].filter(opt => opt.text && opt.text.trim().length > 0);

  const getContainerDimensions = () => {
    switch (config.aspectRatio) {
      case '1:1':
        return { width: 540, height: 540 };
      case '4:5':
        return { width: 540, height: 675 };
      case '9:16':
      default:
        return { width: 540, height: 960 };
    }
  };

  const dim = getContainerDimensions();

  return (
    <div
      style={{
        width: `${dim.width}px`,
        height: `${dim.height}px`,
        fontFamily: `"${config.fontFamily}", "Playfair Display", serif`,
        backgroundColor: config.backgroundColor || '#fafaf9',
        color: config.textColor || '#1c1917',
      }}
      className="relative flex flex-col justify-between p-8 select-none border border-stone-200"
    >
      {/* Decorative Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600" />

      {/* Top Magazine Masthead */}
      <div className="flex items-center justify-between border-b border-stone-300 pb-4 pt-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-700 block">
            {mcq.category || 'DAILY KNOWLEDGE'}
          </span>
          <h1
            style={{ fontSize: `${config.titleFontSize || 22}px` }}
            className="font-bold tracking-tight text-stone-900 font-serif"
          >
            {config.headerText || 'QUIZ EDITORIAL'}
          </h1>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold font-serif text-stone-300">
            #{String(index).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Question Headline */}
      <div className="my-auto py-6">
        <h2
          style={{ fontSize: `${config.questionFontSize || 22}px` }}
          className="font-serif font-semibold text-stone-900 leading-snug mb-8 tracking-tight"
        >
          {mcq.question}
        </h2>

        {/* Minimalist Options */}
        <div className="space-y-3 font-sans">
          {options.map((opt) => {
            const isCorrect = config.highlightCorrect && (
              mcq.correctAnswer?.toUpperCase() === opt.label ||
              mcq.correctAnswer?.trim() === opt.text.trim()
            );

            return (
              <div
                key={opt.label}
                style={{
                  backgroundColor: isCorrect ? '#ecfdf5' : '#ffffff',
                  borderColor: isCorrect ? '#10b981' : '#e7e5e4',
                }}
                className="p-3.5 border rounded-lg flex items-center justify-between transition-all shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                      isCorrect
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-900 text-stone-100'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span
                    style={{ fontSize: `${config.optionsFontSize || 15}px` }}
                    className={`font-medium ${isCorrect ? 'text-emerald-900 font-bold' : 'text-stone-800'}`}
                  >
                    {opt.text}
                  </span>
                </div>
                {isCorrect && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                    Correct
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Editorial Tag */}
      <div className="border-t border-stone-300 pt-4 flex items-center justify-between text-xs text-stone-500 font-sans">
        <span className="italic">{config.footerText || 'Test your knowledge'}</span>
        <span className="font-bold tracking-widest text-stone-800 uppercase text-[11px]">
          {config.watermarkText || 'EDITORIAL JOURNAL'}
        </span>
      </div>
    </div>
  );
};
