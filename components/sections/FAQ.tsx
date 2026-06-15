'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { faqs } from '@/data/faqs'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(i: number) {
    setOpenIndex(prev => (prev === i ? null : i))
  }

  return (
    <section id="faq" className="py-10 md:py-12 lg:py-14" style={{ background: '#F5F0E8' }}>
      <div className="mx-auto max-w-3xl px-6 md:px-12">

        {/* Header */}
        <div className="mb-14 text-center">
          <p className="font-cinzel text-[0.65rem] tracking-[0.4em] uppercase mb-3" style={{ color: '#B07848' }}>
            Got Questions?
          </p>
          <h2 className="font-cinzel text-2xl md:text-3xl font-bold tracking-[0.06em]" style={{ color: '#0D1F2D' }}>
            Frequently Asked Questions
          </h2>
          <div className="flex items-center justify-center gap-4 mt-5">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #B07848aa)' }} />
            <svg width="8" height="8" viewBox="0 0 8 8">
              <rect x="4" y="0" width="5.6" height="5.6" transform="rotate(45 4 0)" fill="#B07848" opacity="0.7" />
            </svg>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, #B07848aa)' }} />
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-0 divide-y" style={{ borderColor: 'rgba(176,120,72,0.15)' }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div key={i}>
                <motion.button
                  id={`faq-item-${i}`}
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-start gap-5 py-6 text-left cursor-pointer outline-none"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Number */}
                  <span
                    className="font-cinzel text-[0.65rem] tracking-widest shrink-0 mt-0.5 transition-colors duration-300 w-6 text-right"
                    style={{ color: isOpen ? '#B07848' : 'rgba(176,120,72,0.35)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Question */}
                  <span
                    className="flex-1 font-outfit text-sm font-semibold leading-snug transition-colors duration-300"
                    style={{ color: isOpen ? '#0D1F2D' : '#4A5568' }}
                  >
                    {faq.question}
                  </span>

                  {/* Toggle icon */}
                  <div
                    className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center transition-all duration-300"
                    style={{
                      borderBottom: isOpen ? '1.5px solid #B07848' : '1.5px solid rgba(176,120,72,0.3)',
                    }}
                  >
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
                      style={{ originX: '50%', originY: '50%' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <line x1="5" y1="0" x2="5" y2="10" stroke={isOpen ? '#B07848' : 'rgba(176,120,72,0.5)'} strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="0" y1="5" x2="10" y2="5" stroke={isOpen ? '#B07848' : 'rgba(176,120,72,0.5)'} strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                  </div>
                </motion.button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="flex gap-5 pb-7">
                        {/* Left accent bar */}
                        <div className="w-6 shrink-0 flex justify-end">
                          <motion.div
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            exit={{ scaleY: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-px h-full"
                            style={{ background: 'linear-gradient(to bottom, #B07848, transparent)', transformOrigin: 'top' }}
                          />
                        </div>
                        <p
                          className="flex-1 font-outfit text-sm leading-[1.85] pr-8"
                          style={{ color: '#5A6478' }}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-14 text-center">
          <p className="font-outfit text-sm text-[#6B7280] mb-4">
            Still have questions? Our team is ready to help.
          </p>
          <a
            href="#contact"
            onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 font-cinzel text-[0.68rem] tracking-[0.2em] uppercase font-bold transition-all duration-200 hover:gap-3"
            style={{ color: '#B07848' }}
          >
            Get in Touch
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}
