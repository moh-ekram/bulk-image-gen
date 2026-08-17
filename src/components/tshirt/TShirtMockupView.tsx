import React from 'react';

interface TShirtMockupViewProps {
  color?: string; // Hex color code
  designImage?: string; // PNG base64 or URL
  designScale?: number; // 20 - 100%
  designPositionX?: number; // -50 to 50
  designPositionY?: number; // -50 to 50
  designBlendMode?: 'normal' | 'multiply';
  mockupStyle?: 'crewneck' | 'oversized' | 'hoodie';
  showPrintAreaGuide?: boolean;
  className?: string;
  id?: string;
}

export const TShirtMockupView: React.FC<TShirtMockupViewProps> = ({
  color = '#18181b', // Default Black as requested
  designImage,
  designScale = 52,
  designPositionX = 0,
  designPositionY = -6,
  designBlendMode = 'normal',
  mockupStyle = 'crewneck',
  showPrintAreaGuide = false,
  className = '',
  id,
}) => {
  // Determine if color is very light (to adjust seams/lighting)
  const isLightColor = ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#94a3b8', '#d6c7b2'].includes(color.toLowerCase());

  return (
    <div
      id={id}
      className={`relative w-full aspect-square flex items-center justify-center select-none overflow-hidden rounded-xl ${className}`}
      style={{
        background: 'radial-gradient(circle at center, #f8fafc 0%, #e2e8f0 100%)',
      }}
    >
      {/* Dynamic T-Shirt Realistic SVG Canvas */}
      <svg
        viewBox="0 0 600 600"
        className="w-full h-full drop-shadow-xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle 3D Fabric Lighting Gradients */}
          <linearGradient id={`fabric-lighting-${id || 'base'}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isLightColor ? 0.25 : 0.15} />
            <stop offset="35%" stopColor="#ffffff" stopOpacity={isLightColor ? 0.1 : 0.05} />
            <stop offset="70%" stopColor="#000000" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0.25} />
          </linearGradient>

          {/* Chest & Shoulder Wrinkle Shadow */}
          <radialGradient id={`chest-shadow-${id || 'base'}`} cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="60%" stopColor="#000000" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </radialGradient>

          {/* Realistic Crewneck Collar Ribbing Pattern */}
          <linearGradient id={`collar-rib-${id || 'base'}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
          </linearGradient>

          {/* Inner Neck Shadow */}
          <linearGradient id={`inner-neck-${id || 'base'}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#202020" stopOpacity="0.6" />
          </linearGradient>

          {/* Drop shadow filter for realism */}
          <filter id={`tshirt-shadow-${id || 'base'}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#0f172a" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Outer Group with Shadow */}
        <g filter={`url(#tshirt-shadow-${id || 'base'})`}>
          {/* Inner Collar Back Fabric */}
          <path
            d="M235,115 C260,135 340,135 365,115 C355,100 245,100 235,115 Z"
            fill={`url(#inner-neck-${id || 'base'})`}
          />

          {/* Woven Size / Brand Neck Label Tag */}
          <rect x="286" y="112" width="28" height="18" rx="2" fill="#e2e8f0" opacity="0.9" />
          <line x1="290" y1="120" x2="310" y2="120" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
          <text x="300" y="127" fontSize="5" fontWeight="bold" fill="#334155" textAnchor="middle">M • 100% COTTON</text>

          {/* Main T-Shirt Body & Sleeves Base Silhouettes */}
          {mockupStyle === 'oversized' ? (
            /* Drop Shoulder Oversized Tee Silhouette */
            <path
              d="M235,115 C265,140 335,140 365,115 
                 L480,165 C485,168 495,185 488,275 C485,285 465,290 435,280 
                 L410,230 L430,490 C430,505 420,510 400,510 
                 L200,510 C180,510 170,505 170,490 
                 L190,230 L165,280 C135,290 115,285 112,275 C105,185 115,168 120,165 Z"
              fill={color}
            />
          ) : (
            /* Classic Crewneck Fitted Tee Silhouette */
            <path
              d="M238,114 C268,142 332,142 362,114 
                 L465,152 C472,156 480,172 472,250 C468,260 450,265 425,255 
                 L398,212 L412,492 C412,504 402,510 385,510 
                 L215,510 C198,510 188,504 188,492 
                 L202,212 L175,255 C150,265 132,260 128,250 C120,172 128,156 135,152 Z"
              fill={color}
            />
          )}

          {/* Lighting & Depth Gradients Layer */}
          <path
            d="M238,114 C268,142 332,142 362,114 
               L465,152 C472,156 480,172 472,250 C468,260 450,265 425,255 
               L398,212 L412,492 C412,504 402,510 385,510 
               L215,510 C198,510 188,504 188,492 
               L202,212 L175,255 C150,265 132,260 128,250 C120,172 128,156 135,152 Z"
            fill={`url(#fabric-lighting-${id || 'base'})`}
          />

          <path
            d="M238,114 C268,142 332,142 362,114 
               L465,152 C472,156 480,172 472,250 C468,260 450,265 425,255 
               L398,212 L412,492 C412,504 402,510 385,510 
               L215,510 C198,510 188,504 188,492 
               L202,212 L175,255 C150,265 132,260 128,250 C120,172 128,156 135,152 Z"
            fill={`url(#chest-shadow-${id || 'base'})`}
          />

          {/* Sleeve Underarm Creases & Shadows */}
          <path
            d="M202,212 Q215,225 210,255"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity={isLightColor ? 0.35 : 0.55}
            fill="none"
          />
          <path
            d="M398,212 Q385,225 390,255"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity={isLightColor ? 0.35 : 0.55}
            fill="none"
          />

          {/* Shoulder Seam Stitching */}
          <path
            d="M238,114 L142,154"
            stroke={isLightColor ? '#475569' : '#ffffff'}
            strokeWidth="1.2"
            strokeDasharray="2,2"
            opacity={isLightColor ? 0.4 : 0.25}
            fill="none"
          />
          <path
            d="M362,114 L458,154"
            stroke={isLightColor ? '#475569' : '#ffffff'}
            strokeWidth="1.2"
            strokeDasharray="2,2"
            opacity={isLightColor ? 0.4 : 0.25}
            fill="none"
          />

          {/* Sleeve Hem Double Stitches */}
          <path
            d="M132,246 C145,256 160,259 173,251"
            stroke={isLightColor ? '#334155' : '#ffffff'}
            strokeWidth="1.2"
            strokeDasharray="3,2"
            opacity={isLightColor ? 0.4 : 0.25}
            fill="none"
          />
          <path
            d="M468,246 C455,256 440,259 427,251"
            stroke={isLightColor ? '#334155' : '#ffffff'}
            strokeWidth="1.2"
            strokeDasharray="3,2"
            opacity={isLightColor ? 0.4 : 0.25}
            fill="none"
          />

          {/* Bottom Hem Seam Line */}
          <path
            d="M192,492 C245,498 355,498 408,492"
            stroke={isLightColor ? '#334155' : '#ffffff'}
            strokeWidth="1.2"
            strokeDasharray="3,2"
            opacity={isLightColor ? 0.4 : 0.25}
            fill="none"
          />

          {/* Front Crewneck Collar Ribbing Ring */}
          <path
            d="M238,114 C268,142 332,142 362,114 C358,124 330,154 300,154 C270,154 242,124 238,114 Z"
            fill={color}
          />
          <path
            d="M238,114 C268,142 332,142 362,114 C358,124 330,154 300,154 C270,154 242,124 238,114 Z"
            fill={`url(#collar-rib-${id || 'base'})`}
          />
          <path
            d="M238,114 C268,142 332,142 362,114"
            stroke={isLightColor ? '#334155' : '#000000'}
            strokeWidth="2.5"
            opacity="0.6"
            fill="none"
          />
          <path
            d="M242,124 C270,154 330,154 358,124"
            stroke={isLightColor ? '#64748b' : '#ffffff'}
            strokeWidth="1.2"
            strokeDasharray="2,2"
            opacity={isLightColor ? 0.4 : 0.2}
            fill="none"
          />

          {/* Natural Fabric Subtle Wrinkles Across Torso */}
          <path
            d="M210,320 Q240,335 270,325 Q300,315 330,328"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            opacity={isLightColor ? 0.12 : 0.2}
            fill="none"
          />
          <path
            d="M270,410 Q305,422 340,414 Q375,405 395,420"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            opacity={isLightColor ? 0.1 : 0.18}
            fill="none"
          />
          <path
            d="M220,440 Q250,450 280,444"
            stroke="#000000"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity={isLightColor ? 0.1 : 0.18}
            fill="none"
          />
        </g>
      </svg>

      {/* Chest Printable Area & Graphic Placement Overlay */}
      <div
        className="absolute"
        style={{
          width: '42%',
          height: '48%',
          top: '28%',
          left: '29%',
          pointerEvents: 'none',
        }}
      >
        {/* Admin Print Area Bounding Box Guide */}
        {showPrintAreaGuide && (
          <div className="absolute inset-0 border-2 border-dashed border-sky-400/70 rounded-lg flex items-start justify-center p-1 pointer-events-none">
            <span className="bg-sky-500/80 text-white font-mono text-[9px] px-1.5 py-0.5 rounded shadow-xs">
              Chest Print Area
            </span>
          </div>
        )}

        {/* Graphic Design Art Container */}
        {designImage ? (
          <div
            className="w-full h-full flex items-center justify-center transition-all duration-150"
            style={{
              transform: `translate(${designPositionX * 2}px, ${designPositionY * 2}px)`,
            }}
          >
            <img
              src={designImage}
              alt="T-Shirt Graphic Design"
              crossOrigin="anonymous"
              className="max-h-full object-contain pointer-events-none transition-transform duration-100"
              style={{
                width: `${designScale}%`,
                mixBlendMode: designBlendMode === 'multiply' ? 'multiply' : 'normal',
                filter: isLightColor
                  ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))'
                  : 'drop-shadow(0 2px 5px rgba(0,0,0,0.35))',
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-full border border-dashed border-slate-400 flex items-center justify-center text-slate-400 mb-1">
              +
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              No Design Placed
            </span>
          </div>
        )}
      </div>

      {/* Realistic Fabric Lighting Gloss Highlight Overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 45%, rgba(0,0,0,0.05) 100%)',
        }}
      />
    </div>
  );
};
