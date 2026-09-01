'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { LotusDivider } from '@/components/ui/GoldEmbroidery'
import { GalleryImage } from '@/lib/types-prisma-mock'
import { Play, X, Video } from 'lucide-react'

function isMediaVideo(url: string, fileName?: string): boolean {
  const target = (url + ' ' + (fileName || '')).toLowerCase()
  return (
    target.includes('.mp4') ||
    target.includes('.webm') ||
    target.includes('.mov') ||
    target.includes('.m4v') ||
    target.includes('.ogg') ||
    target.includes('youtube.com') ||
    target.includes('youtu.be') ||
    target.includes('vimeo.com')
  )
}

function getEmbedUrl(url: string): string | null {
  if (!url) return null
  try {
    if (url.includes('youtube.com/watch')) {
      const v = new URL(url).searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}?autoplay=1&rel=0`
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0]
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split('?')[0]
      if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`
    }
  } catch (_) {}
  return null
}

export function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [activeVideo, setActiveVideo] = useState<GalleryImage | null>(null)

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch('/api/public/gallery', { cache: 'no-store' })
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          // Sort by displayOrder ascending
          const sorted = json.data.sort((a: any, b: any) => a.displayOrder - b.displayOrder)
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

  const embedUrl = activeVideo ? getEmbedUrl(activeVideo.fileUrl) : null

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
            View high-definition photos, drone footage, and ongoing progress at Dollars Colony.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((item, idx) => {
            const isVideo = isMediaVideo(item.fileUrl, item.fileName)

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: Math.min(idx * 0.05, 0.4) }}
                className="bg-[#0D1F2D]/60 rounded-xl overflow-hidden border border-[rgba(176,120,72,0.15)] shadow-md hover:border-[rgba(176,120,72,0.35)] transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full bg-[#05111D] overflow-hidden">
                  {isVideo ? (
                    <button
                      type="button"
                      onClick={() => setActiveVideo(item)}
                      className="w-full h-full relative flex items-center justify-center cursor-pointer group/vid focus:outline-none"
                    >
                      <video
                        src={item.fileUrl}
                        className="object-cover w-full h-full opacity-80 group-hover/vid:opacity-95 transition-opacity"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover/vid:bg-black/10 transition-colors" />
                      
                      {/* Play Button */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-black/70 border border-[#D4A46A] flex items-center justify-center text-[#D4A46A] shadow-xl group-hover/vid:scale-110 group-hover/vid:bg-[#D4A46A] group-hover/vid:text-black transition-all">
                          <Play className="h-5 w-5 fill-current ml-0.5" />
                        </div>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#D4A46A] bg-black/60 px-2 py-0.5 rounded border border-[#D4A46A]/30">
                          Watch Video
                        </span>
                      </div>

                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 border border-[#D4A46A]/40 text-[9px] font-bold tracking-wider text-[#D4A46A] uppercase flex items-center gap-1">
                        <Video className="h-3 w-3" />
                        VIDEO
                      </div>
                    </button>
                  ) : (
                    <Zoom>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.fileUrl}
                        alt={item.altText || item.fileName || "Dollars Colony Gallery"}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        style={{ aspectRatio: "1/1" }}
                      />
                    </Zoom>
                  )}
                </div>

                {item.altText && (
                  <div className="p-3 text-center border-t border-[rgba(176,120,72,0.08)] bg-[#0A1926]/40">
                    <p className="text-xs text-[#8A9BB0] line-clamp-1 italic font-medium">{item.altText}</p>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Luxury Video Modal Player */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-[#091824] rounded-2xl overflow-hidden border border-[#D4A46A]/40 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(176,120,72,0.2)] bg-[#05111D]">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-[#D4A46A]" />
                  <span className="text-xs font-semibold text-[#F5F0E8] uppercase tracking-wider truncate max-w-[300px]">
                    {activeVideo.altText || activeVideo.fileName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-[#F5F0E8] flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Video Player */}
              <div className="relative aspect-video w-full bg-black">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={activeVideo.altText || activeVideo.fileName}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={activeVideo.fileUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}