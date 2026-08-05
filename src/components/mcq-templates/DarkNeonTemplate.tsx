import React from 'react';
import { McqItem, DesignConfig } from '../../types';

interface Props {
  mcq: McqItem;
  config: DesignConfig;
}

export const DarkNeonTemplate: React.FC<Props> = ({ mcq, config }) => {
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
        fontFamily: `"${config.fontFamily}", "Poppins", sans-serif`,
        backgroundColor: config.backgroundColor || '#090d16',
      }}
      className="relative flex flex-col items-center justify-between p-7 text-white select-none overflow-hidden"
    >
      {/* Background Neon Grid Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(56,189,248,0.15),_transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(168,85,247,0.15),_transparent_60%)] pointer-events-none" />

      {/* Main Card */}
      <div className="z-10 w-full max-w-[480px] my-auto bg-slate-900/90 border border-slate-700/80 rounded-2xl p-7 shadow-[0_0_30px_rgba(56,189,248,0.2)] flex flex-col justify-between min-h-[400px]">
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">
              {config.headerText || 'QUIZ CHALLENGE'}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {mcq.category || 'MCQ'}
          </span>
        </div>

        {/* Question */}
        <div className="my-2">
          <h2
            style={{ fontSize: `${config.questionFontSize || 20}px` }}
            className="font-bold text-slate-100 leading-snug"
          >
            {mcq.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 my-4">
          {options.map((opt) => {
            const isCorrect = config.highlightCorrect && (
              mcq.correctAnswer?.toUpperCase() === opt.key || 
              mcq.correctAnswer?.trim() === opt.text.trim()
            );

            return (
              <div
                key={opt.key}
                className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all ${
                  isCorrect
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                    : 'bg-slate-800/80 border-slate-700 hover:border-cyan-500/50 text-slate-200'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                  isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}>
                  {opt.label}
                </span>
                <span style={{ fontSize: `${config.optionsFontSize || 16}px` }} className="font-medium truncate flex-1">
                  {opt.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{config.watermarkText || 'Interactive Quiz'}</span>
          <span className="text-cyan-400 font-medium">{config.footerText || 'Comment your answer!'}</span>
        </div>
      </div>
    </div>
  );
};
