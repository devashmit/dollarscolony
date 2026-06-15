'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, PhoneCall, X, LayoutGrid } from 'lucide-react'
import { plotInventory, PlotData } from '@/data/inventory'
import { analytics } from '@/lib/analytics'

export function PlotExplorer() {
  const [isOpen, setIsOpen]               = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<string>('All')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery]     = useState<string>('')
  const [activePlot, setActivePlot]       = useState<PlotData | null>(null)

  const blocks     = ['All', 'A', 'B', 'C', 'D', 'E']
  const categories = ['All', 'Lifestyle', 'Premium', 'Signature']

  const filteredPlots = useMemo(() => {
    return plotInventory.filter(plot => {
      const matchesBlock    = selectedBlock === 'All' || plot.block === `Block ${selectedBlock}`
      const matchesCategory = selectedCategory === 'All' || plot.category === selectedCategory
      const matchesSearch   = plot.id.toLowerCase().includes(searchQuery.toLowerCase().trim())
      return matchesBlock && matchesCategory && matchesSearch
    })
  }, [selectedBlock, selectedCategory, searchQuery])

  const getCategoryAccent = (cat: string) => {
    if (cat === 'Signature') return '#F0C97A'
    if (cat === 'Premium')   return '#D4A46A'
    return '#8A9BB0'
  }

  const handleInquirePlot = (plot: PlotData) => {
    analytics.plotCardViewed(plot.id)
    const el = document.getElementById('contact')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      window.dispatchEvent(new CustomEvent('selectPlot', {
        detail: { plotId: plot.id, category: plot.category }
      }))
      setActivePlot(null)
    }
  }

  return (
    <div className="mt-20 w-full">

      {/* ── Section Header ─────────────────────────────────── */}
      <div className="text-center mb-10">
        <p className="font-cinzel text-[0.65rem] tracking-[0.4em] uppercase text-[#D4A46A] mb-3">
          Complete Inventory
        </p>
        <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-white tracking-[0.08em]">
          Plot Finder
        </h3>
        <div className="flex items-center justify-center gap-4 mt-5">
          <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #D4A46A66)' }} />
          <svg width="8" height="8" viewBox="0 0 8 8">
            <rect x="4" y="0" width="5.6" height="5.6" transform="rotate(45 4 0)" fill="#D4A46A" opacity="0.7" />
          </svg>
          <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, #D4A46A66)' }} />
        </div>
      </div>

      {/* ── Reveal Trigger Button ────────────────────────────── */}
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="closed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center gap-6 py-10"
          >
            {/* Preview count badges */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {['Lifestyle', 'Premium', 'Signature'].map(cat => {
                const count = plotInventory.filter(p => p.category === cat).length
                return (
                  <div
                    key={cat}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border"
                    style={{
                      borderColor: `${getCategoryAccent(cat)}33`,
                      background: `${getCategoryAccent(cat)}0d`,
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getCategoryAccent(cat) }} />
                    <span className="font-outfit text-[0.62rem] tracking-widest uppercase" style={{ color: getCategoryAccent(cat) }}>
                      {cat}
                    </span>
                    <span className="font-cinzel text-xs font-bold text-white/60">{count}</span>
                  </div>
                )
              })}
            </div>

            <p className="font-outfit text-xs text-white/35 tracking-widest">
              54 Exclusive Plots across 5 Blocks
            </p>

            {/* Open button */}
            <motion.button
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center gap-3 px-10 py-4 font-cinzel text-[0.7rem] tracking-[0.25em] uppercase font-bold text-white overflow-hidden"
              style={{
                border: '1px solid rgba(212,164,106,0.4)',
                background: 'transparent',
              }}
              whileHover={{ borderColor: 'rgba(212,164,106,0.9)' }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Shimmer fill on hover */}
              <motion.span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(212,164,106,0.08), transparent)' }}
              />
              <LayoutGrid className="h-3.5 w-3.5 text-[#D4A46A]" />
              <span>Explore All Plots</span>
              {/* Arrow */}
              <motion.svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              >
                <path d="M2 7h10M8 3l4 4-4 4" stroke="#D4A46A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </motion.button>
          </motion.div>
        ) : (

          /* ── Full Explorer (revealed) ────────────────────────── */
          <motion.div
            key="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* ── Filters Row ──────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="mb-8 space-y-5"
            >
              {/* Search */}
              <div className="relative max-w-sm mx-auto md:mx-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#D4A46A]/60 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search plot — A1, B4, C11..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-outfit tracking-wider text-white/80 placeholder-white/25 outline-none border-b border-white/15 bg-transparent focus:border-[#D4A46A]/50 transition-all duration-300"
                />
              </div>

              {/* Block tabs */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-cinzel text-[0.6rem] tracking-[0.3em] uppercase text-[#D4A46A]/70 w-14">Block</span>
                {blocks.map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBlock(b)}
                    className="font-cinzel text-[0.62rem] tracking-[0.15em] uppercase px-4 py-1.5 transition-all duration-200"
                    style={{
                      borderBottom: selectedBlock === b ? '1.5px solid #D4A46A' : '1.5px solid transparent',
                      color: selectedBlock === b ? '#F0C97A' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {b === 'All' ? 'All' : `Block ${b}`}
                  </button>
                ))}
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-cinzel text-[0.6rem] tracking-[0.3em] uppercase text-[#D4A46A]/70 w-14">Type</span>
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className="font-outfit text-[0.62rem] tracking-wider uppercase px-4 py-1.5 rounded-full transition-all duration-200 border"
                    style={{
                      borderColor: selectedCategory === c ? '#D4A46A' : 'rgba(255,255,255,0.1)',
                      background: selectedCategory === c ? 'rgba(212,164,106,0.12)' : 'transparent',
                      color: selectedCategory === c ? '#F0C97A' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {c === 'All' ? 'All Types' : c}
                  </button>
                ))}
              </div>

              {/* Count + reset */}
              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <p className="font-outfit text-[0.65rem] tracking-widest text-white/30 uppercase">
                  {filteredPlots.length} / 54 plots
                </p>
                <div className="flex items-center gap-4">
                  {(selectedBlock !== 'All' || selectedCategory !== 'All' || searchQuery) && (
                    <button
                      onClick={() => { setSelectedBlock('All'); setSelectedCategory('All'); setSearchQuery('') }}
                      className="font-cinzel text-[0.6rem] tracking-widest uppercase text-[#D4A46A]/60 hover:text-[#D4A46A] transition-colors flex items-center gap-1.5"
                    >
                      <X className="h-2.5 w-2.5" /> Clear
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="font-cinzel text-[0.6rem] tracking-widest uppercase text-white/20 hover:text-white/50 transition-colors flex items-center gap-1.5"
                  >
                    <X className="h-2.5 w-2.5" /> Collapse
                  </button>
                </div>
              </div>
            </motion.div>

            {/* ── Plot Grid ─────────────────────────────────────── */}
            <motion.div
              layout
              className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-px"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,164,106,0.2) transparent' }}
            >
              <AnimatePresence mode="popLayout">
                {filteredPlots.map((plot, idx) => {
                  const accent   = getCategoryAccent(plot.category)
                  const isActive = activePlot?.id === plot.id

                  return (
                    <motion.button
                      key={plot.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.012 }}
                      whileHover={{ backgroundColor: 'rgba(212,164,106,0.08)' }}
                      onClick={() => setActivePlot(plot)}
                      className="group flex flex-col items-center justify-center py-4 px-1 transition-all duration-200 relative border-b border-r"
                      style={{
                        borderColor: 'rgba(255,255,255,0.05)',
                        background: isActive ? 'rgba(212,164,106,0.12)' : 'transparent',
                      }}
                    >
                      <div
                        className="absolute top-0 left-2 right-2 h-[1.5px] transition-all duration-300"
                        style={{
                          background: isActive ? accent : 'transparent',
                          boxShadow: isActive ? `0 0 6px ${accent}55` : 'none',
                        }}
                      />
                      <span
                        className="font-cinzel text-sm font-bold tracking-wide transition-colors duration-200"
                        style={{ color: isActive ? '#F0C97A' : 'rgba(255,255,255,0.75)' }}
                      >
                        {plot.id}
                      </span>
                      <span
                        className="font-mono text-[0.55rem] mt-1 transition-colors duration-200"
                        style={{ color: isActive ? accent : 'rgba(255,255,255,0.25)' }}
                      >
                        {plot.sqft}
                      </span>
                      <div
                        className="w-1 h-1 rounded-full mt-1.5 transition-all duration-200"
                        style={{
                          backgroundColor: accent,
                          opacity: isActive ? 1 : 0.4,
                          transform: isActive ? 'scale(1.3)' : 'scale(1)',
                        }}
                      />
                    </motion.button>
                  )
                })}
              </AnimatePresence>
            </motion.div>

            {/* ── Legend ───────────────────────────────────────── */}
            <div className="mt-6 flex flex-wrap justify-center gap-6 pt-5 border-t border-white/5">
              {[
                { label: 'Lifestyle  ·  < 3,400 Sq.Ft.', accent: getCategoryAccent('Lifestyle') },
                { label: 'Premium  ·  3,400–3,500 Sq.Ft.', accent: getCategoryAccent('Premium') },
                { label: 'Signature  ·  > 3,500 Sq.Ft.', accent: getCategoryAccent('Signature') },
              ].map(({ label, accent }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="h-px w-5" style={{ background: accent }} />
                  <span className="font-outfit text-[0.6rem] tracking-widest uppercase text-white/35">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Plot Detail Modal ─────────────────────────────── */}
      <AnimatePresence>
        {activePlot && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePlot(null)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
                className="relative w-full max-w-sm pointer-events-auto"
                style={{
                  background: 'linear-gradient(160deg, #0D1F2D 0%, #092B1C 100%)',
                  border: '1px solid rgba(212,164,106,0.25)',
                  borderRadius: '4px',
                }}
              >
                <div className="h-[2px] w-full rounded-t" style={{ background: 'linear-gradient(to right, transparent, #D4A46A, transparent)' }} />
                <div className="p-8">
                  <button
                    onClick={() => setActivePlot(null)}
                    className="absolute top-5 right-5 text-white/30 hover:text-white/70 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="text-center mb-8">
                    <p className="font-cinzel text-[0.6rem] tracking-[0.35em] uppercase text-[#D4A46A]/70 mb-2">
                      {activePlot.block}
                    </p>
                    <h4 className="font-cinzel text-6xl font-bold text-white tracking-[0.1em]">
                      {activePlot.id}
                    </h4>
                    <div className="flex items-center justify-center gap-3 mt-3">
                      <div className="h-px w-8" style={{ background: `${getCategoryAccent(activePlot.category)}60` }} />
                      <span className="font-outfit text-[0.6rem] tracking-[0.2em] uppercase font-semibold" style={{ color: getCategoryAccent(activePlot.category) }}>
                        {activePlot.category} Collection
                      </span>
                      <div className="h-px w-8" style={{ background: `${getCategoryAccent(activePlot.category)}60` }} />
                    </div>
                  </div>
                  <div className="space-y-0 mb-8">
                    {[
                      { label: 'Area in Cents', value: `${activePlot.cents} Cents` },
                      { label: 'Area in Sq.Ft.', value: `${activePlot.sqft.toLocaleString()} Sq.Ft.`, highlight: true },
                      { label: 'Ideal For', value: activePlot.category === 'Signature' ? 'Luxury Villa' : activePlot.category === 'Premium' ? 'Spacious Home' : 'Garden Villa' },
                    ].map(({ label, value, highlight }) => (
                      <div key={label} className="flex justify-between items-center py-3.5 border-b border-white/[0.06]">
                        <span className="font-outfit text-xs text-white/40 tracking-wider">{label}</span>
                        <span className="font-cinzel text-sm font-bold tracking-wide" style={{ color: highlight ? '#F0C97A' : 'rgba(255,255,255,0.85)' }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleInquirePlot(activePlot)}
                    className="w-full py-3.5 text-[0.68rem] font-cinzel font-bold tracking-[0.2em] uppercase text-white flex items-center justify-center gap-2.5 transition-all duration-200 hover:brightness-110"
                    style={{ background: '#B07848', borderRadius: '2px' }}
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    Enquire About Plot {activePlot.id}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
