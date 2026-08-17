import { AdminUser, StoreSettings } from '../types';

export const DEFAULT_ADMIN_USER: AdminUser = {
  username: 'admin',
  name: 'Ekram (Lead Admin)',
  email: 'admin@streetwear.com',
  role: 'Super Admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  lastLogin: Date.now(),
};

export const DEFAULT_ADMIN_PASSWORD_HASH = 'admin123';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'Streetwear Drop Hub',
  tagline: 'Premium Heavyweight 240+ GSM Oversized Cotton Apparel',
  currency: '৳',
  hotlinePhone: '+880 1712-345678',
  supportEmail: 'admin@streetwear.com',
  address: 'Level 4, Road 11, Banani, Dhaka-1213',
  deliveryInsideDhaka: 60,
  deliveryOutsideDhaka: 120,
  freeShippingThreshold: 1500,
  bkashNumber: '01712345678 (Merchant / Send Money)',
  nagadNumber: '01912345678 (Personal)',
  enableCod: true,
  enableBkash: true,
  enableNagad: true,
  announcementText: '🔥 New Season Streetwear Drop is Live! Free Shipping on orders over ৳1500 inside Dhaka.',
  enableAnnouncement: true,
};
