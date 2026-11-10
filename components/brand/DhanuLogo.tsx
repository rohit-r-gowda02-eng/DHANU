'use client'

import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  showTagline?: boolean
}

export function DhanuLogo({
  className = '',
  size = 'md',
  showText = true,
  showTagline = false,
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 24, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 32, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 44, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 56, text: 'text-3xl', sub: 'text-sm' },
  }

  const currentSize = sizeMap[size]

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* 3D Geometric Bow Emblem: Dark Forest Green + Gold */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-lg p-1.5"
        style={{
          width: currentSize.icon + 10,
          height: currentSize.icon + 10,
          background: 'linear-gradient(135deg, #0D1510 0%, #16241B 100%)',
          boxShadow: '0 4px 14px rgba(212, 175, 55, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
        }}
      >
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle background precision ring */}
          <circle cx="18" cy="18" r="15" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
          
          {/* Dhanu Geometric Bow (Arc) in Brushed Gold */}
          <path
            d="M8 28C6.5 22 7.5 13 14 7C17 4.5 21 3.5 27 5"
            stroke="url(#bowGoldGradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Bowstring */}
          <path
            d="M8 28L27 5"
            stroke="rgba(243, 229, 171, 0.35)"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />

          {/* Precision Arrow & Trajectory in Vibrant Emerald Green */}
          <path
            d="M12 24L29 7"
            stroke="url(#arrowEmeraldGradient)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Arrowhead in Pure Gold */}
          <polygon
            points="29,7 23,8 28,13"
            fill="#D4AF37"
          />

          {/* Core Focus Point */}
          <circle cx="20.5" cy="15.5" r="2.2" fill="#10B981" />
          <circle cx="20.5" cy="15.5" r="1" fill="#FFFFFF" />

          {/* Gradients */}
          <defs>
            <linearGradient id="bowGoldGradient" x1="6" y1="28" x2="28" y2="4" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B8860B" />
              <stop offset="0.5" stopColor="#D4AF37" />
              <stop offset="1" stopColor="#F3E5AB" />
            </linearGradient>
            <linearGradient id="arrowEmeraldGradient" x1="12" y1="24" x2="30" y2="6" gradientUnits="userSpaceOnUse">
              <stop stopColor="#059669" />
              <stop offset="0.7" stopColor="#10B981" />
              <stop offset="1" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display font-extrabold tracking-wider text-white ${currentSize.text}`}
              style={{ letterSpacing: '0.08em' }}
            >
              DHANU
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          </div>
          {showTagline && (
            <span className={`text-slate-400 font-medium tracking-tight ${currentSize.sub}`}>
              Consistency creates progress.
            </span>
          )}
        </div>
      )}
    </div>
  )
}
