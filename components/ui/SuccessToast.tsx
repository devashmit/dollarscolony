'use client'

import { CheckCircle2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  message?: string
  visible: boolean
  onClose: () => void
}

export function SuccessToast({
  message = 'Thank you! We will be in touch shortly.',
  visible,
  onClose,
}: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35 }}
          className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl px-5 py-4 shadow-2xl"
          style={{ background: '#0D1F2D', minWidth: 280 }}
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: '#B07848' }} />
          <p className="text-sm font-medium text-white">{message}</p>
          <button
            onClick={onClose}
            aria-label="Dismiss notification"
            className="ml-auto rounded p-0.5 transition-opacity hover:opacity-70"
          >
            <X className="h-4 w-4 text-white/60" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
