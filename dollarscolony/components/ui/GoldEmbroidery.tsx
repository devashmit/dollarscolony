'use client'

import React from 'react'
import Image from 'next/image'

// ── Global Definitions (gradients & thread filters) ─────────────────────────
export function GoldEmbroideryDefs() {
  return (
    <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
      <defs>
        {/* Ancient Shimmering Gold Gradient */}
        <linearGradient id="ancientGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8E6F3E" />
          <stop offset="25%" stopColor="#C5A059" />
          <stop offset="50%" stopColor="#F3E5AB" />
          <stop offset="75%" stopColor="#C5A059" />
          <stop offset="100%" stopColor="#8E6F3E" />
        </linearGradient>

        {/* Muted Antique Patina Gold */}
        <linearGradient id="antiqueGoldMuted" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7A5F35" />
          <stop offset="35%" stopColor="#B39255" />
          <stop offset="50%" stopColor="#DCAE6F" />
          <stop offset="65%" stopColor="#B39255" />
          <stop offset="100%" stopColor="#7A5F35" />
        </linearGradient>

        {/* Stitch/Thread Texture: displacement map makes paths slightly rough like fibers */}
        <filter id="stitchFilter" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}

// ── Lotus Motif Divider (Sri Brahmari Developers) ───────────────────────────
export function LotusDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden flex items-center justify-center ${className}`}>
      {/* The Actual Sri Brahmari Logo Image */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
        <Image 
          src="/sri-brahmari-logo-transparent.png" 
          alt="Sri Brahmari Logo" 
          fill 
          className="object-contain drop-shadow-[0_0_8px_rgba(212,164,106,0.6)]" 
        />
      </div>

      <svg
        className="w-full max-w-2xl h-16 md:h-20 gold-embroidery-shadow opacity-85"
        viewBox="0 0 600 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Thread Lines */}
        <path
          d="M 20 20 L 230 20 M 370 20 L 580 20"
          stroke="url(#antiqueGoldMuted)"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />
        {/* Outer subtle waves */}
        <path
          d="M 130 20 Q 180 10 230 20 M 370 20 Q 420 30 470 20"
          stroke="url(#ancientGold)"
          strokeWidth="0.8"
          fill="none"
          filter="url(#stitchFilter)"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}

// ── Coastal Wave Divider (Sea Meets Backwater) ──────────────────────────────
export function CoastalWaveDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden flex items-center justify-center ${className}`}>
      <svg
        className="w-full max-w-2xl h-12 gold-embroidery-shadow opacity-80"
        viewBox="0 0 600 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 20 16 L 220 16 M 380 16 L 580 16"
          stroke="url(#antiqueGoldMuted)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        {/* Interlocking waves */}
        <path
          d="M 200 16 C 220 16, 230 -4, 250 -4 C 270 -4, 280 16, 300 16 C 320 16, 330 -4, 350 -4 C 370 -4, 380 16, 400 16"
          stroke="url(#ancientGold)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          filter="url(#stitchFilter)"
          transform="translate(0, 8)"
        />
        <path
          d="M 200 16 C 220 16, 230 36, 250 36 C 270 36, 280 16, 300 16 C 320 16, 330 36, 350 36 C 370 36, 380 16, 400 16"
          stroke="url(#antiqueGoldMuted)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          filter="url(#stitchFilter)"
          transform="translate(0, -8)"
        />
        {/* Tiny pearls / foam */}
        <circle cx="250" cy="16" r="2" fill="url(#ancientGold)" />
        <circle cx="350" cy="16" r="2" fill="url(#ancientGold)" />
        <circle cx="300" cy="16" r="3" fill="url(#ancientGold)" />
      </svg>
    </div>
  )
}

// ── Banyan Roots Divider (Own Land, Build Future) ───────────────────────────
export function BanyanRootDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden flex items-center justify-center ${className}`}>
      <svg
        className="w-full max-w-2xl h-14 gold-embroidery-shadow opacity-85"
        viewBox="0 0 600 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ground line */}
        <path
          d="M 20 28 L 580 28"
          stroke="url(#antiqueGoldMuted)"
          strokeWidth="1.5"
          strokeLinecap="round"
          filter="url(#stitchFilter)"
        />
        {/* Tree of Life / Roots center */}
        <g transform="translate(300, 28)" stroke="url(#ancientGold)" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#stitchFilter)">
          {/* Main trunk */}
          <path d="M -4 0 C -4 -10, 0 -20, 0 -20 C 0 -20, 4 -10, 4 0" fill="url(#antiqueGoldMuted)" strokeWidth="1" />
          {/* Branches */}
          <path d="M 0 -15 C -10 -20, -15 -10, -20 -15" />
          <path d="M 0 -10 C 12 -15, 18 -5, 22 -12" />
          <path d="M -2 -5 C -15 -5, -20 0, -25 -2" />
          <path d="M 2 -2 C 15 -2, 25 2, 30 0" />
          {/* Roots going underground */}
          <path d="M -2 0 C -5 5, -10 8, -15 10" strokeWidth="1" />
          <path d="M 2 0 C 5 5, 8 10, 12 10" strokeWidth="1" />
          <path d="M 0 0 C 0 8, -2 12, 0 12" strokeWidth="1" />
        </g>
        {/* Decorative foliage dots */}
        <g fill="url(#ancientGold)">
          <circle cx="280" cy="13" r="1.5" />
          <circle cx="290" cy="5" r="2" />
          <circle cx="300" cy="2" r="2.5" />
          <circle cx="312" cy="6" r="2" />
          <circle cx="322" cy="16" r="1.5" />
        </g>
      </svg>
    </div>
  )
}
