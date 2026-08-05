import React from 'react';
import { McqItem, DesignConfig } from '../../types';

interface Props {
  mcq: McqItem;
  config: DesignConfig;
  index?: number;
}

export const PlayfulQuizTemplate: React.FC<Props> = ({ mcq, config, index = 1 }) => {
  const options = [
    { label: 'A', text: mcq.optionA, key: 'A' },
    { label: 'B', text: mcq.optionB, key: 'B' },
    { label: 'C', text: mcq.optionC, key: 'C' },
    { label: 'D', text: mcq.optionD, key: 'D' },
  ].filter(opt => opt.text && opt.text.trim().length > 0);

  // Aspect ratio class helper for absolute preview dimensions
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

  return (
    <div
      style={{
        width: `${dim.width}px`,
        height: `${dim.height}px`,
        fontFamily: `"${config.fontFamily}", sans-serif`,
        backgroundColor: config.backgroundColor || '#647cf6',
      }}
      className="relative flex flex-col items-center justify-center p-6 overflow-hidden select-none"
    >
      {/* Decorative background doodles */}
      <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 540 540" fill="none">
        <path d="M 30 50 Q 80 20 120 70 T 200 40" stroke="white" strokeWidth="6" strokeLinecap="round" />
        <path d="M 420 30 Q 480 80 450 150 T 510 220" stroke="white" strokeWidth="6" strokeLinecap="round" />
        <path d="M 40 450 Q 100 500 160 440 T 220 520" stroke="white" strokeWidth="8" strokeLinecap="round" />
        <path d="M 480 420 L 510 450 M 510 420 L 480 450" stroke="white" strokeWidth="6" strokeLinecap="round" />
        <circle cx="80" cy="250" r="18" stroke="white" strokeWidth="5" />
      </svg>

      {/* Facebook style Reaction Bar floating on top */}
      {config.showReactionsBar && (
        <div className="z-20 mb-3 -mt-2 bg-white/95 border-2 border-slate-900 rounded-full px-4 py-1.5 flex items-center gap-2.5 shadow-[3px_3px_0px_#000000] relative">
          <span className="text-lg hover:scale-125 transition-transform">👍</span>
          <span className="text-lg hover:scale-125 transition-transform">❤️</span>
          <span className="text-lg hover:scale-125 transition-transform">😡</span>
          <span className="text-lg hover:scale-125 transition-transform">😮</span>
          <span className="text-lg hover:scale-125 transition-transform">😆</span>
          {/* Yellow cursor arrow pointing to like */}
          <div className="absolute -bottom-3 left-6">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fbbf24" stroke="#000" strokeWidth="1.5">
              <path d="M3 3l7 18 3-7 7-3L3 3z" />
            </svg>
          </div>
        </div>
      )}

      {/* Main double-layer Card container */}
      <div className="relative w-full max-w-[460px] my-auto">
        {/* Shadow Layer */}
        <div 
          className="absolute inset-0 rounded-3xl translate-x-2.5 translate-y-2.5" 
          style={{ backgroundColor: config.primaryColor || '#fbbf24' }}
        />
        
        {/* Main Cream Card */}
        <div
          style={{ backgroundColor: config.cardBgColor || '#fffdf0' }}
          className="relative z-10 rounded-3xl border-2 border-slate-900 p-6 flex flex-col items-center justify-between min-h-[360px] text-slate-900 shadow-sm"
        >
          {/* Interactive Heading Box with Handles */}
          <div className="relative px-6 py-1.5 my-1 border-2 border-blue-500/80 border-dashed rounded-lg flex items-center justify-center">
            {/* Corner Handle Dots */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />

            <h2
              style={{ fontSize: `${config.titleFontSize || 28}px` }}
              className="font-extrabold tracking-tight text-center text-slate-900"
            >
              {config.headerText || 'Quiz Time!'}
            </h2>

            {/* Design Cursor Pointer */}
            <div className="absolute -right-5 -bottom-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24" stroke="#000" strokeWidth="1.5">
                <path d="M3 3l7 18 3-7 7-3L3 3z" />
              </svg>
            </div>
          </div>

          {/* Question Text */}
          <div className="w-full my-4 text-center px-2">
            <p
              style={{ fontSize: `${config.questionFontSize || 18}px` }}
              className="font-bold text-slate-800 leading-snug"
            >
              {mcq.question}
            </p>
          </div>

          {/* Options Vertical Stack */}
          <div className="w-full space-y-2.5 my-2">
            {options.map((opt) => {
              const isCorrect = config.highlightCorrect && (
                mcq.correctAnswer?.toUpperCase() === opt.key || 
                mcq.correctAnswer?.trim() === opt.text.trim()
              );

              return (
                <div
                  key={opt.key}
                  style={{
                    backgroundColor: isCorrect ? '#22c55e' : (config.primaryColor || '#fdbd58'),
                    color: isCorrect ? '#ffffff' : '#0f172a',
                  }}
                  className="w-full rounded-full border-2 border-slate-900 px-3 py-2 flex items-center justify-between shadow-[2px_2px_0px_#000000] transition-all"
                >
                  <div className="flex items-center gap-3 w-full">
                    {/* Circle Badge with Option Letter */}
                    <span className="w-8 h-8 rounded-full bg-white text-slate-900 border-2 border-slate-900 flex items-center justify-center font-extrabold text-sm shrink-0">
                      {opt.label}
                    </span>
                    <span
                      style={{ fontSize: `${config.optionsFontSize || 16}px` }}
                      className="font-semibold text-center flex-1 pr-8 leading-tight truncate"
                    >
                      {opt.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer / Watermark */}
          <div className="w-full pt-2 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>{config.categoryCol || mcq.category || ''}</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 ml-auto">
              <span>{config.footerText || 'Comment your answer'}</span>
              <span className="text-base">💬</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
