'use client'

import { useState, useEffect } from 'react'
import { Loader2, CheckCircle2, Phone, MessageCircle, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { analytics } from '@/lib/analytics'

const INTEREST_OPTIONS = ['Lifestyle', 'Premium', 'Signature', 'Investment', 'Site Visit']

interface Props {
  onBrochureClick?: () => void
}

export function Contact({ onBrochureClick }: Props) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919035624148'
  const phoneNumber    = process.env.NEXT_PUBLIC_PHONE_NUMBER    ?? '9035624148'
  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi, I'm interested in Dollars Colony")}`

  const [form, setForm] = useState({ name: '', phone: '', city: '', interestedIn: '' })
  const [loading, setLoading]  = useState(false)
  const [success, setSuccess]  = useState(false)
  const [error,   setError]    = useState<string | null>(null)
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null)

  useEffect(() => {
    const handleSelectPlot = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail) {
        setForm(p => ({ ...p, interestedIn: detail.category }))
        setSelectedPlot(detail.plotId)
      }
    }
    window.addEventListener('selectPlot', handleSelectPlot)
    return () => window.removeEventListener('selectPlot', handleSelectPlot)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.interestedIn) { setError('Please select a plot collection or interest.'); return }
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, selectedPlot, source: 'contact-form', timestamp: new Date().toISOString() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? 'Submission failed.')
      setSuccess(true)
      analytics.leadFormSubmitted(form.interestedIn)
      setForm({ name: '', phone: '', city: '', interestedIn: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="pt-3 pb-7 md:pb-10 lg:pb-12 relative overflow-hidden" style={{ background: '#0D1F2D' }}>
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
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-12">
        <div className="grid gap-7 md:gap-10 md:grid-cols-2 md:items-start">

          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-playfair text-sm italic tracking-widest" style={{ color: '#B07848' }}>
              Get in Touch
            </p>
            <h2 className="text-section-title mt-3 font-playfair font-bold text-white">
              Schedule a Site Visit
            </h2>
            <p className="mt-4 md:mt-5 max-w-sm text-sm leading-relaxed" style={{ color: '#8A9BB0' }}>
              Our team is happy to walk you through the project, answer questions, and arrange a site
              visit at your convenience.
            </p>

            {/* Contact action buttons */}
            <div className="mt-6 md:mt-8 flex flex-col gap-2.5 md:gap-3">
              <a
                id="contact-call-btn"
                href={`tel:${phoneNumber}`}
                onClick={() => analytics.callClick('contact-section')}
                className="flex items-center gap-3 rounded-lg md:rounded-xl px-4 md:px-5 py-3.5 md:py-4 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Phone className="h-5 w-5" style={{ color: '#B07848' }} />
                Call Now
              </a>
              <a
                id="contact-whatsapp-btn"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.whatsappClick('contact-section')}
                className="flex items-center gap-3 rounded-lg md:rounded-xl px-4 md:px-5 py-3.5 md:py-4 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#25D366' }}
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Now
              </a>
              <button
                id="contact-brochure-btn"
                onClick={onBrochureClick}
                className="flex items-center gap-3 rounded-lg md:rounded-xl px-4 md:px-5 py-3.5 md:py-4 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#B07848' }}
              >
                <Download className="h-5 w-5" />
                Download Brochure
              </button>
            </div>
            
            {/* Direct Contact Info */}
            <div className="mt-6 md:mt-8 flex flex-col gap-2.5 md:gap-3 font-outfit text-sm text-white/70">
              <p><strong className="text-white">Call/WhatsApp:</strong> 903-562-4148</p>
              <p>
                <strong className="text-white">Email:</strong>{' '}
                <a href="mailto:sales@dollarscolony.in" className="hover:text-white transition-colors">sales@dollarscolony.in</a>
              </p>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="rounded-xl md:rounded-2xl p-5 md:p-8 relative overflow-hidden group"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
          >

            {success ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <CheckCircle2 className="h-12 w-12" style={{ color: '#B07848' }} />
                <h3 className="font-playfair text-xl font-bold text-white">Thank You!</h3>
                <p className="text-sm" style={{ color: '#8A9BB0' }}>
                  We have received your enquiry. Our team will be in touch within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 rounded-xl px-6 py-3 text-sm font-semibold text-white"
                  style={{ background: '#B07848' }}
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 md:space-y-4" noValidate>
                {selectedPlot && (
                  <div className="flex items-center justify-between rounded-xl px-4 py-3 text-sm border border-[#D4A46A]/35" style={{ background: 'rgba(212, 164, 106, 0.08)', color: '#D4A46A' }}>
                    <span className="font-outfit font-medium">Selected Plot: <span className="font-mono font-bold text-white text-base">{selectedPlot}</span></span>
                    <button type="button" onClick={() => setSelectedPlot(null)} className="text-white/60 hover:text-white text-xs underline">
                      Clear
                    </button>
                  </div>
                )}
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#8A9BB0' }}>
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full rounded-lg md:rounded-xl border px-4 py-3 md:py-3.5 text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)', color: '#fff' }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="contact-phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#8A9BB0' }}>
                    Phone Number *
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    pattern="[6-9][0-9]{9}"
                    maxLength={10}
                    className="w-full rounded-lg md:rounded-xl border px-4 py-3 md:py-3.5 text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)', color: '#fff' }}
                  />
                </div>

                {/* City */}
                <div>
                  <label htmlFor="contact-city" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#8A9BB0' }}>
                    City *
                  </label>
                  <input
                    id="contact-city"
                    name="city"
                    type="text"
                    required
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Your city"
                    className="w-full rounded-lg md:rounded-xl border px-4 py-3 md:py-3.5 text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)', color: '#fff' }}
                  />
                </div>

                {/* Interested In */}
                <div>
                  <label htmlFor="contact-interest" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#8A9BB0' }}>
                    Interested In *
                  </label>
                  <select
                    id="contact-interest"
                    name="interestedIn"
                    required
                    value={form.interestedIn}
                    onChange={handleChange}
                    className="w-full rounded-lg md:rounded-xl border px-4 py-3 md:py-3.5 text-sm outline-none transition-all"
                    style={{ background: '#1A3348', borderColor: 'rgba(255,255,255,0.12)', color: form.interestedIn ? '#fff' : '#8A9BB0' }}
                  >
                    <option value="" disabled>Select a collection or interest</option>
                    {INTEREST_OPTIONS.map(o => (
                      <option key={o} value={o} style={{ background: '#1A3348', color: '#fff' }}>{o}</option>
                    ))}
                  </select>
                </div>

                {/* Error */}
                {error && (
                  <p className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(192,57,43,0.15)', color: '#ff7675' }}>
                    {error}
                  </p>
                )}

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg md:rounded-xl py-3.5 md:py-4 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: '#B07848' }}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Submitting...' : 'Schedule Site Visit'}
                </button>

                <p className="text-center text-xs" style={{ color: '#4A5568' }}>
                  No spam. Your details are kept private and used only to respond to your enquiry.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
