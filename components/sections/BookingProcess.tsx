'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Search, MapPin, MousePointerClick, Handshake, FileText, Home } from 'lucide-react'

const STEPS = [
  { icon: MessageCircle, label: 'Enquiry',                  desc: 'Reach out via form, WhatsApp, or call' },
  { icon: FileText,      label: 'Brochure Shared',          desc: 'Receive the full project brochure' },
  { icon: MapPin,        label: 'Site Visit',               desc: 'Tour the property in person or virtually' },
  { icon: Search,        label: 'Plot Selection',           desc: 'Choose your preferred plot & collection' },
  { icon: MousePointerClick, label: 'Token / Blocking',    desc: 'Secure your chosen plot with a token amount' },
  { icon: Handshake,     label: 'Agreement',                desc: 'Sign the sale agreement with the developer' },
  { icon: Home,          label: 'Registration',             desc: 'Complete legal registration of your plot' },
]

export function BookingProcess() {
  return (
    <section className="pt-4 pb-10 md:pb-12 lg:pb-14 relative overflow-hidden" style={{ background: '#0D1F2D' }}>
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
          <p className="font-playfair text-sm italic tracking-widest" style={{ color: '#B07848' }}>
            How to Book
          </p>
          <h2 className="text-section-title mt-3 font-playfair font-bold text-white">
            Your Journey to Ownership
          </h2>

        </div>

        {/* Timeline: horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Desktop connector line */}
          <div
            className="absolute top-9 left-0 right-0 hidden h-px md:block"
            style={{ background: 'rgba(176,120,72,0.2)' }}
            aria-hidden="true"
          />

          <div className="grid gap-8 md:grid-cols-7">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Step number */}
                  <div
                    className="relative z-10 flex h-[72px] w-[72px] flex-col items-center justify-center rounded-full border-2 font-mono text-xl font-bold transition-all"
                    style={{ borderColor: '#B07848', background: '#0D1F2D', color: '#B07848' }}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="mt-0.5 text-xs font-mono">{String(i + 1).padStart(2, '0')}</span>
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-white">{step.label}</p>
                  <p className="mt-2 text-xs leading-snug" style={{ color: '#8A9BB0' }}>{step.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
