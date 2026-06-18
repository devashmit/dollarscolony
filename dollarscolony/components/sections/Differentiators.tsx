'use client'

import { motion } from 'framer-motion'

const DIFFS = [
  {
    num: '01',
    title: 'First Premium Plotted Community with Clubhouse',
    description: 'A rare plotted development in Kundapura with clubhouse and lifestyle amenities.',
  },
  {
    num: '02',
    title: 'Coastal Lifestyle Advantage',
    description: 'Close to beaches, backwaters, Kundapura town and NH66.',
  },
  {
    num: '03',
    title: 'Limited 54 Plot Community',
    description: 'A compact and exclusive villa plot community designed for long-term value.',
  },
  {
    num: '04',
    title: 'Ideal for Multiple Buyers',
    description: 'Suitable for holiday homes, retirement villas, NRI investment and future family homes.',
  },
]

export function Differentiators() {
  return (
    <section className="py-7 md:py-10 lg:py-12" style={{ background: '#F5F0E8' }}>
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        {/* Header */}
        <div className="mb-8 md:mb-10 max-w-2xl">
          <p className="font-playfair text-sm italic tracking-widest" style={{ color: '#B07848' }}>
            What Sets Us Apart
          </p>
          <h2 className="text-section-title mt-3 font-playfair font-bold" style={{ color: '#0D1F2D' }}>
            What Makes Dollars Colony Different
          </h2>
        </div>

        <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
          {DIFFS.map((d, i) => (
            <motion.div
              key={d.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="rounded-xl md:rounded-2xl p-5 md:p-8"
              style={{
                background: '#FDFAF5',
                borderTop: '3px solid #B07848',
              }}
            >
              <p
                className="font-mono text-4xl md:text-5xl font-semibold"
                style={{ color: 'rgba(176,120,72,0.2)', lineHeight: 1 }}
              >
                {d.num}
              </p>
              <h3 className="mt-3 md:mt-4 text-base md:text-lg font-bold" style={{ color: '#0D1F2D' }}>
                {d.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: '#4A5568' }}>
                {d.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
