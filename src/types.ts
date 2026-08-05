export type TemplateId = 
  | 'playful_quiz'      // Image 1 style: Quiz Time, reaction bar, yellow note card
  | 'classic_bengali'   // Image 2 style: Academic Bengali format with ornate divider
  | 'aesthetic_story'   // Image 3 style: Teal aesthetic story/reel format
  | 'dark_neon'         // Sleek dark futuristic gaming theme
  | 'minimal_clean';    // Minimal white high-contrast style

export type AspectRatio = '1:1' | '4:5' | '9:16';

export interface McqItem {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer?: 'A' | 'B' | 'C' | 'D' | string;
  category?: string;
  explanation?: string;
}

export interface DesignConfig {
  templateId: TemplateId;
  aspectRatio: AspectRatio;
  headerText: string;
  footerText: string;
  fontFamily: string;
  primaryColor: string;
  backgroundColor: string;
  cardBgColor: string;
  textColor: string;
  highlightCorrect: boolean;
  correctBadgeColor: string;
  watermarkText: string;
  watermarkLogoUrl?: string;
  titleFontSize: number;      // in px relative to base
  questionFontSize: number;   // in px
  optionsFontSize: number;    // in px
  showReactionsBar: boolean;  // for playful template
  showDecorativeBorder: boolean;
  questionPrefix: string;     // e.g. "প্রশ্ন:" or "Question:"
}

export interface ExcelColumnMapping {
  questionCol: string;
  optionACol: string;
  optionBCol: string;
  optionCCol: string;
  optionDCol: string;
  correctCol?: string;
  categoryCol?: string;
}

export interface GeneratedImageResult {
  id: string;
  mcq: McqItem;
  dataUrl: string;
  blob: Blob;
  filename: string;
}
