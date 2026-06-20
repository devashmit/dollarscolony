/**
 * Google Sheets webhook adapter.
 * POSTs lead data to a deployed Google Apps Script Web App.
 * The script appends rows to a "Leads" sheet with 22 columns.
 * 
 * We send only the 18 frontend-supplied fields (D through Q).
 * The Apps Script auto-generates columns A-C (Lead ID, Date, Time),
 * auto-sets column S (Lead Status = "New"), and columns R, T-V are
 * left blank for manual sales team updates.
 */

import type { LeadData } from './types'

export interface SheetResponse {
  success: boolean
  error?: string
}

/**
 * Submit a lead to Google Sheets via webhook.
 * Sends Content-Type: text/plain to avoid CORS preflight issues with Apps Script.
 * Body is still JSON.stringify() but with text/plain header.
 * 
 * @param data - LeadData object with 18 required fields
 * @returns Promise resolving to success/failure status
 */
export async function submitLeadToSheet(data: LeadData): Promise<SheetResponse> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

  if (!webhookUrl || webhookUrl.includes('script.google.com') === false) {
    console.warn('[sheets] GOOGLE_SHEETS_WEBHOOK_URL not configured, skipping.')
    return { success: false, error: 'Webhook URL not configured' }
  }

  try {
    const payload = {
      // Column D through Q (18 fields)
      name: data.name,                  // D
      phone: data.phone,                // E
      email: data.email,                // F
      city: data.city,                  // G
      formName: data.formName,          // H
      customerInterest: data.customerInterest,  // I
      buyerType: data.buyerType,        // J
      plotSize: data.plotSize,          // K
      budget: data.budget,              // L
      purpose: data.purpose,            // M
      enquiry: data.enquiry,            // N
      ctaClicked: data.ctaClicked,      // O
      utmSource: data.utmSource,        // P
      utmCampaign: data.utmCampaign,    // Q
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('[sheets] Webhook responded with status', res.status, ':', errorText)
      return { success: false, error: `HTTP ${res.status}` }
    }

    return { success: true }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error('[sheets] Webhook delivery failed:', errorMsg)
    return { success: false, error: errorMsg }
  }
}

