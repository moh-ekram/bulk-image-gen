import React from 'react';
import { McqItem, DesignConfig } from '../../types';

interface Props {
  mcq: McqItem;
  config: DesignConfig;
  index?: number;
}

export const AcademicFormalTemplate: React.FC<Props> = ({ mcq, config, index = 1 }) => {
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
        fontFamily: `"${config.fontFamily}", serif`,
        backgroundColor: config.backgroundColor || '#f1f5f9',
      }}
      className="relative flex flex-col items-center justify-between p-6 select-none border-8 border-slate-700"
    >
      {/* Outer Formal Double Border */}
      <div className="w-full h-full border-2 border-slate-700 p-6 flex flex-col justify-between bg-slate-900 shadow-xl">
        {/* Header Header Bar */}
        <div className="border-b-2 border-slate-800 pb-3 text-center">
          <h1
            style={{ fontSize: `${config.titleFontSize || 24}px` }}
            className="font-bold text-white tracking-wider uppercase font-serif"
          >
            {config.headerText || 'OFFICIAL BOARD EXAMINATION'}
          </h1>
          <p className="text-[11px] text-slate-300 font-sans tracking-widest mt-0.5 uppercase">
            {mcq.category || 'MODEL TEST QUESTION PAPER'}
          </p>
        </div>

        {/* Main Content Area */}
        <div className="my-auto py-4">
          {/* Question Text */}
          <div className="flex items-start gap-2 mb-6">
            <span className="font-bold text-white text-lg font-serif shrink-0">
              {config.questionPrefix || 'Q.'} {index}.
            </span>
            <h2
              style={{ fontSize: `${config.questionFontSize || 19}px` }}
              className="font-bold text-white leading-relaxed font-serif"
            >
              {mcq.question}
            </h2>
          </div>

          {/* Options 2x2 Grid */}
          <div className="grid grid-cols-1 gap-3 font-sans">
            {options.map((opt) => {
              const isCorrect = config.highlightCorrect && (
                mcq.correctAnswer?.toUpperCase() === opt.label ||
                mcq.correctAnswer?.trim() === opt.text.trim()
              );

              return (
                <div
                  key={opt.label}
                  style={{
                    backgroundColor: isCorrect ? '#f0fdf4' : '#ffffff',
                    borderColor: isCorrect ? '#16a34a' : '#cbd5e1',
                  }}
                  className="p-3 border-2 rounded flex items-center gap-3 transition-colors"
                >
                  <span
                    className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs border ${
                      isCorrect
                        ? 'bg-green-600 text-white border-green-700'
                        : 'bg-slate-800 text-slate-100 border-slate-700'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span
                    style={{ fontSize: `${config.optionsFontSize || 15}px` }}
                    className={`font-medium ${isCorrect ? 'text-green-900 font-bold' : 'text-slate-100'}`}
                  >
                    {opt.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t-2 border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-300 font-sans">
          <span>{config.footerText || 'Select one option'}</span>
          <span className="font-bold tracking-wider uppercase text-slate-100">
            {config.watermarkText || 'EXAM STUDIO'}
          </span>
        </div>
      </div>
    </div>
  );
};
