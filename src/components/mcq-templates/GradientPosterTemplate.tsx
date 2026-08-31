import React from 'react';
import { McqItem, DesignConfig } from '../../types';

interface Props {
  mcq: McqItem;
  config: DesignConfig;
  index?: number;
}

export const GradientPosterTemplate: React.FC<Props> = ({ mcq, config, index = 1 }) => {
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

  const getRadiusClass = () => {
    switch (config.cardCornerRadius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-lg';
      case 'lg': return 'rounded-3xl';
      case 'full': return 'rounded-[32px]';
      case 'md':
      default: return 'rounded-2xl';
    }
  };

  return (
    <div
      style={{
        width: `${dim.width}px`,
        height: `${dim.height}px`,
        fontFamily: `"${config.fontFamily}", sans-serif`,
        background: config.backgroundColor || 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #d946ef 100%)',
      }}
      className="relative flex flex-col items-center justify-between p-7 select-none overflow-hidden"
    >
      {/* Decorative background blur shapes */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-slate-900/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header Badge */}
      <div className="z-10 text-center pt-2">
        <span className="bg-slate-900/20 backdrop-blur-md text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-slate-900/30 shadow-sm inline-block">
          {config.headerText || 'EXAM QUIZ'}
        </span>
      </div>

      {/* Glassmorphism Card */}
      <div
        style={{
          backgroundColor: config.cardBgColor || 'rgba(255, 255, 255, 0.95)',
          color: config.textColor || '#0f172a',
          borderWidth: `${config.borderWidth ?? 1}px`,
          borderColor: config.primaryColor || 'rgba(255, 255, 255, 0.5)',
        }}
        className={`z-10 w-full max-w-[460px] p-6 shadow-2xl flex flex-col justify-between my-auto backdrop-blur-xl ${getRadiusClass()}`}
      >
        {/* Category tag & Index */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded border border-indigo-900">
            {mcq.category || `Question #${index}`}
          </span>
          <span className="text-xs font-bold text-slate-400">
            {config.questionPrefix} #{index}
          </span>
        </div>

        {/* Question Text */}
        <h2
          style={{ fontSize: `${config.questionFontSize || 20}px` }}
          className="font-bold text-white mb-5 leading-snug"
        >
          {mcq.question}
        </h2>

        {/* Options Grid */}
        <div className="space-y-2.5">
          {options.map((opt) => {
            const isCorrect = config.highlightCorrect && (
              mcq.correctAnswer?.toUpperCase() === opt.label ||
              mcq.correctAnswer?.trim() === opt.text.trim()
            );

            return (
              <div
                key={opt.label}
                style={{
                  backgroundColor: isCorrect ? '#22c55e' : '#f8fafc',
                  color: isCorrect ? '#ffffff' : '#1e293b',
                  borderColor: isCorrect ? '#16a34a' : '#e2e8f0',
                }}
                className="flex items-center gap-3 p-3 rounded-xl border transition-all shadow-xs"
              >
                <span
                  className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                    isCorrect
                      ? 'bg-slate-900 text-green-700'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {opt.label}
                </span>
                <span
                  style={{ fontSize: `${config.optionsFontSize || 15}px` }}
                  className="font-semibold leading-tight flex-1"
                >
                  {opt.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer info inside card */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-center">
          <p className="text-xs font-medium text-slate-400 italic">
            {config.footerText || 'Choose the correct answer below'}
          </p>
        </div>
      </div>

      {/* Footer Watermark */}
      <div className="z-10 pb-2 text-center" style={{ opacity: config.watermarkOpacity ?? 0.8 }}>
        <p className="text-xs text-white font-semibold tracking-wider drop-shadow-xs">
          {config.watermarkText || 'MCQ Canvas Studio'}
        </p>
      </div>
    </div>
  );
};
