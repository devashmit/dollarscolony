// Analytics adapter — fires events to GA4, Meta Pixel, and Google Ads simultaneously.
// All calls are safe-guarded; if a tracker hasn't loaded yet, the call is silently skipped.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

type EventPayload = Record<string, string | number | boolean | undefined>

/**
 * Fire a custom event to GA4 + Meta Pixel + Google Ads simultaneously.
 * All fields are optional — pass only what's relevant for each event.
 */
export function trackEvent(eventName: string, payload: EventPayload = {}): void {
  if (typeof window === 'undefined') return

  // ── GA4 ──────────────────────────────────────────────────────────────────
  if (window.gtag) {
    window.gtag('event', eventName, payload)
  }

  // ── Meta Pixel ───────────────────────────────────────────────────────────
  if (window.fbq) {
    window.fbq('trackCustom', eventName, payload)
  }
}

/**
 * Fire a Google Ads conversion event (e.g., on lead form submit).
 * Uses the NEXT_PUBLIC_GADS_CONVERSION_ID and _LABEL env vars.
 */
export function trackConversion(): void {
  if (typeof window === 'undefined') return
  const conversionId    = process.env.NEXT_PUBLIC_GADS_CONVERSION_ID
  const conversionLabel = process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL
  if (window.gtag && conversionId && conversionLabel) {
    window.gtag('event', 'conversion', {
      send_to: `${conversionId}/${conversionLabel}`,
    })
  }
}

// ── Typed event helpers (used across components) ─────────────────────────────
export const analytics = {
  /**
   * WhatsApp link click
   */
  whatsappClick: (source: string) =>
    trackEvent('whatsapp_click', { source }),

  /**
   * Phone call link (tel:) click
   */
  callClick: (source: string) =>
    trackEvent('call_click', { source }),

  /**
   * Download Brochure button click (opens form modal)
   */
  brochureClick: (source: string) =>
    trackEvent('brochure_click', { source }),

  /**
   * Successful enquiry form submission
   */
  enquiryFormSubmit: (interestedIn: string) => {
    trackEvent('enquiry_form_submit', { interested_in: interestedIn })
    trackConversion()
  },

  /**
   * Brochure modal initiated (legacy compatibility)
   */
  brochureInitiated: (source: string) =>
    trackEvent('brochure_click', { source }),

  /**
   * Brochure form submitted (legacy compatibility)
   */
  brochureDownloaded: (source: string) =>
    trackEvent('enquiry_form_submit', { source }),

  /**
   * Site visit requested
   */
  siteVisitRequested: () =>
    trackEvent('site_visit_enquiry'),

  /**
   * Plot card viewed
   */
  plotCardViewed: (collection: string) =>
    trackEvent('plot_card_viewed', { collection }),

  /**
   * Lead form submission (main contact form)
   */
  leadFormSubmitted: (interestedIn: string) => {
    trackEvent('enquiry_form_submit', { interested_in: interestedIn })
    trackConversion()
  },
}
