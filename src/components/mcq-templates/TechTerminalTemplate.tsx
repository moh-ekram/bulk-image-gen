import React from 'react';
import { McqItem, DesignConfig } from '../../types';

interface Props {
  mcq: McqItem;
  config: DesignConfig;
  index?: number;
}

export const TechTerminalTemplate: React.FC<Props> = ({ mcq, config, index = 1 }) => {
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
        fontFamily: `"${config.fontFamily}", monospace`,
        backgroundColor: config.backgroundColor || '#090d16',
        color: config.textColor || '#38bdf8',
      }}
      className="relative flex flex-col justify-between p-6 select-none border-2 border-sky-900 overflow-hidden"
    >
      {/* Terminal Window Header Bar */}
      <div className="bg-black border border-sky-800/80 rounded-t-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
          <span className="text-xs font-mono text-sky-400 font-bold ml-2">
            bash ~ {config.headerText || 'mcq-cli --test'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          [{index}]
        </span>
      </div>

      {/* Terminal Body Container */}
      <div className="bg-slate-950/90 border-x border-b border-sky-800/80 rounded-b-lg p-6 flex-1 flex flex-col justify-between my-auto">
        <div>
          {/* Question Display */}
          <div className="mb-6 space-y-2">
            <div className="text-xs font-mono text-emerald-400 flex items-center gap-2">
              <span>$</span>
              <span className="text-slate-400">exec question_query</span>
            </div>
            <h2
              style={{ fontSize: `${config.questionFontSize || 18}px` }}
              className="font-mono font-bold text-white leading-relaxed pl-4 border-l-2 border-sky-500"
            >
              {mcq.question}
            </h2>
          </div>

          {/* Options CLI list */}
          <div className="space-y-3 font-mono">
            {options.map((opt) => {
              const isCorrect = config.highlightCorrect && (
                mcq.correctAnswer?.toUpperCase() === opt.label ||
                mcq.correctAnswer?.trim() === opt.text.trim()
              );

              return (
                <div
                  key={opt.label}
                  style={{
                    backgroundColor: isCorrect ? 'rgba(34, 197, 94, 0.15)' : 'rgba(15, 23, 42, 0.8)',
                    borderColor: isCorrect ? '#22c55e' : '#1e293b',
                  }}
                  className="p-3 border rounded flex items-center gap-3 transition-colors"
                >
                  <span
                    className={`font-mono font-bold text-xs px-2 py-1 rounded ${
                      isCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-sky-950 text-sky-400 border border-sky-800'
                    }`}
                  >
                    [{opt.label}]
                  </span>
                  <span
                    style={{ fontSize: `${config.optionsFontSize || 14}px` }}
                    className={`font-mono ${isCorrect ? 'text-green-400 font-bold' : 'text-slate-200'}`}
                  >
                    {opt.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>&gt; {config.footerText || 'Input choice [A-D]'}</span>
          <span className="text-sky-400 font-bold">
            {config.watermarkText || 'DEV_STUDIO'}
          </span>
        </div>
      </div>
    </div>
  );
};
