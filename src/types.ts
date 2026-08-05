export type TemplateId = 
  | 'playful_quiz'      // Quiz Time style with reactions
  | 'classic_bengali'   // Classic academic exam paper format
  | 'aesthetic_story'   // Aesthetic story/reel format
  | 'dark_neon'         // Dark futuristic glowing theme
  | 'minimal_clean'     // Minimal white high-contrast style
  | 'gradient_poster'   // Vibrant multi-color gradient poster
  | 'academic_formal'   // Official board exam layout
  | 'modern_magazine'   // Elegant magazine editorial
  | 'tech_terminal';    // Developer console terminal theme

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
  watermarkOpacity: number;
  watermarkPosition: 'bottom' | 'top' | 'center';
  watermarkLogoUrl?: string;
  titleFontSize: number;      // in px relative to base
  questionFontSize: number;   // in px
  optionsFontSize: number;    // in px
  showReactionsBar: boolean;  // for playful template
  showDecorativeBorder: boolean;
  borderWidth: number;        // 0, 1, 2, 4, 8
  cardCornerRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  cardPadding: 'compact' | 'normal' | 'relaxed';
  badgeStyle: 'badge' | 'pill' | 'outline' | 'none';
  questionPrefix: string;     // e.g. "Question:" or "Q:"
  showCategoryTag: boolean;
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

export interface FacebookPageConfig {
  pageId: string;
  pageAccessToken: string;
  pageName?: string;
  pagePictureUrl?: string;
  category?: string;
  followersCount?: number;
  isConnected?: boolean;
}

export interface FacebookPublishOptions {
  caption: string;
  includeAnswerInCaption?: boolean;
  hashtags?: string;
  delaySeconds?: number;
}

