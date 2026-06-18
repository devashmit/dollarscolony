'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { analytics } from '@/lib/analytics'

const NAV_LINKS = [
  { label: 'Project',    href: '#about'   },
  { label: 'Plots',      href: '#plots'   },
  { label: 'Amenities',  href: '#amenities' },
  { label: 'Location',   href: '#location' },
  { label: 'Contact',    href: '#contact'  },
]

interface Props {
  onBrochureClick?: () => void
}

export function Navbar({ onBrochureClick }: Props) {
  const scrolled  = useScrollPosition(60)
  const [open, setOpen] = useState(false)

  function handleEnquire() {
    analytics.siteVisitRequested()
    const el = document.getElementById('contact')
    el?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  function handleNavClick(href: string) {
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <>
      <header
        id="main-nav"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(13,31,45,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 md:px-6 md:py-3">
          {/* Logo */}
          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="font-cinzel text-lg font-bold tracking-wide text-white" aria-label="Dollars Colony Home">
            DOLLARS COLONY
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {NAV_LINKS.map(link => (
              <motion.button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="group relative font-cinzel text-xs uppercase tracking-widest text-white/80 transition-colors hover:text-white"
                whileHover="hover"
              >
                {link.label}
                <motion.span
                  className="absolute -bottom-1 left-0 h-[1px] bg-[#D4A46A]"
                  variants={{
                    hover: { width: '100%' },
                    initial: { width: 0 }
                  }}
                  initial="initial"
                  transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
                />
              </motion.button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3.5 md:flex">
            <button
              id="nav-brochure-btn"
              onClick={onBrochureClick}
              className="ripple-btn font-cinzel text-[0.68rem] font-bold tracking-widest uppercase border border-[#D4A46A]/40 rounded-sm px-4.5 py-2.5 text-white transition-all hover:scale-[1.02] bg-white/5 backdrop-blur-sm"
            >
              Brochure
            </button>
            <button
              id="nav-enquire-btn"
              onClick={handleEnquire}
              className="ripple-btn font-cinzel text-[0.68rem] font-bold tracking-widest uppercase border border-[#D4A46A] rounded-sm px-5.5 py-2.5 text-white transition-all hover:scale-[1.02]"
              style={{ background: '#B07848' }}
            >
              Enquire Now
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-white md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 right-0 top-[57px] z-40 overflow-hidden border-b border-white/10 shadow-2xl md:hidden"
            style={{ background: '#0D1F2D' }}
          >
            <div className="flex flex-col px-4 py-3.5">
              {/* Links */}
              <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleNavClick(link.href)}
                    className="text-left font-cinzel text-base font-bold text-white/90 transition-colors hover:text-[#D4A46A]"
                  >
                    {link.label}
                  </motion.button>
                ))}
              </nav>

              {/* Mobile CTAs */}
              <div className="mt-4 flex flex-col gap-2.5">
                <button
                  onClick={() => { onBrochureClick?.(); setOpen(false) }}
                  className="ripple-btn w-full rounded-sm border py-2.5 text-xs font-bold tracking-widest uppercase text-white transition-all hover:bg-white/5"
                  style={{ borderColor: 'rgba(212,164,106,0.4)' }}
                >
                  Download Brochure
                </button>
                <button
                  onClick={handleEnquire}
                  className="ripple-btn w-full rounded-sm py-2.5 text-xs font-bold tracking-widest uppercase text-[#0D1F2D] transition-all hover:opacity-90"
                  style={{ background: '#D4A46A' }}
                >
                  Enquire Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
