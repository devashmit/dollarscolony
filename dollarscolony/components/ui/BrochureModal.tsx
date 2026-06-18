'use client'

import { useState } from 'react'
import { X, Download, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { analytics } from '@/lib/analytics'

interface Props {
  open: boolean
  onClose: () => void
  source?: string
  selectedPlot?: string
}

export function BrochureModal({ open, onClose, source = 'brochure-download', selectedPlot }: Props) {
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/brochure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, selectedPlot, source }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? 'Request failed.')

      analytics.brochureDownloaded(source)
      
      setSuccess(true)
      setName('')
      setPhone('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function handleOpen() {
    analytics.brochureInitiated(source)
  }

  return (
    <AnimatePresence onExitComplete={() => { setError(null); setSuccess(false) }}>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            onAnimationStart={handleOpen}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl"
              style={{ background: '#FDFAF5' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-full p-1.5 transition-colors hover:bg-black/10"
              >
                <X className="h-5 w-5" style={{ color: '#4A5568' }} />
              </button>

              {success ? (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center mb-2" style={{ background: 'rgba(37, 211, 102, 0.15)' }}>
                    <svg className="h-6 w-6" style={{ color: '#25D366' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-playfair text-xl font-bold" style={{ color: '#0D1F2D' }}>
                    Thank you for your interest in Dollars Colony.
                  </h3>
                  <p className="text-sm" style={{ color: '#4A5568' }}>
                    Our team will share the pre-launch details and brochure on WhatsApp shortly.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 w-full rounded-lg py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: '#B07848' }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="mb-6">
                    <p className="font-playfair text-xs italic tracking-widest" style={{ color: '#B07848' }}>
                      {selectedPlot ? `Inquiry for Plot ${selectedPlot}` : 'Project Brochure'}
                    </p>
                    <h2 className="mt-1 font-playfair text-2xl font-bold" style={{ color: '#0D1F2D' }}>
                      {selectedPlot ? `Inquire Plot ${selectedPlot}` : 'Download Brochure'}
                    </h2>
                    <p className="mt-2 text-sm" style={{ color: '#8A9BB0' }}>
                      {selectedPlot 
                        ? `Share your details to receive information about Plot ${selectedPlot} instantly.` 
                        : 'Share your details to receive the Dollars Colony brochure instantly.'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="brochure-name" className="mb-1 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#4A5568' }}>
                        Full Name
                      </label>
                      <input
                        id="brochure-name"
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                        style={{ borderColor: '#E2D9CC', background: '#fff', color: '#0D1F2D' }}
                      />
                    </div>
                    <div>
                      <label htmlFor="brochure-phone" className="mb-1 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#4A5568' }}>
                        Phone Number
                      </label>
                      <input
                        id="brochure-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        pattern="[6-9][0-9]{9}"
                        maxLength={10}
                        className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                        style={{ borderColor: '#E2D9CC', background: '#fff', color: '#0D1F2D' }}
                      />
                    </div>

                    {error && (
                      <p className="rounded-lg px-4 py-2 text-sm" style={{ background: '#fff0f0', color: '#c0392b' }}>
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      id="brochure-submit-btn"
                      className="flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                      style={{ background: '#B07848' }}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      {loading ? 'Submitting...' : 'Enquire Now'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
