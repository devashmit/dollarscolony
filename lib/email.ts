// Email notification adapter.
// Uses Resend by default; swap RESEND_API_KEY for SMTP_ vars to use Nodemailer.
// The interface is identical, form components never touch this file.

export interface LeadData {
  name: string
  phone: string
  city: string
  interestedIn: string
  source: string
  timestamp: string
}

function formatLeadEmail(lead: LeadData): string {
  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;padding:32px;background:#F5F0E8;border-radius:8px;">
      <h2 style="color:#0D1F2D;font-family:Georgia,serif;margin:0 0 8px;">New Lead | Dollars Colony</h2>
      <p style="color:#8A9BB0;margin:0 0 24px;font-size:13px;">${lead.timestamp}</p>
      <table style="width:100%;border-collapse:collapse;">
        ${[
          ['Name',         lead.name],
          ['Phone',        lead.phone],
          ['City',         lead.city],
          ['Interested In',lead.interestedIn],
          ['Source',       lead.source],
        ].map(([k, v]) => `
          <tr>
            <td style="padding:10px 16px;background:#fff;color:#4A5568;font-size:13px;font-weight:600;width:140px;border-bottom:1px solid #E2D9CC;">${k}</td>
            <td style="padding:10px 16px;background:#fff;color:#0D1F2D;font-size:14px;border-bottom:1px solid #E2D9CC;">${v}</td>
          </tr>
        `).join('')}
      </table>
      <p style="margin:24px 0 0;color:#B07848;font-size:12px;">Dollars Colony @ Viaan Enclave | dollarscolony.in</p>
    </div>
  `
}

/**
 * Send a lead notification email.
 * Attempts Resend first; falls back to a warning log if not configured.
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
          subject: `New Lead: ${lead.name} | ${lead.interestedIn}`,
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
