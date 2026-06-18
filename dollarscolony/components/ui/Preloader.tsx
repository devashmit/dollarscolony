'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Hide the preloader after a short delay (1.8s) to allow users to see the animation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1800)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#0D1F2D' }} // Dark navy premium background
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, filter: 'blur(4px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="flex flex-col items-center gap-8"
          >
            {/* The Sri Brahmari Logo */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
               <Image 
                 src="/sri-brahmari-logo-transparent.png" 
                 alt="Sri Brahmari Logo" 
                 fill 
                 className="object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                 priority
               />
            </div>
            
            <motion.div 
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.6, duration: 0.8 }}
               className="text-center space-y-3"
            >
              <h2 className="font-cinzel text-[#C5A059] text-2xl sm:text-3xl tracking-widest">
                DOLLARS COLONY
              </h2>
              <p className="font-cinzel text-[#8A9BB0] text-[10px] sm:text-xs tracking-[0.4em] uppercase">
                Premium Coastal Villa Plots
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
