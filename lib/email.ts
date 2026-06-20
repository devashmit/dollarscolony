/**
 * Email notification adapter.
 * Uses Resend by default; can be swapped for Nodemailer or other providers.
 * The interface accepts the full LeadData object with all 14 user-facing fields.
 */

import type { LeadData } from './types'

/**
 * Format a lead object into an HTML email template.
 * Displays all 14 fields in a formatted table.
 */
function formatLeadEmail(lead: LeadData): string {
  return `
    <div style="font-family:Inter,sans-serif;max-width:700px;margin:auto;padding:32px;background:#F5F0E8;border-radius:8px;">
      <h2 style="color:#0D1F2D;font-family:Georgia,serif;margin:0 0 8px;">New Lead Submission | Dollars Colony</h2>
      <p style="color:#8A9BB0;margin:0 0 24px;font-size:13px;">Submitted via ${lead.formName}</p>
      
      <table style="width:100%;border-collapse:collapse;">
        ${[
          ['Name',                 lead.name],
          ['Phone',                lead.phone],
          ['Email',                lead.email],
          ['City/Location',        lead.city],
          ['Form Source',          lead.formName],
          ['Customer Interest',    lead.customerInterest || '—'],
          ['Buyer Type',           lead.buyerType || '—'],
          ['Preferred Plot Size',  lead.plotSize || '—'],
          ['Budget Range',         lead.budget || '—'],
          ['Purpose',              lead.purpose || '—'],
          ['Enquiry/Message',      lead.enquiry || '—'],
          ['CTA Clicked',          lead.ctaClicked || '—'],
          ['UTM Source',           lead.utmSource || '—'],
          ['UTM Campaign',         lead.utmCampaign || '—'],
        ].map(([k, v]) => `
          <tr>
            <td style="padding:10px 16px;background:#fff;color:#4A5568;font-size:13px;font-weight:600;width:160px;border-bottom:1px solid #E2D9CC;">${k}</td>
            <td style="padding:10px 16px;background:#fff;color:#0D1F2D;font-size:14px;border-bottom:1px solid #E2D9CC;">${v}</td>
          </tr>
        `).join('')}
      </table>
      
      <p style="margin:24px 0 0;color:#B07848;font-size:12px;">Dollars Colony @ Viaan Enclave | dollarscolony.in</p>
    </div>
  `
}

/**
 * Send a lead notification email via Resend.
 * Attempts Resend first; falls back to warning log if not configured.
 * 
 * @param lead - LeadData object with all form fields
 * @returns Promise resolving to true if sent successfully, false otherwise
 */
export async function sendLeadEmail(lead: LeadData): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY
  const emailTo   = process.env.EMAIL_TO || 'sales@dollarscolony.in'

  if (!emailTo) {
    console.warn('[email] EMAIL_TO not set, skipping notification.')
    return false
  }

  // ── Resend provider ───────────────────────────────────────────────────────
  if (resendKey && !resendKey.includes('placeholder')) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'leads@dollarscolony.in',
          to:   [emailTo],
          subject: `New Lead: ${lead.name} | ${lead.customerInterest || lead.formName}`,
          html: formatLeadEmail(lead),
        }),
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) throw new Error(`Resend responded ${res.status}`)
      return true
    } catch (err) {
      console.error('[email] Resend delivery failed:', err)
      return false
    }
  }

  // ── Phase 2 hook: swap in Nodemailer here ─────────────────────────────────
  // const transporter = nodemailer.createTransport({ ... })
  // await transporter.sendMail({ ... })

  console.warn('[email] No email provider configured. Lead logged only.')
  return false
}
