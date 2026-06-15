'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export function Developer() {
  return (
    <section className="py-10 md:py-12 lg:py-14" style={{ background: '#F5F0E8' }}>
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Sri Brahmari Developers Logo (Cropped Lotus + Crisp HTML Text) */}
            <div className="flex flex-col items-center justify-center mb-4 md:mb-6 select-none">
              <div
                style={{
                  width: 100,
                  height: 75,
                  overflow: 'hidden',
                }}
              >
                <Image
                  src="/sri-brahmari-logo-transparent.png"
                  alt="Sri Brahmari Developers Logo"
                  width={100}
                  height={150}
                  className="object-cover object-top block"
                  style={{ objectPosition: 'top center', height: '100%' }}
                />
              </div>
              <p className="font-cinzel text-sm md:text-base font-bold tracking-[0.22em] mt-2 uppercase" style={{ color: '#B07848' }}>
                Sri Brahmari
              </p>
              <p className="font-outfit text-[0.55rem] md:text-[0.6rem] font-semibold tracking-[0.35em] uppercase" style={{ color: '#8A9BB0' }}>
                Developers
              </p>
            </div>

            <p className="font-playfair text-sm italic tracking-widest" style={{ color: '#B07848' }}>
              The Developer
            </p>
            <h2 className="text-section-title mt-3 font-playfair font-bold" style={{ color: '#0D1F2D' }}>
              Building Value Beyond Land
            </h2>

            <div
              className="mx-auto mt-8 rounded-2xl p-8 text-left"
              style={{ background: '#FDFAF5', border: '1px solid #E2D9CC' }}
            >
              <p className="leading-relaxed" style={{ color: '#4A5568' }}>
                Sri Brahmari Developers is focused on creating thoughtfully planned land and lifestyle communities in coastal Karnataka. The company believes in transparent dealings, practical planning, quality infrastructure and long-term value creation.
              </p>
              <p className="mt-4 leading-relaxed" style={{ color: '#4A5568' }}>
                Dollars Colony is designed as a premium coastal plotted community that combines land ownership, lifestyle amenities and future value.
              </p>

              {/* Values */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-6" style={{ borderColor: '#E2D9CC' }}>
                {[
                  ['Transparent',  'No hidden terms or pressure sales'],
                  ['Community',    'Built for long-term residents'],
                  ['Quality',      'Infrastructure that lasts'],
                ].map(([title, desc]) => (
                  <div key={title} className="text-center">
                    <p className="text-sm font-bold" style={{ color: '#0D1F2D' }}>{title}</p>
                    <p className="mt-1 text-xs leading-snug" style={{ color: '#8A9BB0' }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
