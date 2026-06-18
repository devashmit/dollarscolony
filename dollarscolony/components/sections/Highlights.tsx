'use client'

import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { highlights } from '@/data/highlights'
import { ArrowRight } from 'lucide-react'

type LucideIconName = keyof typeof Icons

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = Icons[name as LucideIconName] as React.ElementType | undefined
  if (!Icon) return null
  return <Icon className={className} />
}

export function Highlights() {
  return (
    <section id="highlights" className="py-7 md:py-10 lg:py-12" style={{ background: '#050B14' }}>
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        
        {/* Header - Editorial Minimal */}
        <div className="mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-5">
              {/* Luxury Golden Emblem */}
              <motion.div
                initial={{ rotate: -90, opacity: 0, scale: 0 }}
                whileInView={{ rotate: 0, opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="flex items-center justify-center text-[#D4A46A]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1L14.5 9.5L23 12L14.5 14.5L12 23L9.5 14.5L1 12L9.5 9.5L12 1Z" fill="currentColor" />
                  <path d="M12 5L13 10L18 12L13 14L12 19L11 14L6 12L11 10L12 5Z" fill="#050B14" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </motion.div>

              <div className="flex items-center gap-3">
                <p className="font-outfit text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-[#D4A46A]">
                  The Dollars Colony Advantage
                </p>
                <motion.div 
                  initial={{ scaleX: 0 }} 
                  whileInView={{ scaleX: 1 }} 
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                  className="h-[1px] w-12 md:w-20 bg-gradient-to-r from-[#D4A46A] to-transparent origin-left opacity-50"
                />
              </div>
            </div>
            <h2 className="font-playfair text-3xl md:text-6xl font-normal text-white leading-[1.1]">
              Curated for <br className="hidden md:block" />
              <span className="italic text-white/50">Exceptional Living</span>
            </h2>
          </motion.div>
        </div>

        {/* Architectural Index Layout - Animated Edition */}
        <div className="relative">
          {/* Top Line Draw Animation */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-0 right-0 h-[1px] bg-white/10 origin-left"
          />

          {highlights.map((h, i) => (
            <motion.div
              key={h.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              className="group relative flex flex-row items-center justify-between py-3.5 md:py-5 transition-colors duration-300 hover:bg-[#D4A46A]/[0.03]"
            >
              {/* Bottom Border Draw Animation */}
              <motion.div 
                variants={{
                  hidden: { scaleX: 0 },
                  visible: { scaleX: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 } }
                }}
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10 origin-left"
              />

              {/* Subtle hover background highlight effect running full width */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4A46A] scale-y-0 origin-top transition-transform duration-300 ease-out group-hover:scale-y-100" />
              
              <div className="flex items-center flex-grow pl-4 md:pl-8 pr-4">
                {/* Left Column: Number */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut", delay: i * 0.05 + 0.1 } }
                  }}
                  className="flex-shrink-0 w-12 md:w-20"
                >
                  <span className="font-playfair text-xl md:text-3xl italic text-white/20 transition-colors duration-300 group-hover:text-[#D4A46A]">
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                </motion.div>

                {/* Center Column: Title */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: i * 0.05 + 0.2 } }
                  }}
                  className="flex-grow"
                >
                  <h3 className="font-outfit text-base md:text-2xl font-light text-white/80 tracking-wide transition-all duration-300 group-hover:text-white group-hover:translate-x-2">
                    {h.label}
                  </h3>
                </motion.div>
              </div>

              {/* Right Column: Icons */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut", delay: i * 0.05 + 0.3 } }
                }}
                className="flex-shrink-0 flex justify-end items-center w-12 md:w-24 pr-4 md:pr-6 relative h-6 md:h-8 overflow-hidden"
              >
                 {/* Original Icon */}
                 <div className="text-white/20 transition-all duration-300 group-hover:translate-x-8 group-hover:opacity-0 absolute right-4 md:right-6">
                   <DynamicIcon name={h.icon} className="h-5 w-5 md:h-6 md:w-6 stroke-[1.5]" />
                 </div>
                 {/* Arrow that slides in */}
                 <div className="text-[#D4A46A] opacity-0 -translate-x-8 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 absolute right-4 md:right-6">
                   <ArrowRight className="h-5 w-5 md:h-6 md:w-6 stroke-[1.5]" />
                 </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

