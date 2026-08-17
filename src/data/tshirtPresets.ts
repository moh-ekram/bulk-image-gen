import { TShirtColorOption, TShirtProduct, TShirtSize } from '../types';

export const TSHIRT_COLORS: TShirtColorOption[] = [
  { name: 'Jet Black', hex: '#18181b', textColor: 'light' },
  { name: 'Heather Charcoal', hex: '#27272a', textColor: 'light' },
  { name: 'Deep Navy', hex: '#0f172a', textColor: 'light' },
  { name: 'Maroon Red', hex: '#450a0a', textColor: 'light' },
  { name: 'Forest Green', hex: '#064e3b', textColor: 'light' },
  { name: 'Pure White', hex: '#f8fafc', textColor: 'dark' },
  { name: 'Heather Grey', hex: '#94a3b8', textColor: 'dark' },
  { name: 'Royal Blue', hex: '#1e3a8a', textColor: 'light' },
  { name: 'Crimson Red', hex: '#991b1b', textColor: 'light' },
  { name: 'Mustard Yellow', hex: '#d97706', textColor: 'light' },
  { name: 'Olive Green', hex: '#365314', textColor: 'light' },
  { name: 'Desert Sand', hex: '#d6c7b2', textColor: 'dark' },
];

export const TSHIRT_CATEGORIES = [
  'All',
  'Bengali Typography',
  'Tech & Code',
  'Anime & Pop Art',
  'Minimalist & Aesthetic',
  'Vintage & Retro',
  'Quotes & Motivation',
];

export const TSHIRT_SIZES: TShirtSize[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const SIZE_CHART = [
  { size: 'S', chest: '38 inch', length: '26 inch', sleeve: '8 inch' },
  { size: 'M', chest: '40 inch', length: '27 inch', sleeve: '8.5 inch' },
  { size: 'L', chest: '42 inch', length: '28 inch', sleeve: '9 inch' },
  { size: 'XL', chest: '44 inch', length: '29 inch', sleeve: '9.5 inch' },
  { size: 'XXL', chest: '46 inch', length: '30 inch', sleeve: '10 inch' },
];

// Helper to generate SVG Data URIs for clean sample graphic artworks
const createGraphicSvgUri = (
  text: string,
  subText: string,
  accentColor: string,
  bgColor: string = 'transparent',
  iconSvg: string = ''
): string => {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
    <rect width="500" height="500" fill="${bgColor}"/>
    <g transform="translate(250, 250)">
      ${iconSvg}
      <text x="0" y="30" font-family="'Hind Siliguri', 'Segoe UI', sans-serif" font-size="44" font-weight="900" text-anchor="middle" fill="${accentColor}">${text}</text>
      <text x="0" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="700" letter-spacing="3" text-anchor="middle" fill="#ffffff" opacity="0.9">${subText}</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

export const SAMPLE_GRAPHIC_DESIGNS = [
  {
    name: 'চা খোর (Tea Lover Bangla)',
    category: 'Bengali Typography',
    title: 'চা খোর (Tea Lover) Premium Graphic Tee',
    price: 490,
    originalPrice: 750,
    dataUrl: createGraphicSvgUri(
      'চা খোর',
      'TEA OVER EVERYTHING • ESTD 2026',
      '#f59e0b',
      'transparent',
      `<path d="M-60,-80 C-60,-120 60,-120 60,-80 L50,0 C50,20 -50,20 -50,0 Z M60,-60 C90,-60 90,-20 60,-20" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>
       <path d="M-25,-140 Q-35,-160 -25,-180 M0,-140 Q-10,-165 0,-185 M25,-140 Q15,-160 25,-180" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.7"/>`
    ),
  },
  {
    name: 'স্বাধীনতা (Freedom Typography)',
    category: 'Bengali Typography',
    title: 'স্বাধীনতা (Shadhinota) Red & Green Special Edition',
    price: 550,
    originalPrice: 850,
    dataUrl: createGraphicSvgUri(
      'স্বাধীনতা',
      'FREEDOM • BANGLADESH 1971',
      '#ef4444',
      'transparent',
      `<circle cx="0" cy="-60" r="65" fill="#10b981" opacity="0.85"/>
       <polygon points="0,-110 18,-60 70,-60 28,-30 45,20 0,-10 -45,20 -28,-30 -70,-60 -18,-60" fill="#ef4444"/>`
    ),
  },
  {
    name: 'Eat Sleep Code Repeat',
    category: 'Tech & Code',
    title: 'Eat Sleep Code Repeat - Developer Edition Tee',
    price: 520,
    originalPrice: 800,
    dataUrl: createGraphicSvgUri(
      '&lt;CODE /&gt;',
      'EAT • SLEEP • CODE • REPEAT',
      '#38bdf8',
      'transparent',
      `<rect x="-70" y="-120" width="140" height="80" rx="10" fill="none" stroke="#38bdf8" stroke-width="6"/>
       <polyline points="-40,-80 -20,-60 -40,-40" fill="none" stroke="#38bdf8" stroke-width="5" stroke-linecap="round"/>
       <line x1="-10" y1="-40" x2="10" y2="-40" stroke="#38bdf8" stroke-width="5" stroke-linecap="round"/>`
    ),
  },
  {
    name: 'Cyber Samurai (Tokyo 2099)',
    category: 'Anime & Pop Art',
    title: 'Cyber Samurai Neon Kanji Edition',
    price: 590,
    originalPrice: 890,
    dataUrl: createGraphicSvgUri(
      'サムライ 2099',
      'CYBERPUNK SAMURAI • NEO TOKYO',
      '#ec4899',
      'transparent',
      `<circle cx="0" cy="-60" r="60" fill="none" stroke="#ec4899" stroke-width="5"/>
       <polygon points="0,-110 40,-30 -40,-30" fill="#8b5cf6" opacity="0.8"/>
       <path d="M-60,-20 L60,-20 M-40,-5 L40,-5 M-20,10 L20,10" stroke="#ec4899" stroke-width="4"/>`
    ),
  },
  {
    name: 'Astronaut in Deep Space',
    category: 'Vintage & Retro',
    title: 'Cosmic Wanderer Vintage Astronaut Tee',
    price: 560,
    originalPrice: 820,
    dataUrl: createGraphicSvgUri(
      'COSMIC VOYAGER',
      'EXPLORE THE UNKNOWN • ORBIT 01',
      '#a855f7',
      'transparent',
      `<circle cx="0" cy="-60" r="50" fill="#1e1b4b" stroke="#a855f7" stroke-width="6"/>
       <ellipse cx="0" cy="-60" rx="35" ry="25" fill="#38bdf8" opacity="0.85"/>
       <circle cx="20" cy="-70" r="8" fill="#ffffff" opacity="0.6"/>
       <path d="M-30,-20 C-30,20 30,20 30,-20" fill="none" stroke="#a855f7" stroke-width="6"/>`
    ),
  },
  {
    name: 'Keep Moving Forward',
    category: 'Quotes & Motivation',
    title: 'Keep Moving Forward - Minimalist Typo Tee',
    price: 499,
    originalPrice: 750,
    dataUrl: createGraphicSvgUri(
      'UNSTOPPABLE',
      'NEVER LOOK BACK • KEEP MOVING',
      '#10b981',
      'transparent',
      `<polygon points="-50,-80 0,-110 50,-80 50,-50 0,-20 -50,-50" fill="none" stroke="#10b981" stroke-width="6"/>
       <polygon points="-25,-70 0,-85 25,-70 25,-55 0,-40 -25,-55" fill="#10b981" opacity="0.5"/>`
    ),
  },
];

export const INITIAL_PUBLISHED_PRODUCTS: TShirtProduct[] = [
  {
    id: 'prod_1',
    title: 'চা খোর (Tea Lover) - প্রিমিয়াম বাংলা টাইপোগ্রাফি টিশার্ট',
    description: '১৮০+ জিএসএম ১০০% পিওর কম্বড কটন ফেব্রিক। নিখুঁত ডিটিএফ প্রিন্ট যা ১০০ ওয়াশের পরও নষ্ট হবে না। ক্যাজুয়াল আড্ডা ও প্রতিদিনের ব্যবহারের জন্য সেরা।',
    price: 490,
    originalPrice: 750,
    stock: 45,
    category: 'Bengali Typography',
    tags: ['চা খোর', 'বাংলা', 'কটন', 'বেস্টসেলার'],
    designImage: SAMPLE_GRAPHIC_DESIGNS[0].dataUrl,
    designScale: 56,
    designPositionY: -5,
    designPositionX: 0,
    designBlendMode: 'normal',
    defaultColor: '#18181b',
    availableColors: ['#18181b', '#0f172a', '#450a0a', '#064e3b', '#94a3b8'],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    mockupStyle: 'crewneck',
    rating: 4.9,
    reviewsCount: 128,
    badge: '🔥 বেস্টসেলার',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    isPublished: true,
  },
  {
    id: 'prod_2',
    title: 'স্বাধীনতা (Shadhinota) লাল-সবুজ স্পেশাল এডিশন টিশার্ট',
    description: 'দেশপ্রেম ও বিজয়ের রঙে রাঙানো প্রিমিয়াম ড্রপ শোল্ডার টিশার্ট। প্রিমিয়াম রিংস্পান কটন ফ্যাব্রিক ও লাইভ কালার ডিটেইলিং।',
    price: 550,
    originalPrice: 850,
    stock: 60,
    category: 'Bengali Typography',
    tags: ['স্বাধীনতা', 'বাংলাদেশ', '১৯৭১'],
    designImage: SAMPLE_GRAPHIC_DESIGNS[1].dataUrl,
    designScale: 54,
    designPositionY: -6,
    designPositionX: 0,
    designBlendMode: 'normal',
    defaultColor: '#18181b',
    availableColors: ['#18181b', '#064e3b', '#450a0a', '#f8fafc', '#27272a'],
    availableSizes: ['M', 'L', 'XL', 'XXL'],
    mockupStyle: 'crewneck',
    rating: 5.0,
    reviewsCount: 84,
    badge: '★ টপ রেটেড',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    isPublished: true,
  },
  {
    id: 'prod_3',
    title: 'Eat Sleep Code Repeat - প্রোগ্রামার স্পেশাল টিশার্ট',
    description: 'কোডার ও ডেভেলপারদের জন্য পারফেক্ট মিনিমালিস্ট ডার্ক মোড গ্রাফিক টিশার্ট। কমফোর্টেবল ব্রিদেবল ফেব্রিক।',
    price: 520,
    originalPrice: 800,
    stock: 35,
    category: 'Tech & Code',
    tags: ['Coding', 'Developer', 'Tech', 'Cyber'],
    designImage: SAMPLE_GRAPHIC_DESIGNS[2].dataUrl,
    designScale: 52,
    designPositionY: -8,
    designPositionX: 0,
    designBlendMode: 'normal',
    defaultColor: '#18181b',
    availableColors: ['#18181b', '#0f172a', '#27272a', '#1e3a8a'],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    mockupStyle: 'crewneck',
    rating: 4.8,
    reviewsCount: 96,
    badge: '💻 কোডারস চয়েস',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
    isPublished: true,
  },
  {
    id: 'prod_4',
    title: 'Cyber Samurai 2099 - নিয়ন সাইবারপাঙ্ক টিশার্ট',
    description: 'ফিউচারিস্টিক নিয়ন সাইবারপাঙ্ক আর্টওয়ার্ক। প্রিমিয়াম হাই-ডেফিনিশন মাল্টিকালার স্ক্রিন প্রিন্ট ও প্রিমিয়াম ১৮৫ জিএসএম কটন।',
    price: 590,
    originalPrice: 890,
    stock: 28,
    category: 'Anime & Pop Art',
    tags: ['Cyberpunk', 'Samurai', 'Neon', 'Anime'],
    designImage: SAMPLE_GRAPHIC_DESIGNS[3].dataUrl,
    designScale: 58,
    designPositionY: -5,
    designPositionX: 0,
    designBlendMode: 'normal',
    defaultColor: '#18181b',
    availableColors: ['#18181b', '#0f172a', '#450a0a', '#94a3b8'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    mockupStyle: 'crewneck',
    rating: 4.9,
    reviewsCount: 42,
    badge: '⚡ লিমিটেড ড্রপ',
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    isPublished: true,
  },
];
