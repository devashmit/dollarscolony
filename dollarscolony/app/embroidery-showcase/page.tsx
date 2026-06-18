'use client'

import { useState } from 'react'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import Link from 'next/link'
import {
  GoldEmbroideryDefs,
  LotusDivider,
  CoastalWaveDivider,
  BanyanRootDivider
} from '@/components/ui/GoldEmbroidery'

export default function EmbroideryShowcase() {
  const [selectedStyle, setSelectedStyle] = useState<'lotus' | 'wave' | 'banyan'>('lotus')
  const [bgTheme, setBgTheme] = useState<'navy' | 'forest' | 'sand'>('navy')

  // Theme configuration details
  const themes = {
    navy: {
      background: 'bg-[#0D1F2D]',
      cardBg: 'bg-[#162C3D]',
      textPrimary: 'text-[#F5F0E8]',
      textMuted: 'text-[#8A9BB0]',
      title: 'Dark Royal Navy',
    },
    forest: {
      background: 'bg-[#092B1C]',
      cardBg: 'bg-[#103D29]',
      textPrimary: 'text-[#FDFAF5]',
      textMuted: 'text-[#8AA495]',
      title: 'Ancient Forest Green',
    },
    sand: {
      background: 'bg-[#F5F0E8]',
      cardBg: 'bg-[#FDFAF5]',
      textPrimary: 'text-[#4A5568]',
      textMuted: 'text-[#8A9BB0]',
      title: 'Classic Sand & Ivory',
    },
  }

  const currentTheme = themes[bgTheme]

  const stylesMeta = {
    lotus: {
      title: 'Sri Brahmari Lotus',
      tagline: 'Inspired by the developer\'s signature lotus logo.',
      details: 'A symmetrical, premium lotus flower motif resting on a serene water line. Symbolizes purity, creation, and the trust associated with the Sri Brahmari brand.',
    },
    wave: {
      title: 'Coastal Backwater Wave',
      tagline: 'A nod to Kundapura\'s coastal geography.',
      details: 'Interlocking, elegant waves representing the location of Dollars Colony, where the sea meets the backwaters. A subtle nod to the coastal breeze and relaxed luxury.',
    },
    banyan: {
      title: 'Banyan Roots / Tree of Life',
      tagline: '"Own Land. Build Your Future."',
      details: 'An ancient tree motif with roots delving deep into the ground. Represents heritage, deep-rooted real estate investment, and generational wealth.',
    },
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 font-outfit ${currentTheme.background} ${currentTheme.textPrimary}`}>
      <GoldEmbroideryDefs />

      {/* Navigation Header */}
      <header className="border-b border-[#C5A059]/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
            <ArrowLeft className="w-5 h-5 text-[#C5A059]" />
            <span className="font-cinzel text-xs tracking-[0.25em] text-[#C5A059]">Back to Dollars Colony</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A059] animate-pulse" />
            <span className="font-cinzel text-sm tracking-wider font-bold text-[#C5A059]">Design Lab</span>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="py-12 text-center max-w-4xl mx-auto px-6">
        <span className="font-cinzel text-[#C5A059] text-xs tracking-[0.3em] uppercase block mb-3">Aesthetic Upgrade</span>
        <h1 className="text-4xl md:text-5xl font-cinzel tracking-wide font-normal mb-4">
          Meaningful Golden <span className="gold-text-shimmer">Embroidery</span>
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${currentTheme.textMuted}`}>
          These new dividers are custom-designed to carry meaning specific to Dollars Colony. Tap on a style to preview it live.
        </p>

        {/* Global Controls */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <div className="bg-[#000]/20 p-1.5 rounded-full flex gap-1 border border-[#C5A059]/20">
            {(['navy', 'forest', 'sand'] as const).map((themeKey) => (
              <button
                key={themeKey}
                onClick={() => setBgTheme(themeKey)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  bgTheme === themeKey
                    ? 'bg-[#C5A059] text-[#0D1F2D] shadow-md'
                    : `hover:bg-[#000]/10 ${currentTheme.textPrimary}`
                }`}
              >
                {themeKey === 'sand' ? 'Sand' : themeKey === 'forest' ? 'Forest' : 'Navy'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid: Styles & Showcase */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Style Selector List (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="font-cinzel text-lg tracking-wider text-[#C5A059] mb-4">Select a Meaningful Motif</h2>
          
          {Object.entries(stylesMeta).map(([key, style]) => {
            const isSelected = selectedStyle === key
            return (
              <button
                key={key}
                onClick={() => setSelectedStyle(key as typeof selectedStyle)}
                className={`w-full text-left p-6 rounded-lg border transition-all duration-300 relative overflow-hidden group ${
                  isSelected
                    ? 'border-[#C5A059] bg-[#C5A059]/10 shadow-[0_0_15px_rgba(197,160,89,0.15)]'
                    : 'border-white/10 hover:border-white/20 bg-white/5'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-[#C5A059] p-1 rounded-full text-[#0D1F2D]">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                <h3 className="font-cinzel text-base font-bold text-[#C5A059] group-hover:text-[#F3E5AB] transition-colors">
                  {style.title}
                </h3>
                <p className="text-xs text-white/50 mt-1 mb-2 italic">
                  {style.tagline}
                </p>
                <p className={`text-xs ${currentTheme.textMuted}`}>
                  {style.details}
                </p>
              </button>
            )
          })}
        </div>

        {/* Live Previews Container (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Heading Showcase */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-xs tracking-widest text-[#C5A059]">Heading Preview</h3>
            
            <div className={`p-8 rounded-xl border border-white/5 space-y-12 ${currentTheme.cardBg}`}>
              
              <div className="text-center space-y-3">
                <span className="font-cinzel text-xs tracking-[0.3em] text-[#C5A059] uppercase block">Amenities</span>
                <h4 className="font-cinzel text-3xl font-normal tracking-wide">
                  Clubhouse & Facilities
                </h4>
                <div className="max-w-2xl mx-auto pt-6">
                  {selectedStyle === 'lotus' && <LotusDivider />}
                  {selectedStyle === 'wave' && <CoastalWaveDivider />}
                  {selectedStyle === 'banyan' && <BanyanRootDivider />}
                </div>
              </div>
              
              <div className="text-center space-y-3">
                 <span className="font-cinzel text-xs tracking-[0.3em] text-[#C5A059] uppercase block">Explore</span>
                <h4 className="font-cinzel text-3xl font-normal tracking-wide">
                  The Masterplan
                </h4>
                <div className="max-w-2xl mx-auto pt-6">
                  {selectedStyle === 'lotus' && <LotusDivider />}
                  {selectedStyle === 'wave' && <CoastalWaveDivider />}
                  {selectedStyle === 'banyan' && <BanyanRootDivider />}
                </div>
              </div>

            </div>
          </div>

        </div>

      </section>
    </div>
  )
}
