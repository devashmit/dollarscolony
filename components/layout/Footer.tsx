'use client'

import { MessageCircle } from 'lucide-react'
import { analytics } from '@/lib/analytics'

const QUICK_LINKS = [
  { label: 'About the Project', href: '#about'     },
  { label: 'Plot Collections',  href: '#plots'     },
  { label: 'Amenities',         href: '#amenities' },
  { label: 'Location',          href: '#location'  },
  { label: 'Contact Us',        href: '#contact'   },
]

export function Footer() {
  function handleScroll(href: string) {
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer style={{ background: '#050B14' }} className="text-white border-t border-white/5 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-[#D4A46A]/30 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-5 md:px-6 py-7 md:py-14">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-12 lg:gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col items-start">
            <p className="font-playfair text-2xl tracking-wide text-white mb-1">
              DOLLARS COLONY
            </p>
            <p className="font-outfit text-[10px] tracking-[0.2em] uppercase text-[#D4A46A] mb-4 md:mb-6">
              @ Viaan Enclave
            </p>
            <p className="font-outfit text-sm leading-relaxed text-white/60 max-w-sm">
              A premium coastal villa plot community in Kundapura, Karnataka. 
              Meticulously planned infrastructure designed for exceptional living and generational wealth.
            </p>
          </div>

          {/* Links & Contact Grid - 2 columns on mobile, auto on desktop */}
          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 gap-6 md:gap-8 sm:grid-cols-3">
            
            {/* Quick Links */}
            <div className="col-span-1">
                <p className="font-outfit text-xs font-semibold uppercase tracking-[0.15em] text-white mb-3 md:mb-5">
                Navigation
              </p>
              <ul className="space-y-3 md:space-y-4">
                {QUICK_LINKS.map(link => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleScroll(link.href)}
                      className="font-outfit text-sm text-white/50 transition-colors hover:text-[#D4A46A]"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-span-1">
              <p className="font-outfit text-xs font-semibold uppercase tracking-[0.15em] text-white mb-3 md:mb-5">
                Location
              </p>
              <address className="not-italic font-outfit text-sm leading-relaxed text-white/50 space-y-1">
                <p>Viaan Enclave,</p>
                <p>Kundapura, Udupi Dist.</p>
                <p>Coastal Karnataka</p>
                <p>PIN: 576201</p>
              </address>
            </div>

            {/* CTA / Social */}
            <div className="col-span-2 sm:col-span-1 mt-1 sm:mt-0 pt-5 sm:pt-0 border-t border-white/5 sm:border-0">
              <p className="font-outfit text-xs font-semibold uppercase tracking-[0.15em] text-white mb-3 md:mb-5">
                Get In Touch
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919035624148'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analytics.whatsappClick('footer')}
                  className="group inline-flex items-center gap-2 rounded-sm border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-2.5 transition-all hover:bg-[#25D366] hover:border-[#25D366]"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366] group-hover:text-white" />
                  <span className="font-outfit text-[10px] font-bold uppercase tracking-widest text-[#25D366] group-hover:text-white">
                    WA: 903-562-4148
                  </span>
                </a>
                <div className="mt-2 flex flex-col gap-1 font-outfit text-[11px] text-white/50">
                  <a href="mailto:sales@dollarscolony.in" className="hover:text-[#D4A46A] transition-colors">sales@dollarscolony.in</a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="my-6 md:my-9 h-[1px] w-full bg-white/5" />

        {/* Disclaimer + Copyright */}
        <div className="flex flex-col gap-6 font-outfit text-xs text-white/40 md:flex-row md:items-start md:justify-between">
          <p className="max-w-2xl leading-relaxed text-[10px] md:text-xs text-justify md:text-left">
            <strong className="text-white/60 font-semibold tracking-wider">DISCLAIMER:</strong> This website is for informational purposes only. 
            All representations, dimensions, specifications, and imagery are indicative and subject to change without prior notice. 
            Please verify all documents independently before making any booking or payment. 
            Developed by Sri Brahmari Developers.
          </p>
          <div className="shrink-0 flex flex-col items-start md:items-end gap-1">
            <p>&copy; {new Date().getFullYear()} Dollars Colony.</p>
            <p>All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
