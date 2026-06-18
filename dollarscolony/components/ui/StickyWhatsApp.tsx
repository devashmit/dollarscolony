'use client'

import { MessageCircle } from 'lucide-react'
import { analytics } from '@/lib/analytics'

interface Props {
  phoneNumber?: string
  message?: string
}

export function StickyWhatsApp({
  phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919035624148',
  message = "Hi, I'm interested in Dollars Colony",
}: Props) {
  const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      id="sticky-whatsapp"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onClick={() => analytics.whatsappClick('sticky-button')}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-3 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      style={{ background: '#25D366' }}
    >
      <MessageCircle className="h-5 w-5 text-white" fill="white" />
      <span className="hidden text-sm font-semibold text-white sm:block">WhatsApp</span>
    </a>
  )
}
