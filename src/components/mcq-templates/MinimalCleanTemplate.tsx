import React from 'react';
import { McqItem, DesignConfig } from '../../types';

interface Props {
  mcq: McqItem;
  config: DesignConfig;
}

export const MinimalCleanTemplate: React.FC<Props> = ({ mcq, config }) => {
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

  return (
    <div
      style={{
        width: `${dim.width}px`,
        height: `${dim.height}px`,
        fontFamily: `"${config.fontFamily}", "Inter", sans-serif`,
        backgroundColor: config.backgroundColor || '#f8fafc',
      }}
      className="relative flex flex-col items-center justify-between p-8 text-slate-900 select-none"
    >
      <div className="w-full max-w-[480px] h-full my-auto bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm flex flex-col justify-between">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {config.headerText || 'MULTIPLE CHOICE'}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {mcq.category || ''}
          </span>
        </div>

        {/* Question */}
        <div className="my-auto py-4">
          <h2
            style={{ fontSize: `${config.questionFontSize || 22}px` }}
            className="font-bold text-slate-800 leading-snug"
          >
            {mcq.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 my-2">
          {options.map((opt) => {
            const isCorrect = config.highlightCorrect && (
              mcq.correctAnswer?.toUpperCase() === opt.key || 
              mcq.correctAnswer?.trim() === opt.text.trim()
            );

            return (
              <div
                key={opt.key}
                className={`w-full p-3.5 rounded-xl border flex items-center gap-3.5 transition-all ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                    : 'bg-slate-50/80 border-slate-200 text-slate-800'
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {opt.label}
                </span>
                <span style={{ fontSize: `${config.optionsFontSize || 16}px` }} className="font-semibold truncate flex-1">
                  {opt.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{config.watermarkText || 'MCQ Builder'}</span>
          <span className="font-medium text-slate-700">{config.footerText || 'Comment your answer'}</span>
        </div>
      </div>
    </div>
  );
};
