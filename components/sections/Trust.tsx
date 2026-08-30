'use client'

import { useEffect, useState, useRef } from 'react'
import { FileText, X, Star, ShieldCheck, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Document verification data
const DOCUMENTS = [
  { id: 'layout-plan',          label: 'Layout Plan'         },
  { id: 'approval-documents',   label: 'Approval Documents'  },
  { id: 'legal-documents',      label: 'Legal Documents'     },
  { id: 'payment-schedule',     label: 'Payment Schedule'    },
  { id: 'booking-process',      label: 'Booking Process'     },
]

const DEFAULT_TESTIMONIALS = [
  {
    id: '1',
    author: 'Dinesh Shetty',
    role: 'Property Investor',
    company: 'Khadka Holdings • Plot 18',
    body: 'Buying a villa plot at Dollars Colony was one of our best decisions. The coastal breeze, private clubhouse amenities, and secure gated perimeter give our family absolute peace of mind.',
    rating: 5,
  },
  {
    id: '2',
    author: 'Prakash Arjun',
    role: 'Resident Owner',
    company: 'Retired Chief Engineer • Plot 06',
    body: 'Exceptional transparency and professional handling throughout. From clear title deeds to timely infrastructure development, Sri Brahmari Developers delivered exactly on their promises.',
    rating: 5,
  },
  {
    id: '3',
    author: 'Dipesh Sharma',
    role: 'Coastal Villa Owner',
    company: 'TechSolutions • NRI (Dubai, UAE)',
    body: 'The location in Kundapura is unmatched—moments from Kodi Beach yet seamlessly connected to NH66. The clubhouse, wide paved roads, and landscaped gardens make this a world-class retreat.',
    rating: 5,
  },
  {
    id: '4',
    author: 'Dr. Ananya Kamath',
    role: 'Healthcare Professional',
    company: 'Villa Plot Owner • Mangalore',
    body: 'The serenity of Dollars Colony is truly unmatched. Having a bespoke villa plot surrounded by lush greenery, underground utilities, and 24/7 security is everything we envisioned.',
    rating: 5,
  },
]

export function Trust() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('')
  const [testimonials, setTestimonials] = useState<Array<{ id: string; author: string; role: string | null; company: string | null; body: string; rating: number }>>(DEFAULT_TESTIMONIALS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch('/api/public/testimonials', { cache: 'no-store' })
        const json = await res.json()
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setTestimonials(json.data)
        }
      } catch {
        // Keep DEFAULT_TESTIMONIALS
      }
    }
    loadTestimonials()
  }, [])

  // Autoplay with pause on hover
  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) return
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 6500)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [testimonials.length, isPaused])

  function handleDocClick(label: string) {
    setSelected(label)
    setOpen(true)
  }

  const total = testimonials.length
  const getIndex = (offset: number) => {
    if (total === 0) return 0
    return (currentIndex + offset + total) % total
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  function TestimonialCard({
    testimonial,
    isActive,
    onClick,
  }: {
    testimonial: any
    isActive: boolean
    onClick?: () => void
  }) {
    if (!testimonial) return null
    const initials = getInitials(testimonial.author)

    return (
      <div
        onClick={onClick}
        className={`relative w-full rounded-2xl transition-all duration-500 overflow-hidden flex flex-col justify-between p-7 md:p-8 select-none ${
          isActive
            ? 'scale-100 opacity-100 z-20 shadow-[0_24px_50px_-12px_rgba(13,31,45,0.45),0_0_25px_rgba(201,168,76,0.18)] min-h-[380px]'
            : 'scale-[0.92] opacity-55 hover:opacity-85 z-10 cursor-pointer min-h-[350px]'
        }`}
        style={{
          background: isActive
            ? 'linear-gradient(145deg, #0D1F2D 0%, #152B3C 60%, #0D1F2D 100%)'
            : 'linear-gradient(145deg, #0A1924 0%, #102433 100%)',
          border: isActive
            ? '1px solid rgba(201, 168, 76, 0.55)'
            : '1px solid rgba(201, 168, 76, 0.18)',
        }}
      >
        {/* Subtle Ambient Gold Gradient Ray */}
        {isActive && (
          <div
            className="absolute -top-24 -right-24 w-52 h-52 rounded-full pointer-events-none blur-3xl opacity-20"
            style={{ background: 'radial-gradient(circle, #ECC87A 0%, transparent 70%)' }}
          />
        )}

        {/* Decorative Luxury Corner Brackets */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#C9A84C]/40 rounded-tl pointer-events-none" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#C9A84C]/40 rounded-tr pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#C9A84C]/40 rounded-bl pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#C9A84C]/40 rounded-br pointer-events-none" />

        {/* Card Header: Rating + Verified Badge */}
        <div className="flex items-center justify-between gap-2 pb-5 border-b border-white/[0.08] relative z-10">
          {/* Star Rating */}
          <div className="flex items-center gap-1">
            {[...Array(testimonial.rating || 5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-[#E6CA65] text-[#E6CA65] drop-shadow-[0_1px_4px_rgba(230,202,101,0.4)]"
              />
            ))}
          </div>

          {/* Verified Owner Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/40 text-[#ECC87A] text-[11px] font-semibold tracking-wide shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ECC87A]" />
            <span>Verified Owner</span>
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="my-5 relative z-10 flex-1 flex flex-col justify-center">
          <Quote className="w-6 h-6 text-[#C9A84C]/25 mb-2 rotate-180" />
          <p className="font-playfair text-[15px] md:text-base leading-relaxed text-[#FAF6EE]/95 italic">
            &ldquo;{testimonial.body}&rdquo;
          </p>
        </div>

        {/* Author Details Footer */}
        <div className="pt-4 border-t border-white/[0.08] relative z-10 flex items-center gap-3.5">
          {/* Embossed Medallion Monogram Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#B07848] via-[#ECC87A] to-[#D4AF37] shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
              <div className="w-full h-full rounded-full bg-[#0D1F2D] flex items-center justify-center border border-[#ECC87A]/30">
                <span className="font-cinzel text-sm font-bold text-[#ECC87A] tracking-wider">
                  {initials}
                </span>
              </div>
            </div>
            {/* Small status dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0D1F2D] flex items-center justify-center p-[1px]">
              <div className="w-full h-full rounded-full bg-[#10B981] flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Author Text */}
          <div className="min-w-0 flex-1 text-left">
            <h4 className="font-cinzel font-bold text-sm md:text-base text-[#FAF6EE] tracking-wide truncate">
              {testimonial.author}
            </h4>
            {(testimonial.role || testimonial.company) && (
              <p className="text-[11px] md:text-xs text-[#ECC87A] font-medium tracking-wider uppercase truncate mt-0.5">
                {[testimonial.role, testimonial.company].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <section
      id="trust"
      className="py-16 md:py-20 lg:py-24 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #F8F5EE 0%, #EFE9DE 50%, #F5F0E8 100%)',
        borderTop: '1px solid #E2D9CC',
        borderBottom: '1px solid #E2D9CC',
      }}
    >
      {/* Subtle Background Luxury Watermark Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#C9A84C_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-5 md:px-12 relative z-10">
        
        {/* ── SECTION 1: PROJECT DOCUMENTS & TRANSPARENCY ── */}
        <div className="mb-14 md:mb-18 text-center max-w-3xl mx-auto">
          {/* Top Flourish Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1F2D]/5 border border-[#C9A84C]/30 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B07848]" />
            <span className="font-outfit text-xs font-bold uppercase tracking-[0.2em] text-[#0D1F2D]">
              Legal Assurance & Diligence
            </span>
          </div>

          <h2 className="text-section-title font-playfair font-bold text-3xl md:text-4xl lg:text-[42px] tracking-tight" style={{ color: '#0D1F2D' }}>
            Project Documents & Transparency
          </h2>
          <p className="mt-3.5 text-sm md:text-base leading-relaxed font-outfit" style={{ color: '#4A5568' }}>
            We uphold the highest benchmarks of development integrity. All project approvals, layout sanctions, and legal titles are open for investor review.
          </p>

          {/* Document Action Cards */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:gap-4">
            {DOCUMENTS.map((doc) => (
              <button
                key={doc.id}
                id={`trust-doc-${doc.id}`}
                onClick={() => handleDocClick(doc.label)}
                className="group flex items-center gap-3 rounded-xl border px-5 py-3.5 text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  background: '#FFFFFF',
                  borderColor: 'rgba(201,168,76,0.3)',
                  color: '#0D1F2D',
                }}
              >
                <div className="w-8 h-8 rounded-lg bg-[#0D1F2D]/5 flex items-center justify-center group-hover:bg-[#C9A84C]/20 transition-colors">
                  <FileText className="h-4 w-4 text-[#B07848] group-hover:text-[#0D1F2D] transition-colors" />
                </div>
                <span>{doc.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── SECTION 2: LUXURY CLIENT TESTIMONIALS ── */}
        <div
          className="mt-20 pt-16 border-t border-[#D9CEBF] relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Header */}
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-8 h-[1px] bg-[#C9A84C]" />
              <p className="font-outfit text-xs font-bold uppercase tracking-[0.25em] text-[#B07848]">
                Verified Investor & Resident Stories
              </p>
              <span className="w-8 h-[1px] bg-[#C9A84C]" />
            </div>

            <h3 className="font-playfair font-bold text-3xl md:text-4xl text-[#0D1F2D] tracking-tight">
              What Our Community Says
            </h3>
            <p className="mt-2.5 text-sm md:text-base text-[#4A5568] font-outfit">
              Hear directly from plot owners and NRI investors who chose Dollars Colony for their coastal sanctuary.
            </p>
          </div>

          {/* Desktop 3-Card Carousel */}
          <div className="relative mx-auto max-w-6xl">
            {/* Left Nav Arrow */}
            <button
              onClick={() => setCurrentIndex(getIndex(-1))}
              className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full items-center justify-center bg-[#0D1F2D] text-[#ECC87A] border border-[#C9A84C]/50 shadow-xl transition-all hover:scale-110 hover:border-[#ECC87A] hover:bg-[#152B3C]"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Nav Arrow */}
            <button
              onClick={() => setCurrentIndex(getIndex(1))}
              className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full items-center justify-center bg-[#0D1F2D] text-[#ECC87A] border border-[#C9A84C]/50 shadow-xl transition-all hover:scale-110 hover:border-[#ECC87A] hover:bg-[#152B3C]"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Desktop Grid View */}
            <div className="hidden md:grid md:grid-cols-3 gap-6 items-center min-h-[400px]">
              {/* Previous Card */}
              <div className="h-full flex items-center">
                <TestimonialCard
                  testimonial={testimonials[getIndex(-1)]}
                  isActive={false}
                  onClick={() => setCurrentIndex(getIndex(-1))}
                />
              </div>

              {/* Active Center Card */}
              <div className="h-full flex items-center">
                <TestimonialCard
                  testimonial={testimonials[getIndex(0)]}
                  isActive={true}
                />
              </div>

              {/* Next Card */}
              <div className="h-full flex items-center">
                <TestimonialCard
                  testimonial={testimonials[getIndex(1)]}
                  isActive={false}
                  onClick={() => setCurrentIndex(getIndex(1))}
                />
              </div>
            </div>

            {/* Mobile Swipe Card View */}
            <div className="md:hidden overflow-hidden py-2 px-1">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 40) {
                    setCurrentIndex(getIndex(-1))
                  } else if (info.offset.x < -40) {
                    setCurrentIndex(getIndex(1))
                  }
                }}
                className="cursor-grab active:cursor-grabbing"
              >
                <TestimonialCard
                  testimonial={testimonials[getIndex(0)]}
                  isActive={true}
                />
              </motion.div>
            </div>
          </div>

          {/* Navigation Controls & Pagination Indicators */}
          <div className="mt-10 flex flex-col items-center gap-4">
            {/* Pagination Dots */}
            <div className="flex items-center gap-2.5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-400 ${
                    index === currentIndex
                      ? 'w-8 bg-gradient-to-r from-[#B07848] to-[#C9A84C] shadow-sm'
                      : 'w-2.5 bg-[#C9A84C]/35 hover:bg-[#C9A84C]/60'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Mobile Arrow buttons */}
            <div className="flex lg:hidden items-center gap-4 mt-2">
              <button
                onClick={() => setCurrentIndex(getIndex(-1))}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0D1F2D] text-[#ECC87A] border border-[#C9A84C]/40 shadow-md"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-mono font-semibold text-[#0D1F2D]">
                {currentIndex + 1} / {testimonials.length}
              </span>
              <button
                onClick={() => setCurrentIndex(getIndex(1))}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0D1F2D] text-[#ECC87A] border border-[#C9A84C]/40 shadow-md"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* "Available on request" Modal */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                key="trust-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                key="trust-modal"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div
                  className="relative w-full max-w-md rounded-2xl p-8 text-center shadow-2xl border border-[#C9A84C]/30"
                  style={{ background: '#FDFAF5' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setOpen(false)}
                    className="absolute right-4 top-4 rounded-full p-2 text-[#4A5568] hover:bg-black/5 transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner"
                    style={{ background: 'rgba(176,120,72,0.12)' }}
                  >
                    <FileText className="h-7 w-7" style={{ color: '#B07848' }} />
                  </div>

                  <h3 className="font-playfair text-xl font-bold text-[#0D1F2D]">
                    {selected}
                  </h3>
                  
                  <p className="mt-3 text-sm leading-relaxed text-[#4A5568] font-outfit">
                    This official project document is available for verified investor review. Contact our executive team to receive the copy instantly via WhatsApp or Email.
                  </p>

                  <button
                    onClick={() => {
                      setOpen(false)
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="mt-6 w-full rounded-xl py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:opacity-95"
                    style={{
                      background: 'linear-gradient(135deg, #0D1F2D 0%, #1A3950 100%)',
                      border: '1px solid rgba(201,168,76,0.4)',
                    }}
                  >
                    Request Document Copy
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
