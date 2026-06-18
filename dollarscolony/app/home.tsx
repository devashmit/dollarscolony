'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

import { Navbar }          from '@/components/layout/Navbar'
import { Footer }          from '@/components/layout/Footer'
import { StickyWhatsApp }  from '@/components/ui/StickyWhatsApp'
import { StickyCall }      from '@/components/ui/StickyCall'
import { BrochureModal }   from '@/components/ui/BrochureModal'


import { Hero }            from '@/components/sections/Hero'
import { About }           from '@/components/sections/About'
import { Highlights }      from '@/components/sections/Highlights'
import { Differentiators } from '@/components/sections/Differentiators'
import { Plots }           from '@/components/sections/Plots'
import { Masterplan }      from '@/components/sections/Masterplan'
import { Amenities }       from '@/components/sections/Amenities'
import { Location }        from '@/components/sections/Location'
import { WhyKundapura }    from '@/components/sections/WhyKundapura'
import { Developer }       from '@/components/sections/Developer'
import { Trust }           from '@/components/sections/Trust'
import { BookingProcess }  from '@/components/sections/BookingProcess'
import { FAQ }             from '@/components/sections/FAQ'
import { Contact }         from '@/components/sections/Contact'

function MorphSection({ children, index }: { children: React.ReactNode, index: number }) {
  const direction = index % 2 === 0 ? -50 : 50
  return (
    <motion.section
      initial={{ opacity: 0, x: direction }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.section>
  )
}

export default function HomePage() {
  const [brochureOpen, setBrochureOpen] = useState(false)

  // Force scroll to top on every page load / refresh
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual'
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [])

  function openBrochure() { setBrochureOpen(true) }
  function closeBrochure() { setBrochureOpen(false) }

  return (
    <>
      {/* ── Layout shells ───────────────────────────────────────────────── */}
      <Navbar onBrochureClick={openBrochure} />

      <main className="overflow-x-hidden">
        <Hero           onBrochureClick={openBrochure} />
        <MorphSection index={1}><About /></MorphSection>
        <MorphSection index={2}><Highlights /></MorphSection>
        <MorphSection index={3}><Differentiators /></MorphSection>
        <MorphSection index={4}><Plots          onBrochureClick={openBrochure} /></MorphSection>
        <MorphSection index={5}><Masterplan /></MorphSection>
        <MorphSection index={6}><Amenities /></MorphSection>
        <MorphSection index={7}><Location /></MorphSection>
        <MorphSection index={8}><WhyKundapura /></MorphSection>
        <MorphSection index={9}><Developer /></MorphSection>
        <MorphSection index={10}><Trust /></MorphSection>
        <MorphSection index={11}><BookingProcess /></MorphSection>
        <MorphSection index={12}><FAQ /></MorphSection>
        <MorphSection index={13}><Contact        onBrochureClick={openBrochure} /></MorphSection>
      </main>

      <Footer />

      {/* ── Floating elements ───────────────────────────────────────────── */}
      <StickyWhatsApp />
      <StickyCall />

      {/* ── Global modals ───────────────────────────────────────────────── */}
      <BrochureModal
        open={brochureOpen}
        onClose={closeBrochure}
        source="brochure-download"
      />
    </>
  )
}
