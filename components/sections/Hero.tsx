'use client'

import Image from 'next/image'
import { Download, MessageCircle, MapPin, Building2, Route, Layers, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { analytics } from '@/lib/analytics'

const NEW_FLYER_STATS = [
  { icon: MapPin, title: 'Prime Coastal Location', sub: 'Close to beaches, town & NH66' },
  { icon: Building2, title: 'Clubhouse & Amenities', sub: '~4500 Sq.ft Clubhouse designed for community living' },
  { icon: Route, title: 'Well Planned Infrastructure', sub: 'Wide internal roads, lighting, landscaping & open spaces' },
  { icon: Layers, title: 'Multiple Plot Options', sub: '2000+ Sq.ft & 4000+ Sq.ft plots' },
  { icon: Users, title: 'Investment for Generations', sub: 'Land ownership that grows in value' },
]

interface Props {
  onBrochureClick?: () => void
}

export function Hero({ onBrochureClick }: Props) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919035624148'
  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi, I'm interested in Dollars Colony")}`

  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col overflow-hidden"
      style={{ background: '#FDFAF5' }}
    >
      {/* Background image - elegant fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 pointer-events-none"
      >
        <Image
          src="/hero-ultra-premium.png"
          alt="Premium aerial view of scenic coastal highway at Dollars Colony"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Luxury Vignette — stronger overlay to improve text contrast */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(9,43,28,0.55) 0%, rgba(13,31,45,0.45) 40%, rgba(13,31,45,0.72) 80%, rgba(9,43,28,0.90) 100%)',
          }}
        />
        {/* Center dark spot for title legibility */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(9,43,28,0.50) 0%, transparent 100%)',
          }}
        />
      </motion.div>

      {/* Subtle top dark gradient for Navbar readability */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, rgba(13,31,45,0.6) 0%, transparent 100%)' }}
        aria-hidden="true"
      />

      {/* Symmetrical Floating Pre-Launch Shield Ribbon (Responsive) */}
      <motion.div 
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-16 right-4 z-20 sm:top-20 sm:right-6 md:top-24 md:right-12 w-[90px] h-[115px] sm:w-[95px] sm:h-[125px] md:w-[104px] md:h-[135px] flex flex-col items-center justify-center p-3 select-none"
      >
        {/* Shield Background SVG */}
        <div className="absolute inset-0 z-0">
          <svg className="w-full h-full filter drop-shadow-2xl" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 3 3 L 97 3 L 97 98 L 50 126 L 3 98 Z" fill="#092B1C" stroke="#D4A46A" strokeWidth="2.5" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Shield Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center mt-[-8px]">
          {/* Detailed 5-Point Crown */}
          <svg className="text-[#D4A46A] w-7 h-5 sm:w-8 sm:h-6 md:w-10 md:h-8 mb-0.5 sm:mb-1 md:mb-1.5" viewBox="0 0 100 80" fill="currentColor">
            {/* Base lines */}
            <rect x="20" y="58" width="60" height="3.5" rx="1" />
            <rect x="23" y="65" width="54" height="2.5" rx="1" />
            {/* Peaks */}
            <path d="M 20 54 L 22 36 L 29 44 L 36 26 L 43 38 L 50 16 L 57 38 L 64 26 L 71 44 L 78 36 L 80 54 Z" />
            {/* Peak dots */}
            <circle cx="22" cy="36" r="2.2" />
            <circle cx="36" cy="26" r="2.8" />
            <circle cx="50" cy="16" r="3.2" />
            <circle cx="64" cy="26" r="2.8" />
            <circle cx="78" cy="36" r="2.2" />
          </svg>
          <span className="font-cinzel text-[0.45rem] sm:text-[0.5rem] md:text-[0.62rem] text-[#D4A46A] tracking-[0.16em] sm:tracking-[0.18em] md:tracking-[0.22em] uppercase font-bold text-center leading-relaxed block mt-0.5 sm:mt-1">
            Pre<br />Launch<br />Offer
          </span>
        </div>
      </motion.div>

      {/* Main Content Container (Centered Symmetrical Layout) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-5 pt-20 md:pt-24 pb-4 md:pb-6 flex-1 flex flex-col justify-center items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          className="flex flex-col items-center"
        >
          {/* Logo - Sri Brahmari Developers (transparent PNG + styled text) */}
          <div className="mb-3 select-none flex flex-col items-center">
            {/* Lotus image only — crop to just the flower part */}
            <div
              style={{
                width: 84,
                height: 62,
                overflow: 'hidden',
                filter: 'drop-shadow(0 4px 18px rgba(212,164,106,0.55)) brightness(1.15) saturate(1.2)',
              }}
            >
              <Image
                src="/sri-brahmari-logo-transparent.png"
                alt="Sri Brahmari Developers Logo"
                width={84}
                height={150}
                className="object-cover object-top block"
                style={{ objectPosition: 'top center', height: '100%' }}
              />
            </div>
            {/* Brand name rendered in gold Cinzel for clarity on dark background */}
            <p
              className="font-cinzel text-[0.68rem] md:text-sm font-bold tracking-[0.22em] mt-1 uppercase"
              style={{ color: '#F0C97A', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
            >
              Sri Brahmari
            </p>
            <p
              className="font-outfit text-[0.55rem] md:text-[0.6rem] font-semibold tracking-[0.35em] uppercase"
              style={{ color: '#D4A46A', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
            >
              Developers
            </p>
          </div>

          {/* Symmetrical Elegant Classic Title */}
          <h1
            className="font-cinzel text-[2.35rem] md:text-6xl lg:text-7xl font-bold tracking-[0.08em] md:tracking-[0.1em] drop-shadow-md leading-[1.12]"
            style={{ color: '#FDFAF5' }}
          >
            DOLLARS<br />COLONY
          </h1>

          {/* Symmetrical divider with gold diamond accent */}
          <div className="flex items-center justify-center gap-4 my-3 md:my-5 w-full max-w-sm">
            <div className="h-[1.5px] flex-1" style={{ background: 'linear-gradient(to right, transparent, #D4A46A)', filter: 'drop-shadow(0 0 3px rgba(212,164,106,0.8))' }} />
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="0" width="7" height="7" transform="rotate(45 5 0)" fill="#D4A46A" />
            </svg>
            <div className="h-[1.5px] flex-1" style={{ background: 'linear-gradient(to left, transparent, #D4A46A)', filter: 'drop-shadow(0 0 3px rgba(212,164,106,0.8))' }} />
          </div>

          {/* Elegant Pill Badge in Forest Green with Gold Border */}
          <div
            className="mt-4 md:mt-6 inline-flex items-center rounded-full border border-[#D4A46A] px-4 py-2 md:px-8 md:py-3 shadow-2xl mb-4 md:mb-5 backdrop-blur-md"
            style={{ background: 'rgba(9,43,28,0.85)' }}
          >
            <span 
              className="font-cinzel text-[0.55rem] md:text-xs tracking-[0.16em] md:tracking-[0.2em] uppercase font-semibold"
              style={{ color: '#F0C97A', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
            >
              Premium Coastal Villa Plot Community
            </span>
          </div>

          {/* Location details */}
          <div className="flex items-center gap-2 mb-5 md:mb-8 text-white/95">
            <MapPin className="h-4 w-4 md:h-4.5 md:w-4.5 text-[#D4A46A]" />
            <span className="font-outfit text-[10px] md:text-xs tracking-[0.25em] uppercase font-bold">
              KUNDAPURA, KARNATAKA
            </span>
          </div>

          {/* CTAs */}
          <div className="flex w-full max-w-xs flex-col justify-center gap-3 sm:max-w-none sm:flex-row md:gap-4">
            <button
              onClick={onBrochureClick}
              className="ripple-btn flex w-full items-center justify-center gap-2 rounded-sm border border-[#D4A46A] px-5 py-3 md:w-auto md:px-7 md:py-4 text-[10px] md:text-xs tracking-widest uppercase font-bold text-white transition-transform hover:scale-[1.03] shadow-2xl"
              style={{ background: '#B07848' }}
            >
              <Download className="h-4 w-4" />
              Download Brochure
            </button>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.whatsappClick('hero')}
              className="ripple-btn flex w-full items-center justify-center gap-2 rounded-sm px-5 py-3 md:w-auto md:px-7 md:py-4 text-[10px] md:text-xs tracking-widest uppercase font-bold text-white transition-transform hover:scale-[1.03] shadow-2xl"
              style={{ background: '#25D366' }}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Now
            </a>
          </div>
        </motion.div>
      </div>

      {/* Developed By Badge (Poster style footer) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="relative z-10 w-full flex items-center justify-center gap-2 md:gap-4 px-4 pb-3 md:pb-5"
      >
        <div className="h-[0.5px] w-8 md:w-12 bg-[#D4A46A]/50" />
        <span className="font-cinzel text-[0.52rem] md:text-[0.68rem] tracking-[0.18em] md:tracking-[0.25em] uppercase text-white/80 text-center">
          Developed by <span className="font-bold text-white">Sri Brahmari Developers</span>
        </span>
        <div className="h-[0.5px] w-8 md:w-12 bg-[#D4A46A]/50" />
      </motion.div>

      {/* Dark Green Stats Block - Cleaned up to be more elegant and minimal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-20 w-full border-t border-white/5"
        style={{ background: '#071810' }}
      >
        <div className="max-w-7xl mx-auto py-3.5 md:py-5 md:px-12 relative overflow-hidden">
          
          {/* Premium Golden Leaf Embroidery Watermark */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-between overflow-hidden opacity-[0.06] mix-blend-plus-lighter text-[#D4A46A]">
            <div className="relative -translate-x-1/3 -translate-y-1/4 rotate-45 transform">
               {/* Layered thin-stroke icons to create a complex embroidery look */}
               <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                 <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                 {/* Extra filigree lines */}
                 <path d="M14 10c-2.5 2.5-4 5-4 8" strokeWidth="0.1" />
                 <path d="M16 7c-2 2-3 4-3 6" strokeWidth="0.1" />
               </svg>
            </div>
            <div className="relative translate-x-1/4 translate-y-1/4 -rotate-[120deg] transform">
               <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.3" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                 <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
               </svg>
            </div>
          </div>

          {/* Premium Auto-Scroll Marquee */}
          <div className="relative z-10 w-full overflow-hidden flex py-1">
            {/* Edge fade masks for seamless infinite scroll look */}
            <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#071810] to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#071810] to-transparent z-20 pointer-events-none" />

            <motion.div
              className="flex w-max"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                ease: 'linear',
                duration: 35, // Smooth, slow scroll speed
                repeat: Infinity,
              }}
            >
              {[...NEW_FLYER_STATS, ...NEW_FLYER_STATS].map((s, idx) => {
                const Icon = s.icon
                return (
                  <div key={idx} className="flex-shrink-0 w-[190px] md:w-[280px] flex flex-col items-center text-center px-3 md:px-8 border-r border-white/5">
                    <div className="mb-2 md:mb-3 flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full border border-white/5 bg-white/[0.02] transition-colors duration-500 hover:bg-[#D4A46A]/10 hover:border-[#D4A46A]/30 group">
                      <Icon className="h-4 w-4 md:h-5 md:w-5 text-[#D4A46A] transition-transform duration-500 group-hover:scale-110" strokeWidth={1.5} />
                    </div>
                    <p className="font-cinzel font-semibold text-[0.7rem] md:text-[0.8rem] leading-tight text-white/90 mb-1.5 tracking-wider transition-colors duration-300 hover:text-white">
                      {s.title}
                    </p>
                    <p className="font-outfit text-[0.55rem] md:text-[0.6rem] text-white/50 max-w-[150px] md:max-w-[180px] leading-relaxed transition-colors duration-300 hover:text-white/70">
                      {s.sub}
                    </p>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom White/Ivory Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-20 w-full py-2.5 md:py-3.5 text-center bg-[#FDFAF5] border-b border-[#E2D9CC]/50"
      >
        <h2 className="font-cinzel text-xs md:text-sm font-bold tracking-[0.3em] uppercase" style={{ color: '#092B1C' }}>
          OWN LAND. BUILD YOUR FUTURE.
        </h2>
      </motion.div>
    </section>
  )
}
