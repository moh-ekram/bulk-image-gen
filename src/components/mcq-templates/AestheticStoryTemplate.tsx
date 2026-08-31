import React from 'react';
import { McqItem, DesignConfig } from '../../types';

interface Props {
  mcq: McqItem;
  config: DesignConfig;
  index?: number;
}

export const AestheticStoryTemplate: React.FC<Props> = ({ mcq, config }) => {
  const options = [
    { label: 'A.', text: mcq.optionA, key: 'A' },
    { label: 'B.', text: mcq.optionB, key: 'B' },
    { label: 'C.', text: mcq.optionC, key: 'C' },
    { label: 'D.', text: mcq.optionD, key: 'D' },
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
        backgroundColor: config.backgroundColor || '#527b7c',
      }}
      className="relative flex flex-col items-center justify-between p-8 select-none overflow-hidden"
    >
      {/* Background soft shadow ambiance */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none" />

      {/* Top Header */}
      <div className="z-10 pt-8 text-center">
        <h1
          style={{ fontSize: `${config.titleFontSize || 32}px` }}
          className="font-normal tracking-[0.2em] text-white uppercase font-serif drop-shadow-sm leading-tight"
        >
          {config.headerText || 'TODAY QUESTION'}
        </h1>
      </div>

      {/* Floating White Center Card */}
      <div
        style={{ backgroundColor: config.cardBgColor || '#ffffff' }}
        className="z-10 w-full max-w-[420px] rounded-sm p-8 shadow-2xl flex flex-col items-center justify-center my-auto border border-slate-900/40"
      >
        {/* Question Text */}
        <h2
          style={{ fontSize: `${config.questionFontSize || 22}px` }}
          className="font-serif text-[#2a4547] text-center font-normal mb-8 leading-snug px-2"
        >
          {mcq.question}
        </h2>

        {/* Full-width Option Bar Strips */}
        <div className="w-full space-y-3 mb-6">
          {options.map((opt) => {
            const isCorrect = config.highlightCorrect && (
              mcq.correctAnswer?.toUpperCase() === opt.key || 
              mcq.correctAnswer?.trim() === opt.text.trim()
            );

            return (
              <div
                key={opt.key}
                style={{
                  backgroundColor: isCorrect ? '#15803d' : (config.primaryColor || '#3e6264'),
                }}
                className="w-full py-3 px-5 text-white flex items-center justify-start gap-4 transition-transform rounded-xs shadow-sm"
              >
                <span className="font-sans font-bold text-sm tracking-wide text-white/90 shrink-0">
                  {opt.label}
                </span>
                <span
                  style={{ fontSize: `${config.optionsFontSize || 16}px` }}
                  className="font-sans font-medium tracking-wide truncate"
                >
                  {opt.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Subtitle / Call to action */}
        <p className="font-serif text-sm text-[#4e7172] text-center italic tracking-wide">
          {config.footerText || 'Tell us in comment section!'}
        </p>
      </div>

      {/* Footer Watermark */}
      <div className="z-10 pb-4 text-center">
        <p className="text-xs text-white/80 font-sans tracking-widest uppercase font-medium">
          {config.watermarkText || 'www.yourwebsite.com'}
        </p>
      </div>
    </div>
  );
};
