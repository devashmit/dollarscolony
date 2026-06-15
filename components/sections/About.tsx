'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export function About() {
  return (
    <section id="about" className="py-10 md:py-12 lg:py-14" style={{ background: '#FDFAF5' }}>
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Image slot */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl"
          >
            <Image
              src="/about-entrance.jpg"
              alt="Dollars Colony community entrance, gated villa plot community Kundapura"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Decorative corner accent */}
            <div className="absolute bottom-0 right-0 h-24 w-24 rounded-tl-3xl"
              style={{ background: 'rgba(176,120,72,0.25)' }} />
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="font-playfair text-sm italic tracking-widest" style={{ color: '#B07848' }}>
              About the Project
            </p>
            <h2 className="text-section-title mt-3 font-playfair font-bold" style={{ color: '#0D1F2D' }}>
              A Rare Address on Karnataka's Coastal Corridor
            </h2>
            <p className="mt-6 leading-relaxed" style={{ color: '#4A5568' }}>
              Dollars Colony @ Viaan Enclave is a premium coastal plotted community in Kundapura, created for families, NRIs, investors, holiday-home buyers and retirement-home buyers who want to own land in a well-planned community near the coast.
            </p>
            <p className="mt-4 leading-relaxed" style={{ color: '#4A5568' }}>
              Unlike regular plotted layouts, Dollars Colony is planned with clubhouse and lifestyle amenities, making it one of Kundapura’s first premium plotted communities in this category.
            </p>

            {/* Blockquote accent */}
            <div
              className="mt-8 border-l-4 py-2 pl-5"
              style={{ borderColor: '#B07848' }}
            >
              <p className="font-playfair text-lg italic leading-relaxed" style={{ color: '#0D1F2D' }}>
                "Own land. Build your future. Live close to the coast."
              </p>
              <p className="mt-2 text-sm font-semibold" style={{ color: '#8A9BB0' }}>
                Sri Brahmari Developers
              </p>
            </div>

            {/* Quick facts */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                ['Location',    'Kundapura, Karnataka'],
                ['Land Area',   '5 Acres'],
                ['Total Plots', '54 Villa Plots'],
                ['Status',      'Pre-Launch Offer'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl p-4" style={{ background: '#F5F0E8' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8A9BB0' }}>{k}</p>
                  <p className="mt-1 text-sm font-bold" style={{ color: '#0D1F2D' }}>{v}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
