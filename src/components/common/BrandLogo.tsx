import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-11 h-11',
  };

  const ringClasses = {
    sm: 'p-0.5',
    md: 'p-0.5',
    lg: 'p-1',
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Luxury Gold Monogram Seal */}
      <div className={`${sizeClasses[size]} ${ringClasses[size]} rounded-full bg-gradient-to-tr from-amber-600 via-rose-700 to-amber-400 shadow-lg flex items-center justify-center relative group`}>
        <div className="w-full h-full bg-stone-950 rounded-full flex items-center justify-center relative overflow-hidden border border-amber-400/30">
          {/* Subtle gold wax radial highlight */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-black/60" />
          
          {/* Stylized vector Monogram Logo */}
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-amber-300 transform group-hover:rotate-12 transition-transform duration-300">
            <path
              d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
              fill="url(#goldGrad)"
              stroke="#fbbf24"
              strokeWidth="0.75"
            />
            <defs>
              <linearGradient id="goldGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fef3c7" />
                <stop offset="0.5" stopColor="#d4af37" />
                <stop offset="1" stopColor="#927318" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {showText && (
        <div>
          <span className="font-serif text-lg tracking-[0.2em] text-amber-100 font-semibold block leading-none">
            ETERNELLER
          </span>
          <span className="text-[9px] text-stone-400 font-sans tracking-wider block mt-0.5">
            LUXURY DIGITAL SUITES
          </span>
        </div>
      )}
    </div>
  );
};
