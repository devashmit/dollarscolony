'use client'

import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { amenities } from '@/data/amenities'
import { LotusDivider } from '@/components/ui/GoldEmbroidery'
type LucideIconName = keyof typeof Icons

function DynamicIcon({ name }: { name: string }) {
  const Icon = Icons[name as LucideIconName] as React.ElementType | undefined
  if (!Icon) return null
  return <Icon className="h-6 w-6" />
}

export function Amenities() {
  return (
    <section id="amenities" className="py-10 md:py-12 lg:pb-14 relative overflow-hidden" style={{ background: '#0D1F2D' }}>
      {/* Premium Golden Leaf Embroidery Watermark */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-between overflow-hidden opacity-[0.03] mix-blend-plus-lighter text-[#D4A46A] z-0">
        <div className="relative -translate-x-1/3 -translate-y-1/4 rotate-45 transform">
           <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
             <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
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

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        {/* Header */}
        <div className="mb-14 text-center">
          <LotusDivider className="mb-4" />
          <p className="font-playfair text-sm italic tracking-widest" style={{ color: '#B07848' }}>
            Clubhouse & Facilities
          </p>
          <h2 className="text-section-title mt-3 font-playfair font-bold text-white">
            Life Beyond the Plot
          </h2>
          <p className="mt-4 mx-auto max-w-lg text-sm leading-relaxed" style={{ color: '#8A9BB0' }}>
            The Dollars Colony clubhouse is designed for community, wellness, and everyday joy.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {amenities.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="flex flex-col items-center gap-3 rounded-2xl px-4 py-7 text-center transition-all duration-300 hover:scale-[1.04] relative overflow-hidden group"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
            >

              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: 'rgba(176,120,72,0.15)', color: '#B07848' }}
              >
                <DynamicIcon name={a.icon} />
              </div>
              <p className="text-xs font-semibold leading-tight text-white">{a.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
