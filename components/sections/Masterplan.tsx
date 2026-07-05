'use client'

import { Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { PlotExplorer } from './PlotExplorer'
import { useApiData } from '@/hooks/use-api-data'

export function Masterplan() {
  const { downloads } = useApiData();
  const masterplanPdfUrl = downloads.masterplan_pdf?.fileUrl || "/documents/masterplan.pdf";

  return (
    <section id="masterplan" className="pt-3 pb-7 md:pb-10 lg:pb-12 relative overflow-hidden" style={{ background: '#0D1F2D' }}>
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
        {/* Header */}
        <div className="mb-7 md:mb-9 text-center">
          <p className="font-playfair text-sm italic tracking-widest" style={{ color: '#B07848' }}>
            Site Layout
          </p>
          <h2 className="text-section-title mt-3 font-playfair font-bold text-white">
            Master Plan
          </h2>
        </div>

        {/* Download CTA */}
        <div className="flex justify-center">
          <a
            id="masterplan-download-btn"
            href={masterplanPdfUrl}
            download="Dollars_Colony_Masterplan.pdf"
            className="ripple-btn flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
            style={{ background: '#B07848' }}
          >
            <Download className="h-4 w-4" />
            Download Master Plan
          </a>
        </div>

        {/* Masterplan Inventory Breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-9 md:mt-12 border-t pt-7 md:pt-9"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <div className="text-center mb-6 md:mb-8">
            <p className="font-cinzel text-[0.62rem] tracking-[0.4em] uppercase mb-2" style={{ color: '#D4A46A' }}>
              Site Layout
            </p>
            <h3 className="font-cinzel text-xl font-bold text-white tracking-wide">Block Inventory</h3>
          </div>

          {/* Color-graded legend — defined here, applied to cards below */}
          {(() => {
            const GRADES: Record<string, { color: string; label: string; textColor: string }> = {
              'Lifestyle':           { color: '#A1B88B', label: 'Lifestyle',           textColor: '#A1B88B' },
              'Premium':             { color: '#C29C76', label: 'Premium',             textColor: '#C29C76' },
              'Signature':           { color: '#9D5B4D', label: 'Signature',           textColor: '#D4A46A' },
              'Signature & Premium': { color: '#D4A46A', label: 'Signature & Premium', textColor: '#F0C97A' },
            }

            const blocks = [
              { block: 'Block A', plots: 11, range: '2,574–4,224', type: 'Signature & Premium' },
              { block: 'Block B', plots: 11, range: '3,234–4,000', type: 'Signature & Premium' },
              { block: 'Block C', plots: 10, range: '3,442–4,333', type: 'Signature & Premium' },
              { block: 'Block D', plots: 14, range: '2,030–3,056', type: 'Lifestyle' },
              { block: 'Block E', plots: 8,  range: '1,670–2,500', type: 'Lifestyle' },
            ]

            return (
              <>
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-6 pb-5 md:pb-6 px-1 md:px-0 md:grid md:grid-cols-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {blocks.map((item) => {
                    const grade = GRADES[item.type] ?? GRADES['Lifestyle']
                    return (
                      <div
                        key={item.block}
                        className="flex-shrink-0 w-[78%] sm:w-[45%] md:w-auto snap-center flex flex-col items-start p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/10 transition-all hover:border-white/20 hover:bg-white/5 relative overflow-hidden group"
                        style={{ background: '#08141F' }}
                      >
                        {/* Subtle top border glow */}
                        <div 
                          className="absolute top-0 left-0 right-0 h-[2px] transition-opacity opacity-50 group-hover:opacity-100" 
                          style={{ background: grade.color }} 
                        />

                        {/* Card Header */}
                        <div className="flex items-center gap-3 mb-5 md:mb-8 w-full justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: grade.color, boxShadow: `0 0 8px ${grade.color}66` }}
                            />
                            <h4 className="font-playfair text-xl font-bold text-white tracking-wider">
                              {item.block}
                            </h4>
                          </div>
                          <span className="font-outfit text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 text-white/80 border border-white/5">
                            {item.plots} Plots
                          </span>
                        </div>

                        {/* Details */}
                        <div className="w-full space-y-4 md:space-y-5">
                          <div>
                            <p className="font-outfit text-[10px] uppercase tracking-widest text-[#8A9BB0] mb-1">
                              Sq.Ft Range
                            </p>
                            <p className="font-mono text-sm font-semibold text-white/90 tracking-wide">
                              {item.range}
                            </p>
                          </div>
                          <div>
                            <p className="font-outfit text-[10px] uppercase tracking-widest text-[#8A9BB0] mb-1">
                              Category
                            </p>
                            <p className="font-outfit text-xs font-medium tracking-wide" style={{ color: grade.color }}>
                              {item.type}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-4 md:gap-6 pt-5 md:pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {[
                    { label: 'Lifestyle Plots',           color: '#A1B88B' },
                    { label: 'Premium Plots',             color: '#C29C76' },
                    { label: 'Signature Plots',           color: '#9D5B4D' },
                    { label: 'Amenities & Greenery',      color: '#4A7C59' },
                  ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <div className="h-1 w-4 rounded-full" style={{ background: color }} />
                      <span className="font-outfit text-[0.65rem] font-semibold tracking-widest uppercase text-white/50">{label}</span>
                    </div>
                  ))}
                </div>
              </>
            )
          })()}


          <PlotExplorer />
        </motion.div>
      </div>
    </section>
  )
}
