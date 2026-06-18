'use client'

import { motion } from 'framer-motion'
import { distances } from '@/data/distances'
import * as Icons from 'lucide-react'

type LucideIconName = keyof typeof Icons

function DynamicIcon({ name }: { name: string }) {
  const Icon = Icons[name as LucideIconName] as React.ElementType | undefined
  if (!Icon) return null
  return <Icon className="h-4 w-4" />
}

export function Location() {
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
  const mapQuery = '13.6252003,74.6792679'
  const directionsHref = 'https://www.google.com/maps/dir//13.6252003,74.6792679/@13.6252003,74.676693,17z/data=!4m6!1m5!3m4!2zMTPCsDM3JzMwLjciTiA3NMKwNDAnNDUuNCJF!8m2!3d13.6252003!4d74.6792679?hl=en&entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D'
  const mapSrc = mapsKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${mapQuery}`
    : `https://maps.google.com/maps?q=${mapQuery}&t=&z=17&ie=UTF8&iwloc=&output=embed`

  return (
    <section id="location" className="py-7 md:py-10 lg:py-12" style={{ background: '#F5F0E8' }}>
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        {/* Header */}
        <div className="mb-8 md:mb-10 text-center">
          <p className="font-playfair text-sm italic tracking-widest" style={{ color: '#B07848' }}>
            Location Advantage
          </p>
          <h2 className="text-section-title mt-3 font-playfair font-bold" style={{ color: '#0D1F2D' }}>
            Connected to the Town. Close to the Coast.
          </h2>
        </div>

        <div className="grid gap-6 md:gap-10 md:grid-cols-2 md:items-start">
          {/* Google Maps embed */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-xl group"
            style={{ border: '1px solid #E2D9CC' }}
          >
            <iframe
              title="Dollars Colony location on Google Maps"
              src={mapSrc}
              width="100%"
              height="360"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            
            {/* Transparent overlay for mobile to prevent scroll-trapping and open native maps app */}
            <a 
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10 md:hidden"
              aria-label="Open in Google Maps"
            />

            {/* Explicit 'Open in Maps' Button */}
            <a 
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-2xl transition-transform hover:scale-105 backdrop-blur-md"
              style={{ background: 'rgba(13,31,45,0.9)', border: '1px solid rgba(212,164,106,0.4)' }}
            >
              <Icons.Navigation className="h-4 w-4 text-[#D4A46A]" />
              Open in Maps
            </a>
          </motion.div>

          {/* Distance cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-3"
          >
            {distances.map(d => (
              <div
                key={d.place}
                className="flex items-center justify-between rounded-xl px-4 md:px-5 py-3.5 md:py-4"
                style={{ background: '#fff', border: '1px solid #E2D9CC' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: 'rgba(176,120,72,0.12)', color: '#B07848' }}
                  >
                    <DynamicIcon name={d.icon} />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: '#0D1F2D' }}>{d.place}</p>
                </div>
                <div className="text-right">
                  {d.distance && <p className="font-mono text-sm font-semibold" style={{ color: '#0D1F2D' }}>{d.distance}</p>}
                  <p className="font-mono text-xs font-semibold" style={{ color: '#8A9BB0' }}>{d.time}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
