'use client'

import { Phone } from 'lucide-react'
import { analytics } from '@/lib/analytics'

interface Props {
  phoneNumber?: string
}

export function StickyCall({
  phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? '+916361512031',
}: Props) {
  return (
    <a
      id="sticky-call"
      href={`tel:${phoneNumber}`}
      aria-label="Call us now"
      onClick={() => analytics.callClick('sticky-button')}
      className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-300 hover:scale-105 md:hidden"
      style={{ background: '#0D1F2D' }}
    >
      <Phone className="h-6 w-6 text-white" />
    </a>
  )
}
