'use client'

import { useState } from 'react'
import { FileText, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Only activate document badges when client confirms documents are available.
// Do NOT add RERA, CRZ, or bank approval badges without client confirmation.
const DOCUMENTS = [
  { id: 'layout-plan',          label: 'Layout Plan'         },
  { id: 'approval-documents',   label: 'Approval Documents'  },
  { id: 'legal-documents',      label: 'Legal Documents'     },
  { id: 'payment-schedule',     label: 'Payment Schedule'    },
  { id: 'booking-process',      label: 'Booking Process'     },
]

export function Trust() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('')

  function handleDocClick(label: string) {
    setSelected(label)
    setOpen(true)
  }

  return (
    <section className="py-10 md:py-12 lg:py-14" style={{ background: '#FDFAF5' }}>
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="font-playfair text-sm italic tracking-widest" style={{ color: '#B07848' }}>
            Project Documents
          </p>
          <h2 className="text-section-title mt-3 font-playfair font-bold" style={{ color: '#0D1F2D' }}>
            Project Documents & Transparency
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-sm leading-relaxed" style={{ color: '#4A5568' }}>
            We believe in complete transparency. All project documents are available on request.
          </p>
        </div>

        {/* Document buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {DOCUMENTS.map(doc => (
            <button
              key={doc.id}
              id={`trust-doc-${doc.id}`}
              onClick={() => handleDocClick(doc.label)}
              className="flex items-center gap-3 rounded-xl border px-6 py-4 text-sm font-semibold transition-all hover:shadow-md hover:scale-[1.02]"
              style={{ background: '#fff', borderColor: '#E2D9CC', color: '#0D1F2D' }}
            >
              <FileText className="h-4 w-4" style={{ color: '#B07848' }} />
              {doc.label}
            </button>
          ))}
        </div>

        {/* "Available on request" modal */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                key="trust-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                key="trust-modal"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div
                  className="relative w-full max-w-sm rounded-2xl p-8 text-center shadow-2xl"
                  style={{ background: '#FDFAF5' }}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => setOpen(false)}
                    className="absolute right-4 top-4 rounded-full p-1.5 transition-colors hover:bg-black/10"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" style={{ color: '#4A5568' }} />
                  </button>
                  <div
                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: 'rgba(176,120,72,0.12)' }}
                  >
                    <FileText className="h-6 w-6" style={{ color: '#B07848' }} />
                  </div>
                  <h3 className="font-playfair text-lg font-bold" style={{ color: '#0D1F2D' }}>
                    {selected}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: '#4A5568' }}>
                    This document is available on request. Please contact our team and we will share it with you directly.
                  </p>
                  <button
                    onClick={() => {
                      setOpen(false)
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="mt-6 w-full rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: '#B07848' }}
                  >
                    Request Document
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
