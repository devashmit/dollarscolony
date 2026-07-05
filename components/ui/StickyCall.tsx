'use client'

import { Phone } from 'lucide-react'
import { analytics } from '@/lib/analytics'

import { useApiData } from '@/hooks/use-api-data'

interface Props {
  phoneNumber?: string;
}

export function StickyCall({
  phoneNumber = '9035624148',
}: Props) {
  const { config } = useApiData();
  const activePhone = config.phone_number || phoneNumber;

  return (
    <a
      id="sticky-call"
      href={`tel:${activePhone}`}
      aria-label="Call us now"
      onClick={() => analytics.callClick('sticky-button')}
      className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-300 hover:scale-105 md:hidden"
      style={{ background: '#0D1F2D' }}
    >
      <Phone className="h-6 w-6 text-white" />
    </a>
  )
}
