import React from 'react';
import { McqItem, DesignConfig } from '../../types';

interface Props {
  mcq: McqItem;
  config: DesignConfig;
  index?: number;
}

export const ClassicBengaliTemplate: React.FC<Props> = ({ mcq, config }) => {
  const options = [
    { label: 'A', text: mcq.optionA, key: 'A' },
    { label: 'B', text: mcq.optionB, key: 'B' },
    { label: 'C', text: mcq.optionC, key: 'C' },
    { label: 'D', text: mcq.optionD, key: 'D' },
  ].filter(opt => opt.text && opt.text.trim().length > 0);

  const getContainerDimensions = () => {
    switch (config.aspectRatio) {
      case '4:5':
        return { width: 540, height: 675 };
      case '9:16':
        return { width: 540, height: 960 };
      case '1:1':
      default:
        return { width: 540, height: 540 };
    }
  };

  const dim = getContainerDimensions();
  const prefix = config.questionPrefix || 'প্রশ্ন:';

  return (
    <div
      style={{
        width: `${dim.width}px`,
        height: `${dim.height}px`,
        fontFamily: `"${config.fontFamily}", "Hind Siliguri", sans-serif`,
        backgroundColor: config.backgroundColor || '#f4f5f7',
      }}
      className="relative flex flex-col items-center justify-center p-6 select-none"
    >
      {/* Outer Border Container */}
      <div
        style={{ backgroundColor: config.cardBgColor || '#f8f9fa' }}
        className="w-full h-full max-w-[500px] max-h-[500px] my-auto rounded-3xl border-4 border-[#1e3a8a] p-8 flex flex-col justify-between relative shadow-lg overflow-hidden"
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_0.75px,transparent_0.75px)] [background-size:16px_16px] opacity-5 pointer-events-none" />

        {/* Header / Question Section */}
        <div className="z-10 w-full pt-2">
          <div className="flex items-start gap-2">
            <h2
              style={{ fontSize: `${config.questionFontSize || 22}px` }}
              className="font-bold text-[#0f172a] leading-relaxed tracking-normal"
            >
              <span className="text-red-600 font-extrabold mr-2">{prefix}</span>
              {mcq.question}
            </h2>
          </div>

          {/* Ornate Golden Flourish Divider Line */}
          <div className="my-5 flex items-center justify-center gap-3">
            <div className="h-[1.5px] bg-gradient-to-r from-transparent via-[#d97706] to-transparent flex-1" />
            <svg width="32" height="18" viewBox="0 0 40 20" fill="none">
              <path d="M20 0 C25 10 35 10 40 10 C35 10 25 10 20 20 C15 10 5 10 0 10 C5 10 15 10 20 0 Z" fill="#d97706" />
              <circle cx="20" cy="10" r="3" fill="#b45309" />
            </svg>
            <div className="h-[1.5px] bg-gradient-to-r from-transparent via-[#d97706] to-transparent flex-1" />
          </div>
        </div>

        {/* Options List */}
        <div className="z-10 w-full space-y-4 my-auto px-2">
          {options.map((opt) => {
            const isCorrect = config.highlightCorrect && (
              mcq.correctAnswer?.toUpperCase() === opt.key || 
              mcq.correctAnswer?.trim() === opt.text.trim()
            );

            return (
              <div
                key={opt.key}
                className={`flex items-center gap-4 py-1.5 px-3 rounded-xl transition-colors ${
                  isCorrect ? 'bg-emerald-100 border border-emerald-500' : ''
                }`}
              >
                {/* Letter Circle Badge */}
                <div
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-extrabold text-lg shrink-0 ${
                    isCorrect
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-[#1e3a8a] text-[#1e3a8a] bg-white'
                  }`}
                >
                  {opt.label}
                </div>

                {/* Option Text */}
                <span
                  style={{ fontSize: `${config.optionsFontSize || 20}px` }}
                  className={`font-semibold leading-normal ${
                    isCorrect ? 'text-emerald-900 font-bold' : 'text-[#0f172a]'
                  }`}
                >
                  {opt.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="z-10 w-full pt-4 mt-auto border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>{mcq.category || config.watermarkText || 'MCQ Quiz'}</span>
          <span className="font-semibold text-slate-700">{config.footerText || 'উত্তর জানা থাকলে কমেন্ট করুন'}</span>
        </div>
      </div>
    </div>
  );
};
