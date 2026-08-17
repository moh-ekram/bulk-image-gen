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

export type TShirtSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface TShirtColorOption {
  name: string;
  hex: string;
  textColor: 'light' | 'dark';
}

export interface TShirtProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  stock: number;
  category: string;
  tags?: string[];
  designImage: string; // PNG base64 or URL
  designScale: number; // 20 to 100%
  designPositionY: number; // -50 to 50
  designPositionX: number; // -50 to 50
  designBlendMode?: 'normal' | 'multiply';
  defaultColor: string; // Hex e.g. "#18181b"
  availableColors: string[]; // Hex list
  availableSizes: TShirtSize[];
  mockupStyle?: 'crewneck' | 'oversized' | 'hoodie';
  customMockupImage?: string; // Optional user uploaded photo mockup base
  rating: number;
  reviewsCount: number;
  badge?: string;
  createdAt: number;
  isPublished: boolean;
}

export interface CartItem {
  id: string; // Unique cart item ID (product.id + size + color)
  product: TShirtProduct;
  selectedSize: TShirtSize;
  selectedColor: string;
  quantity: number;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  district: string;
  deliveryFee: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  specialNotes?: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: number;
}

export interface BulkDesignDraft {
  id: string;
  fileName: string;
  designDataUrl: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  stock: number;
  category: string;
  color: string;
  availableSizes: TShirtSize[];
  designScale: number;
  designPositionY: number;
  designPositionX: number;
  mockupStyle?: 'crewneck' | 'oversized' | 'hoodie';
  customMockupImage?: string;
  isSelected: boolean;
}

export interface AdminUser {
  username: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Store Manager' | 'Operations Admin';
  avatar?: string;
  lastLogin?: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  currency: string;
  hotlinePhone: string;
  supportEmail: string;
  address: string;
  deliveryInsideDhaka: number;
  deliveryOutsideDhaka: number;
  freeShippingThreshold: number;
  bkashNumber: string;
  nagadNumber: string;
  enableCod: boolean;
  enableBkash: boolean;
  enableNagad: boolean;
  announcementText: string;
  enableAnnouncement: boolean;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: number;
  orders: CustomerOrder[];
}



