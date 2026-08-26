'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Bell } from 'lucide-react'
import { LotusDivider } from '@/components/ui/GoldEmbroidery'
import { ProjectUpdate } from '@/lib/types-prisma-mock'

export function ConstructionUpdates() {
  const [updates, setUpdates] = useState<ProjectUpdate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUpdates() {
      try {
        const res = await fetch('/api/public/updates', { cache: 'no-store' })
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          // Sort updates by published date descending just in case
          const sorted = json.data.sort(
            (a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          )
          setUpdates(sorted)
        }
      } catch (err) {
        console.error('Failed to fetch construction updates:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUpdates()
  }, [])

  if (loading) {
    return (
      <section id="updates" className="py-12 relative overflow-hidden" style={{ background: '#05111D' }}>
        <div className="mx-auto max-w-7xl px-5 md:px-12 text-center text-[#8A9BB0]">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-[#B07848] border-r-2 border-transparent"></div>
          <p className="mt-2 text-sm font-medium">Loading project updates...</p>
        </div>
      </section>
    )
  }

  if (updates.length === 0) {
    return null
  }

  return (
    <section id="updates" className="py-16 md:py-20 lg:py-24 relative overflow-hidden" style={{ background: '#05111D' }}>
      {/* Background Decorative Watermark SVG */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-between overflow-hidden opacity-[0.015] mix-blend-plus-lighter text-[#D4A46A] z-0">
        <div className="relative translate-x-1/3 translate-y-1/3 -rotate-45 transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-5 md:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <LotusDivider className="mb-4" />
          <p className="font-playfair text-sm italic tracking-widest" style={{ color: '#B07848' }}>
            Latest Announcements
          </p>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mt-3 uppercase tracking-wider">
            Construction Log & Updates
          </h2>
          <p className="mt-4 mx-auto max-w-lg text-sm leading-relaxed" style={{ color: '#8A9BB0' }}>
            Keep track of development milestones, infrastructure achievements, and official notices from Dollars Colony.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l border-[rgba(176,120,72,0.25)] ml-3 md:ml-6 space-y-12 pl-6 md:pl-10 py-2">
          {updates.map((upd, idx) => (
            <motion.div
              key={upd.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.6, delay: Math.min(idx * 0.1, 0.4) }}
              className="relative"
            >
              {/* Timeline Bullet Node */}
              <div 
                className="absolute -left-[31px] md:-left-[47px] top-1.5 h-4 w-4 rounded-full border-2 bg-[#05111D] transition-transform duration-300 group-hover:scale-110 flex items-center justify-center"
                style={{ 
                  borderColor: '#B07848',
                  boxShadow: '0 0 8px rgba(176,120,72,0.4)' 
                }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[#D4A46A]" />
              </div>

              {/* Update Card */}
              <div className="bg-[#0D1F2D]/55 backdrop-blur-sm rounded-xl border border-[rgba(176,120,72,0.15)] hover:border-[rgba(176,120,72,0.4)] transition-all duration-300 p-6 md:p-8 shadow-lg hover:bg-[#0D1F2D]/75 group">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  {/* Date Badge */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#D4A46A] uppercase tracking-widest font-mono font-medium">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    {new Date(upd.publishedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  {/* Status Indicator */}
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#1A3348]/40 border border-[rgba(176,120,72,0.15)] text-[#D4A46A]">
                    <Bell className="h-3 w-3 animate-pulse" /> Official
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-playfair font-bold text-white tracking-wide transition-colors group-hover:text-[#D4A46A]">
                  {upd.title}
                </h3>

                {/* Body */}
                <p 
                  className="text-sm leading-relaxed mt-3.5 whitespace-pre-wrap"
                  style={{ color: '#8A9BB0' }}
                >
                  {upd.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}