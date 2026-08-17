import React, { useState } from 'react';

export type TShirtViewMode = 'front' | 'back';

interface TShirtMockupViewProps {
  color?: string; // Hex color code (default #18181b jet black)
  designImage?: string; // PNG base64 or URL
  customMockupImage?: string; // Custom uploaded mockup photo/image base
  designScale?: number; // 20 - 100%
  designPositionX?: number; // -50 to 50
  designPositionY?: number; // -50 to 50
  designBlendMode?: 'normal' | 'multiply';
  mockupStyle?: 'crewneck' | 'oversized' | 'hoodie';
  viewMode?: TShirtViewMode;
  onToggleViewMode?: (mode: TShirtViewMode) => void;
  showViewToggle?: boolean;
  showPrintAreaGuide?: boolean;
  className?: string;
  id?: string;
}

export const TShirtMockupView: React.FC<TShirtMockupViewProps> = ({
  color = '#18181b', // Default Jet Black as in reference images
  designImage,
  customMockupImage,
  designScale = 52,
  designPositionX = 0,
  designPositionY = -4,
  designBlendMode = 'normal',
  viewMode: controlledViewMode,
  onToggleViewMode,
  showViewToggle = false,
  showPrintAreaGuide = false,
  className = '',
  id,
}) => {
  const [internalViewMode, setInternalViewMode] = useState<TShirtViewMode>('back');
  const currentView = controlledViewMode || internalViewMode;

  const handleToggle = (mode: TShirtViewMode) => {
    if (onToggleViewMode) {
      onToggleViewMode(mode);
    } else {
      setInternalViewMode(mode);
    }
  };

  // Determine if color is very light (to adjust seam stitches, shadows, and contrast)
  const isLightColor = ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#94a3b8', '#d6c7b2'].includes(
    color.toLowerCase()
  );

  const uid = id || 'mockup_uid';

  return (
    <div
      id={id}
      className={`relative w-full aspect-square flex items-center justify-center select-none overflow-hidden rounded-2xl ${className}`}
      style={{
        background: 'radial-gradient(circle at 50% 40%, #ffffff 0%, #f1f5f9 60%, #e2e8f0 100%)',
      }}
    >
      {/* View Toggle Badge (Front / Back) */}
      {showViewToggle && (
        <div className="absolute top-3 right-3 z-20 flex items-center bg-slate-900/80 backdrop-blur-md p-0.5 rounded-lg border border-slate-700/50 shadow-md text-[10px] font-bold">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle('front');
            }}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
              currentView === 'front' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Front
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle('back');
            }}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
              currentView === 'back' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Back
          </button>
        </div>
      )}

      {/* Main Oversized Boxy Streetwear Mockup Base (Photo Mode or Vector SVG) */}
      {customMockupImage ? (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src={customMockupImage}
            alt="Custom T-Shirt Mockup Template"
            crossOrigin="anonymous"
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>
      ) : (
        <svg
          viewBox="0 0 640 640"
          className="w-full h-full drop-shadow-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
        <defs>
          {/* Realistic Floor Shadow Filter */}
          <filter id={`floor-blur-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" />
          </filter>

          {/* 3D Directional Fabric Studio Lighting */}
          <linearGradient id={`streetwear-lighting-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isLightColor ? 0.35 : 0.16} />
            <stop offset="30%" stopColor="#ffffff" stopOpacity={isLightColor ? 0.15 : 0.06} />
            <stop offset="65%" stopColor="#000000" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0.28} />
          </linearGradient>

          {/* Torso & Drop-Shoulder Ambient Occlusion */}
          <radialGradient id={`streetwear-depth-${uid}`} cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.08} />
            <stop offset="60%" stopColor="#000000" stopOpacity={0.05} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0.35} />
          </radialGradient>

          {/* Ribbed Crewneck Collar Gradient */}
          <linearGradient id={`collar-gradient-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#000000" stopOpacity={0.4} />
            <stop offset="45%" stopColor="#ffffff" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0.45} />
          </linearGradient>

          {/* Inner Collar Back Cavity */}
          <linearGradient id={`inner-cavity-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#09090b" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#18181b" stopOpacity={0.7} />
          </linearGradient>

          {/* Drop-Shadow Filter for Realistic T-Shirt Edge */}
          <filter id={`shirt-edge-shadow-${uid}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* 1. Realistic Floating Studio Floor Drop Shadow (Matching user reference) */}
        <g opacity="0.45">
          <ellipse cx="320" cy="558" rx="200" ry="22" fill="#09090b" filter={`url(#floor-blur-${uid})`} />
          <ellipse cx="320" cy="554" rx="140" ry="12" fill="#000000" filter={`url(#floor-blur-${uid})`} opacity="0.6" />
        </g>

        {/* 2. Main Oversized Streetwear T-Shirt Body Group */}
        <g filter={`url(#shirt-edge-shadow-${uid})`}>
          {currentView === 'front' ? (
            /* ================= FRONT VIEW ================= */
            <>
              {/* Inner Collar Cavity (Back fabric inside neck) */}
              <path
                d="M245,108 C275,130 365,130 395,108 C382,90 258,90 245,108 Z"
                fill={`url(#inner-cavity-${uid})`}
              />

              {/* Woven Neck Label Tag */}
              <rect x="306" y="102" width="28" height="18" rx="2" fill="#f1f5f9" opacity="0.95" />
              <line x1="310" y1="110" x2="330" y2="110" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
              <text x="320" y="117" fontSize="5.5" fontWeight="bold" fill="#0f172a" textAnchor="middle">
                XL • 240 GSM
              </text>

              {/* Front Oversized Streetwear Silhouette (Boxy, Drop-Shoulder, Wide Elbow-Length Sleeves) */}
              <path
                d="M246,108 C278,142 362,142 394,108 
                   L505,148 C515,152 528,168 522,272 C518,284 496,290 464,280 
                   L442,218 L460,518 C460,530 450,536 430,536 
                   L210,536 C190,536 180,530 180,518 
                   L198,218 L176,280 C144,290 122,284 118,272 C112,168 125,152 135,148 Z"
                fill={color}
              />

              {/* Lighting & Volume Depth Layers */}
              <path
                d="M246,108 C278,142 362,142 394,108 
                   L505,148 C515,152 528,168 522,272 C518,284 496,290 464,280 
                   L442,218 L460,518 C460,530 450,536 430,536 
                   L210,536 C190,536 180,530 180,518 
                   L198,218 L176,280 C144,290 122,284 118,272 C112,168 125,152 135,148 Z"
                fill={`url(#streetwear-lighting-${uid})`}
              />

              <path
                d="M246,108 C278,142 362,142 394,108 
                   L505,148 C515,152 528,168 522,272 C518,284 496,290 464,280 
                   L442,218 L460,518 C460,530 450,536 430,536 
                   L210,536 C190,536 180,530 180,518 
                   L198,218 L176,280 C144,290 122,284 118,272 C112,168 125,152 135,148 Z"
                fill={`url(#streetwear-depth-${uid})`}
              />

              {/* Drop Shoulder Seams (Sloping outwards) */}
              <path
                d="M246,108 L142,150"
                stroke={isLightColor ? '#475569' : '#ffffff'}
                strokeWidth="1.2"
                strokeDasharray="3,2"
                opacity={isLightColor ? 0.35 : 0.22}
                fill="none"
              />
              <path
                d="M394,108 L498,150"
                stroke={isLightColor ? '#475569' : '#ffffff'}
                strokeWidth="1.2"
                strokeDasharray="3,2"
                opacity={isLightColor ? 0.35 : 0.22}
                fill="none"
              />

              {/* Armpit Shadow Creases */}
              <path
                d="M198,218 Q216,232 208,270"
                stroke="#000000"
                strokeWidth="4"
                strokeLinecap="round"
                opacity={isLightColor ? 0.35 : 0.6}
                fill="none"
              />
              <path
                d="M442,218 Q424,232 432,270"
                stroke="#000000"
                strokeWidth="4"
                strokeLinecap="round"
                opacity={isLightColor ? 0.35 : 0.6}
                fill="none"
              />

              {/* Wide Sleeve Hem Stitches */}
              <path
                d="M122,268 C138,278 156,282 172,274"
                stroke={isLightColor ? '#334155' : '#ffffff'}
                strokeWidth="1.4"
                strokeDasharray="3,2"
                opacity={isLightColor ? 0.45 : 0.25}
                fill="none"
              />
              <path
                d="M518,268 C502,278 484,282 468,274"
                stroke={isLightColor ? '#334155' : '#ffffff'}
                strokeWidth="1.4"
                strokeDasharray="3,2"
                opacity={isLightColor ? 0.45 : 0.25}
                fill="none"
              />

              {/* Bottom Boxy Hem Stitches */}
              <path
                d="M184,522 C240,526 400,526 456,522"
                stroke={isLightColor ? '#334155' : '#ffffff'}
                strokeWidth="1.4"
                strokeDasharray="3,2"
                opacity={isLightColor ? 0.45 : 0.25}
                fill="none"
              />

              {/* Front Crewneck Ribbing Collar Rim */}
              <path
                d="M246,108 C278,142 362,142 394,108 C388,122 355,152 320,152 C285,152 252,122 246,108 Z"
                fill={color}
              />
              <path
                d="M246,108 C278,142 362,142 394,108 C388,122 355,152 320,152 C285,152 252,122 246,108 Z"
                fill={`url(#collar-gradient-${uid})`}
              />
              <path
                d="M246,108 C278,142 362,142 394,108"
                stroke={isLightColor ? '#334155' : '#000000'}
                strokeWidth="2.8"
                opacity="0.65"
                fill="none"
              />
              <path
                d="M252,122 C280,152 360,152 388,122"
                stroke={isLightColor ? '#64748b' : '#ffffff'}
                strokeWidth="1.2"
                strokeDasharray="2,2"
                opacity={isLightColor ? 0.45 : 0.22}
                fill="none"
              />

              {/* Natural Streetwear Heavy Fabric Wrinkle Accents */}
              <path
                d="M215,330 Q250,344 285,334 Q320,324 355,336"
                stroke="#000000"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity={isLightColor ? 0.12 : 0.24}
                fill="none"
              />
              <path
                d="M285,420 Q325,432 365,424 Q405,415 425,430"
                stroke="#000000"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity={isLightColor ? 0.1 : 0.2}
                fill="none"
              />
            </>
          ) : (
            /* ================= BACK VIEW ================= */
            <>
              {/* Back Oversized Streetwear Silhouette (Matching Reference Image 1) */}
              <path
                d="M250,96 C280,106 360,106 390,96 
                   L505,148 C515,152 528,168 522,272 C518,284 496,290 464,280 
                   L442,218 L460,518 C460,530 450,536 430,536 
                   L210,536 C190,536 180,530 180,518 
                   L198,218 L176,280 C144,290 122,284 118,272 C112,168 125,152 135,148 Z"
                fill={color}
              />

              {/* Back Lighting & Volume Depth Layers */}
              <path
                d="M250,96 C280,106 360,106 390,96 
                   L505,148 C515,152 528,168 522,272 C518,284 496,290 464,280 
                   L442,218 L460,518 C460,530 450,536 430,536 
                   L210,536 C190,536 180,530 180,518 
                   L198,218 L176,280 C144,290 122,284 118,272 C112,168 125,152 135,148 Z"
                fill={`url(#streetwear-lighting-${uid})`}
              />

              <path
                d="M250,96 C280,106 360,106 390,96 
                   L505,148 C515,152 528,168 522,272 C518,284 496,290 464,280 
                   L442,218 L460,518 C460,530 450,536 430,536 
                   L210,536 C190,536 180,530 180,518 
                   L198,218 L176,280 C144,290 122,284 118,272 C112,168 125,152 135,148 Z"
                fill={`url(#streetwear-depth-${uid})`}
              />

              {/* Back Drop Shoulder Seams */}
              <path
                d="M250,96 L142,150"
                stroke={isLightColor ? '#475569' : '#ffffff'}
                strokeWidth="1.2"
                strokeDasharray="3,2"
                opacity={isLightColor ? 0.35 : 0.22}
                fill="none"
              />
              <path
                d="M390,96 L498,150"
                stroke={isLightColor ? '#475569' : '#ffffff'}
                strokeWidth="1.2"
                strokeDasharray="3,2"
                opacity={isLightColor ? 0.35 : 0.22}
                fill="none"
              />

              {/* Back Armpit Crease Shadows */}
              <path
                d="M198,218 Q216,232 208,270"
                stroke="#000000"
                strokeWidth="4"
                strokeLinecap="round"
                opacity={isLightColor ? 0.35 : 0.6}
                fill="none"
              />
              <path
                d="M442,218 Q424,232 432,270"
                stroke="#000000"
                strokeWidth="4"
                strokeLinecap="round"
                opacity={isLightColor ? 0.35 : 0.6}
                fill="none"
              />

              {/* Back Wide Sleeve Hem Stitches */}
              <path
                d="M122,268 C138,278 156,282 172,274"
                stroke={isLightColor ? '#334155' : '#ffffff'}
                strokeWidth="1.4"
                strokeDasharray="3,2"
                opacity={isLightColor ? 0.45 : 0.25}
                fill="none"
              />
              <path
                d="M518,268 C502,278 484,282 468,274"
                stroke={isLightColor ? '#334155' : '#ffffff'}
                strokeWidth="1.4"
                strokeDasharray="3,2"
                opacity={isLightColor ? 0.45 : 0.25}
                fill="none"
              />

              {/* Back Bottom Boxy Hem Stitches */}
              <path
                d="M184,522 C240,526 400,526 456,522"
                stroke={isLightColor ? '#334155' : '#ffffff'}
                strokeWidth="1.4"
                strokeDasharray="3,2"
                opacity={isLightColor ? 0.45 : 0.25}
                fill="none"
              />

              {/* Back High Crew Neck Collar Ribbing */}
              <path
                d="M250,96 C280,106 360,106 390,96 C385,112 355,124 320,124 C285,124 255,112 250,96 Z"
                fill={color}
              />
              <path
                d="M250,96 C280,106 360,106 390,96 C385,112 355,124 320,124 C285,124 255,112 250,96 Z"
                fill={`url(#collar-gradient-${uid})`}
              />
              <path
                d="M250,96 C280,106 360,106 390,96"
                stroke={isLightColor ? '#334155' : '#000000'}
                strokeWidth="2.5"
                opacity="0.6"
                fill="none"
              />
              <path
                d="M254,110 C280,122 360,122 386,110"
                stroke={isLightColor ? '#64748b' : '#ffffff'}
                strokeWidth="1.2"
                strokeDasharray="2,2"
                opacity={isLightColor ? 0.4 : 0.2}
                fill="none"
              />

              {/* Upper Back Yoke / Spine Shading */}
              <path
                d="M240,160 Q320,175 400,160"
                stroke="#000000"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity={isLightColor ? 0.1 : 0.2}
                fill="none"
              />
              <path
                d="M230,340 Q320,355 410,340"
                stroke="#000000"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity={isLightColor ? 0.1 : 0.2}
                fill="none"
              />
            </>
          )}
        </g>
      </svg>
      )}

      {/* Graphic Artwork Placement & Printable Bounds Overlay */}
      <div
        className="absolute"
        style={{
          width: currentView === 'back' ? '50%' : '44%',
          height: currentView === 'back' ? '54%' : '48%',
          top: currentView === 'back' ? '22%' : '26%',
          left: currentView === 'back' ? '25%' : '28%',
          pointerEvents: 'none',
        }}
      >
        {/* Printable Area Visual Guide */}
        {showPrintAreaGuide && (
          <div className="absolute inset-0 border-2 border-dashed border-indigo-400/80 rounded-xl flex items-start justify-center p-1 pointer-events-none">
            <span className="bg-indigo-600 text-white font-mono text-[9px] px-2 py-0.5 rounded shadow-sm">
              {currentView === 'front' ? 'Chest Print Area' : 'Oversized Back Print Area'}
            </span>
          </div>
        )}

        {/* Scaled & Offset Design Art Image */}
        {designImage ? (
          <div
            className="w-full h-full flex items-center justify-center transition-all duration-150"
            style={{
              transform: `translate(${designPositionX * 2}px, ${designPositionY * 2}px)`,
            }}
          >
            <img
              src={designImage}
              alt="T-Shirt Graphic Artwork"
              crossOrigin="anonymous"
              className="max-h-full object-contain pointer-events-none transition-transform duration-100"
              style={{
                width: `${designScale}%`,
                mixBlendMode: designBlendMode === 'multiply' ? 'multiply' : 'normal',
                filter: isLightColor
                  ? 'drop-shadow(0 3px 6px rgba(0,0,0,0.14))'
                  : 'drop-shadow(0 3px 8px rgba(0,0,0,0.45))',
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-full border border-dashed border-slate-400/60 flex items-center justify-center text-slate-400 mb-1">
              +
            </div>
            <span className="text-[10px] font-semibold text-slate-400">
              No Graphic Placed
            </span>
          </div>
        )}
      </div>

      {/* Subtle Studio Fabric Gloss Specular */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.06) 100%)',
        }}
      />
    </div>
  );
};
