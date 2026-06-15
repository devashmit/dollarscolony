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
  brochureInitiated: (source: string) =>
    trackEvent('Download Brochure Click', { source }),
  brochureDownloaded: (source: string) =>
    trackEvent('Enquiry Form Submit', { source }),
  whatsappClick: (source: string) =>
    trackEvent('WhatsApp Click', { source }),
  callClick: (source: string) =>
    trackEvent('Call Click', { source }),
  siteVisitRequested: () =>
    trackEvent('Site Visit Enquiry'),
  leadFormSubmitted: (interestedIn: string) => {
    trackEvent('Enquiry Form Submit', { interested_in: interestedIn })
    trackConversion()
  },
  plotCardViewed: (collection: string) =>
    trackEvent('plot_card_viewed', { collection }),
}
