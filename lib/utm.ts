/**
 * Utility to extract and manage UTM parameters from the URL.
 * Called on form mount to populate utmSource and utmCampaign fields.
 */
'use client'

import { useState, useEffect } from 'react'

export interface UTMParams {
  source: string
  campaign: string
}

/**
 * Extract UTM parameters from the current URL's query string.
 * Returns empty strings if parameters are not present.
 * 
 * @returns Object with `source` and `campaign` fields
 */
export function getUTMParams(): UTMParams {
  if (typeof window === 'undefined') {
    return { source: '', campaign: '' }
  }

  const params = new URLSearchParams(window.location.search)
  return {
    source: params.get('utm_source') || '',
    campaign: params.get('utm_campaign') || '',
  }
}

/**
 * React Hook to get UTM params on component mount.
 * Use this in any form component to capture campaign tracking.
 */
export function useUTMParams(): UTMParams {
  if (typeof window === 'undefined') {
    return { source: '', campaign: '' }
  }

  const [utmParams, setUTMParams] = useState<UTMParams>({ source: '', campaign: '' })

  useEffect(() => {
    setUTMParams(getUTMParams())
  }, [])

  return utmParams
}

// Standalone version for server-side or non-React contexts
export function extractUTMParams(url: string): UTMParams {
  try {
    const urlObj = new URL(url)
    return {
      source: urlObj.searchParams.get('utm_source') || '',
      campaign: urlObj.searchParams.get('utm_campaign') || '',
    }
  } catch {
    return { source: '', campaign: '' }
  }
}
