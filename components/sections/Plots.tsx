'use client'

import { motion } from 'framer-motion'
import { plotCollections, PlotCollection } from '@/data/plots'
import { analytics } from '@/lib/analytics'


interface Props {
  onBrochureClick?: () => void
}

function PlotCard({ collection, index, onBrochureClick }: { collection: PlotCollection; index: number; onBrochureClick?: () => void }) {
  const isFeatured = collection.featured

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.65, 0, 0.35, 1] }}
      onViewportEnter={() => analytics.plotCardViewed(collection.id)}
      className="relative flex flex-col h-full group"
      style={{
        background: isFeatured ? '#0D1F2D' : '#FDFAF5',
        border: isFeatured ? '1px solid rgba(212,164,106,0.4)' : '1px solid #E2D9CC',
      }}
    >
      {/* Featured top accent bar */}
      {isFeatured && (
        <div className="h-[2px] w-full" style={{ background: 'linear-gradient(to right, transparent, #D4A46A, transparent)' }} />
      )}

      {/* Badge */}
      {collection.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span
            className="font-cinzel text-[0.58rem] tracking-[0.2em] uppercase font-bold px-4 py-1 block"
            style={{ background: '#D4A46A', color: '#0D1F2D' }}
          >
            {collection.badge}
          </span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 md:p-7">
        {/* Eyebrow */}
        <p
          className="font-cinzel text-[0.58rem] tracking-[0.28em] md:tracking-[0.35em] uppercase font-semibold mb-2.5 md:mb-3"
          style={{ color: isFeatured ? '#D4A46A' : '#B07848' }}
        >
          {collection.subtitle}
        </p>

        {/* Title */}
        <h3
          className="font-cinzel text-base md:text-lg font-bold tracking-wide leading-snug mb-4 md:mb-5"
          style={{ color: isFeatured ? '#FDFAF5' : '#0D1F2D' }}
        >
          {collection.name}
        </h3>

        {/* Size display */}
        <div
          className="mb-4 md:mb-5 px-4 py-3"
          style={{
            background: isFeatured ? 'rgba(212,164,106,0.08)' : '#F0EBE1',
            borderLeft: `2px solid ${isFeatured ? '#D4A46A' : '#B07848'}`,
          }}
        >
          <p
            className="text-[0.6rem] font-semibold uppercase tracking-widest mb-1"
            style={{ color: isFeatured ? '#D4A46A80' : '#8A9BB0' }}
          >
            Plot Area
          </p>
          <p
            className="font-cinzel text-xl font-bold tracking-wide"
            style={{ color: isFeatured ? '#F0C97A' : '#0D1F2D' }}
          >
            {collection.sizeRange}
          </p>
        </div>

        {/* Description */}
        <p
          className="text-sm leading-[1.65] md:leading-[1.8] flex-1"
          style={{ color: isFeatured ? 'rgba(253,250,245,0.65)' : '#5A6478' }}
        >
          {collection.description}
        </p>

        {/* Ideal for */}
        <div
          className="mt-4 pt-4 flex items-start gap-2"
          style={{ borderTop: `1px solid ${isFeatured ? 'rgba(212,164,106,0.15)' : '#E2D9CC'}` }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 mt-0.5">
            <circle cx="6" cy="6" r="5" stroke={isFeatured ? '#D4A46A' : '#B07848'} strokeWidth="1" />
            <path d="M3.5 6l2 2 3-3" stroke={isFeatured ? '#D4A46A' : '#B07848'} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p
            className="text-xs leading-relaxed"
            style={{ color: isFeatured ? 'rgba(240,201,122,0.8)' : '#8A9BB0' }}
          >
            {collection.idealFor}
          </p>
        </div>

        {/* CTA */}
        <button
          id={`plots-register-${collection.id}`}
          onClick={onBrochureClick}
          className="mt-5 md:mt-6 w-full py-3 md:py-3.5 font-cinzel text-[0.65rem] tracking-[0.2em] uppercase font-bold transition-all duration-200 hover:brightness-105"
          style={
            isFeatured
              ? { background: '#B07848', color: '#FDFAF5' }
              : { background: 'transparent', color: '#0D1F2D', border: '1px solid #0D1F2D' }
          }
        >
          Register Interest
        </button>
      </div>
    </motion.div>
  )
}

export function Plots({ onBrochureClick }: Props) {
  return (
    <section id="plots" className="py-7 md:py-10 lg:py-12" style={{ background: '#FDFAF5' }}>
      <div className="mx-auto max-w-6xl px-5 md:px-12">

        {/* Header */}
        <div className="mb-7 md:mb-9 text-center">
          <p className="font-cinzel text-[0.62rem] tracking-[0.4em] uppercase mb-3" style={{ color: '#B07848' }}>
            Plot Collections
          </p>
          <h2 className="font-cinzel text-2xl md:text-3xl font-bold tracking-[0.06em]" style={{ color: '#0D1F2D' }}>
            Choose Your Collection
          </h2>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, #B07848aa)' }} />
            <svg width="7" height="7" viewBox="0 0 7 7">
              <rect x="3.5" y="0" width="5" height="5" transform="rotate(45 3.5 0)" fill="#B07848" opacity="0.7" />
            </svg>
            <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, #B07848aa)' }} />
          </div>
          <p className="mt-3 md:mt-4 mx-auto max-w-lg text-sm leading-relaxed" style={{ color: '#6B7280' }}>
            Three curated collections, each designed to match a distinct vision of coastal living.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-px md:grid-cols-3" style={{ background: '#E2D9CC' }}>
          {plotCollections.map((collection, i) => (
            <PlotCard key={collection.id} collection={collection} index={i} onBrochureClick={onBrochureClick} />
          ))}
        </div>

      </div>
    </section>
  )
}
