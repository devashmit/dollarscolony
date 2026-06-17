'use client'

import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

const REASONS = [
  "Coastal lifestyle appeal",
  "Beaches and backwaters",
  "NH66 connectivity",
  "Strong NRI and coastal Karnataka connection",
  "Rising second-home demand",
  "Limited premium plotted communities",
  "Long-term land ownership value",
]

export function WhyKundapura() {
  return (
    <section className="py-7 md:py-10 lg:py-12" style={{ background: '#FDFAF5' }}>
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        <div className="grid gap-7 md:gap-10 md:grid-cols-2 md:items-center">
          {/* Left: heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-playfair text-sm italic tracking-widest" style={{ color: '#B07848' }}>
              The Location
            </p>
            <h2 className="text-section-title mt-3 font-playfair font-bold" style={{ color: '#0D1F2D' }}>
              Why Kundapura?
            </h2>
            <p className="mt-4 md:mt-6 leading-relaxed" style={{ color: '#4A5568' }}>
              Kundapura is emerging as a strong coastal investment destination because of its beaches, backwaters, NH66 connectivity, railway access, tourism potential and rising demand for second homes and retirement homes.
            </p>

            {/* Decorative line */}
            <div className="mt-5 md:mt-8 flex items-center gap-3 md:gap-4">
              <div className="h-px flex-1" style={{ background: '#E2D9CC' }} />
              <span className="font-mono text-xs uppercase tracking-widest" style={{ color: '#B07848' }}>
                Kundapura, Karnataka
              </span>
              <div className="h-px flex-1" style={{ background: '#E2D9CC' }} />
            </div>
          </motion.div>

          {/* Right: checklist */}
          <motion.ul
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-3 md:space-y-4"
          >
            {REASONS.map((reason, i) => (
              <li key={i} className="flex items-start gap-3 md:gap-4">
                <div
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                  style={{ background: 'rgba(176,120,72,0.15)' }}
                >
                  <Check className="h-3.5 w-3.5" style={{ color: '#B07848' }} />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#4A5568' }}>{reason}</p>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
