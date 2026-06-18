// Google Sheets webhook adapter.
// In Phase 1 we POST lead data to a webhook URL (Zapier / Google Apps Script).
// In Phase 2 swap this with a direct Sheets API call using a service account.

export interface LeadData {
  name: string
  phone: string
  city: string
  interestedIn: string
  source: string
  timestamp: string
}

/**
 * Append a lead to Google Sheets via a webhook URL.
 * Returns true on success, false if the webhook is not configured or fails.
 */
export async function sendLeadToSheets(lead: LeadData): Promise<boolean> {
  const webhookUrl = process.env.SHEETS_WEBHOOK_URL

  if (!webhookUrl || webhookUrl.includes('example.com')) {
    console.warn('[sheets] SHEETS_WEBHOOK_URL not configured, skipping.')
    return false
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`Sheets webhook responded ${res.status}`)
    return true
  } catch (err) {
    console.error('[sheets] Webhook delivery failed:', err)
    return false
  }
}
