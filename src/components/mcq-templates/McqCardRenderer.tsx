import React, { forwardRef } from 'react';
import { McqItem, DesignConfig } from '../../types';
import { PlayfulQuizTemplate } from './PlayfulQuizTemplate';
import { ClassicBengaliTemplate } from './ClassicBengaliTemplate';
import { AestheticStoryTemplate } from './AestheticStoryTemplate';
import { DarkNeonTemplate } from './DarkNeonTemplate';
import { MinimalCleanTemplate } from './MinimalCleanTemplate';

interface Props {
  mcq: McqItem;
  config: DesignConfig;
  index?: number;
  className?: string;
}

export const McqCardRenderer = forwardRef<HTMLDivElement, Props>(
  ({ mcq, config, index = 1, className = '' }, ref) => {
    const renderTemplate = () => {
      switch (config.templateId) {
        case 'playful_quiz':
          return <PlayfulQuizTemplate mcq={mcq} config={config} index={index} />;
        case 'classic_bengali':
          return <ClassicBengaliTemplate mcq={mcq} config={config} index={index} />;
        case 'aesthetic_story':
          return <AestheticStoryTemplate mcq={mcq} config={config} index={index} />;
        case 'dark_neon':
          return <DarkNeonTemplate mcq={mcq} config={config} />;
        case 'minimal_clean':
        default:
          return <MinimalCleanTemplate mcq={mcq} config={config} />;
      }
    };

    return (
      <div ref={ref} className={`inline-block ${className}`}>
        {renderTemplate()}
      </div>
    );
  }
);

McqCardRenderer.displayName = 'McqCardRenderer';
