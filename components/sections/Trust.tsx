'use client'

import { useEffect, useState } from 'react'
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
  const [testimonials, setTestimonials] = useState<Array<{ id: string; author: string; role: string | null; company: string | null; body: string; rating: number }>>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch('/api/public/testimonials', { cache: 'no-store' })
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setTestimonials(json.data)
        }
      } catch {
        setTestimonials([])
      }
    }

    loadTestimonials()
  }, [])

  // Autoplay
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  function handleDocClick(label: string) {
    setSelected(label)
    setOpen(true)
  }

  const total = testimonials.length;
  const getIndex = (offset: number) => {
    if (total === 0) return 0;
    return (currentIndex + offset + total) % total;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  function TestimonialCard({ testimonial, isActive }: { testimonial: any; isActive: boolean }) {
    if (!testimonial) return null;
    const initials = getInitials(testimonial.author);
    
    return (
      <div 
        className={`relative w-full rounded-2xl bg-[#595959] text-white p-6 md:p-8 flex flex-col items-center justify-between text-center transition-all duration-500 ${
          isActive ? 'shadow-2xl md:scale-105 z-10 opacity-100 min-h-[350px]' : 'opacity-65 scale-95 min-h-[320px]'
        }`}
      >
        {/* Circle Initials Badge */}
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#D4A46A] bg-[#0D1F2D] text-[#D4A46A] font-semibold text-base tracking-wider shadow-md">
          {initials}
        </div>

        {/* Testimonial body */}
        <p className="flex-1 text-sm md:text-base leading-relaxed text-[#F5F0E8] font-light max-w-sm italic mb-6">
          “{testimonial.body}”
        </p>

        {/* Author Details */}
        <div className="mt-auto">
          <p className="font-semibold text-base text-[#FDFAF5]">{testimonial.author}</p>
          {(testimonial.role || testimonial.company) && (
            <p className="text-xs text-[#D4A46A] mt-1 uppercase tracking-wider font-semibold">
              {[testimonial.role, testimonial.company].filter(Boolean).join(' • ')}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <section 
      className="py-12 md:py-16 lg:py-20 relative overflow-hidden" 
      style={{ 
        background: 'radial-gradient(circle at center, #F4F2EE 0%, #EAE6DF 100%)',
        borderTop: '1px solid #E2D9CC',
        borderBottom: '1px solid #E2D9CC'
      }}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        {/* Header */}
        <div className="mb-8 md:mb-10 text-center">
          <p className="font-playfair text-sm italic tracking-widest" style={{ color: '#B07848' }}>
            Project Documents
          </p>
          <h2 className="text-section-title mt-3 font-playfair font-bold" style={{ color: '#0D1F2D' }}>
            Project Documents & Transparency
          </h2>
          <p className="mt-3 md:mt-4 mx-auto max-w-xl text-sm leading-relaxed" style={{ color: '#4A5568' }}>
            We believe in complete transparency. All project documents are available on request.
          </p>
        </div>

        {/* Document buttons */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {DOCUMENTS.map(doc => (
            <button
              key={doc.id}
              id={`trust-doc-${doc.id}`}
              onClick={() => handleDocClick(doc.label)}
              className="flex items-center gap-2.5 md:gap-3 rounded-lg md:rounded-xl border px-4 md:px-6 py-3 md:py-4 text-sm font-semibold transition-all hover:shadow-md hover:scale-[1.02]"
              style={{ background: '#fff', borderColor: '#E2D9CC', color: '#0D1F2D' }}
            >
              <FileText className="h-4 w-4" style={{ color: '#B07848' }} />
              {doc.label}
            </button>
          ))}
        </div>

        {/* Testimonials Redesigned Subsection */}
        {testimonials.length > 0 && (
          <div className="mt-16 md:mt-20 border-t border-[#E2D9CC]/80 pt-16 relative">
            {/* Subsection Header */}
            <div className="mb-12 text-center">
              <p className="font-playfair text-sm italic tracking-widest" style={{ color: '#B07848' }}>
                Client Testimonials
              </p>
              <h3 className="mt-3 font-playfair font-bold text-2xl md:text-3xl" style={{ color: '#0D1F2D' }}>
                What Our Clients Say
              </h3>
            </div>

            {/* Decorative Quotes wrapper */}
            <div className="relative mx-auto max-w-5xl px-2 md:px-12">
              <span className="absolute -left-2 md:-left-4 -top-8 font-playfair text-[8rem] md:text-[10rem] font-bold text-[#D4A46A]/10 leading-none select-none pointer-events-none">
                “
              </span>
              <span className="absolute -right-2 md:-right-4 -bottom-16 font-playfair text-[8rem] md:text-[10rem] font-bold text-[#D4A46A]/10 leading-none select-none pointer-events-none">
                ”
              </span>

              {/* Desktop Slider View (3 Columns visible) */}
              <div className="hidden md:grid md:grid-cols-3 gap-6 items-center min-h-[380px] px-4">
                {/* Left Card */}
                <div 
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                  onClick={() => setCurrentIndex(getIndex(-1))}
                >
                  <TestimonialCard testimonial={testimonials[getIndex(-1)]} isActive={false} />
                </div>

                {/* Center Card (Active) */}
                <div>
                  <TestimonialCard testimonial={testimonials[getIndex(0)]} isActive={true} />
                </div>

                {/* Right Card */}
                <div 
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                  onClick={() => setCurrentIndex(getIndex(1))}
                >
                  <TestimonialCard testimonial={testimonials[getIndex(1)]} isActive={false} />
                </div>
              </div>

              {/* Mobile View with swipe drag */}
              <div className="md:hidden overflow-hidden py-4 px-2">
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(event, info) => {
                    if (info.offset.x > 50) {
                      setCurrentIndex(getIndex(-1));
                    } else if (info.offset.x < -50) {
                      setCurrentIndex(getIndex(1));
                    }
                  }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <TestimonialCard testimonial={testimonials[getIndex(0)]} isActive={true} />
                </motion.div>
                <p className="text-center text-xs text-[#8A9BB0] mt-3 italic">Swipe left or right to view more</p>
              </div>
            </div>

            {/* Dots navigation */}
            {testimonials.length > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'w-6 bg-[#0D1F2D]' : 'w-2 bg-[#BDB5A7]'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

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
