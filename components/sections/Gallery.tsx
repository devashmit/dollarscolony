'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { LotusDivider } from '@/components/ui/GoldEmbroidery'
import { GalleryImage } from '@/lib/types-prisma-mock'

export function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch('/api/public/gallery', { cache: 'no-store' })
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          // Sort by displayOrder ascending
          const sorted = json.data.sort((a: any, b: any) => a.displayOrder - b.displayOrder);
          setImages(sorted)
        }
      } catch (err) {
        console.error('Failed to load gallery images:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [])

  if (loading) {
    return (
      <section id="gallery" className="py-12 relative overflow-hidden" style={{ background: '#05111D' }}>
        <div className="mx-auto max-w-7xl px-5 md:px-12 text-center text-[#8A9BB0]">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-[#B07848] border-r-2 border-transparent"></div>
          <p className="mt-2 text-sm font-medium">Loading gallery...</p>
        </div>
      </section>
    )
  }

  if (images.length === 0) {
    return null
  }

  return (
    <section id="gallery" className="py-12 md:py-16 lg:py-20 relative overflow-hidden" style={{ background: '#05111D' }}>
      {/* Premium Golden Leaf Embroidery Watermark */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-between overflow-hidden opacity-[0.02] mix-blend-plus-lighter text-[#D4A46A] z-0">
        <div className="relative -translate-x-1/4 -translate-y-1/4 rotate-45 transform">
           <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
             <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
           </svg>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-12">
        {/* Header */}
        <div className="mb-10 md:mb-12 text-center">
          <LotusDivider className="mb-3 md:mb-4" />
          <p className="font-playfair text-sm italic tracking-widest" style={{ color: '#B07848' }}>
            Visual Showcase
          </p>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mt-3 uppercase tracking-wider">
            Site Progress & Gallery
          </h2>
          <p className="mt-3 md:mt-4 mx-auto max-w-lg text-sm leading-relaxed" style={{ color: '#8A9BB0' }}>
            View the premium development updates, scenic coastal views, and ongoing progress at Dollars Colony.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: Math.min(idx * 0.05, 0.4) }}
              className="bg-[#0D1F2D]/60 rounded-xl overflow-hidden border border-[rgba(176,120,72,0.15)] shadow-md hover:border-[rgba(176,120,72,0.35)] transition-all duration-300 group"
            >
              <div className="relative aspect-square w-full bg-[#05111D] overflow-hidden">
                <Zoom>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.fileUrl}
                    alt={img.altText || img.fileName || "Dollars Colony Gallery"}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    style={{ aspectRatio: "1/1" }}
                  />
                </Zoom>
              </div>
              {img.altText && (
                <div className="p-3 text-center border-t border-[rgba(176,120,72,0.08)] bg-[#0A1926]/40">
                  <p className="text-xs text-[#8A9BB0] line-clamp-1 italic font-medium">{img.altText}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}