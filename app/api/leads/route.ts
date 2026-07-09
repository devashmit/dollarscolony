import { NextRequest } from 'next/server'
import { z } from 'zod'
import { sendLeadEmail } from '@/lib/email'
import { submitLeadToSheet } from '@/lib/sheets'
import type { LeadData, LeadResponse } from '@/lib/types'
import { getUTMParams } from '@/lib/utm'

/**
 * Validation schema for contact form submissions.
 * All 14 user-facing fields plus formName and timestamp.
 */
const LeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Please enter a valid email address').optional().default(''),
  city: z.string().min(2, 'City is required'),
  formName: z.string().default('Contact Form'),
  customerInterest: z.string().optional().default(''),
  buyerType: z.string().optional().default(''),
  plotSize: z.string().optional().default(''),
  budget: z.string().optional().default(''),
  purpose: z.string().optional().default(''),
  enquiry: z.string().optional().default(''),
  ctaClicked: z.string().optional().default('Contact Form'),
  utmSource: z.string().optional().default(''),
  utmCampaign: z.string().optional().default(''),
})

export type LeadInput = z.infer<typeof LeadSchema>

export async function POST(request: NextRequest): Promise<Response> {
  // 1. Parse body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { success: false, message: 'Invalid JSON body.' },
      { status: 400 }
    )
  }

  // 2. Validate with Zod
  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Validation failed.'
    return Response.json({ success: false, message }, { status: 422 })
  }

  const lead: LeadData = parsed.data as LeadData
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

  // 3. Send to Google Sheets, Email, and the Admin Panel API simultaneously (non-blocking)
  //    Use Promise.allSettled so one failure doesn't break the other
  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
  const [sheetsResult, emailResult, apiResult] = await Promise.allSettled([
    submitLeadToSheet(lead),
    sendLeadEmail(lead),
    fetch(`${backendUrl}/api/public/leads/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }),
  ])

  if (process.env.NODE_ENV === 'development') {
    console.log('[leads] sheets:', sheetsResult.status, '| email:', emailResult.status, '| api:', apiResult.status)
  }

  // 4. Non-blocking local JSON write (dev convenience only, fails silently on Vercel)
  void (async () => {
    try {
      const fs = await import('fs/promises')
      const path = await import('path')
      const filePath = path.join(process.cwd(), 'data', 'leads.json')
      const raw = await fs.readFile(filePath, 'utf-8').catch(() => '[]')
      const arr = JSON.parse(raw)
      arr.push({ id: leadId, ...lead, timestamp: new Date().toISOString() })
      await fs.writeFile(filePath, JSON.stringify(arr, null, 2))
    } catch {
      // Expected on serverless — silently skip
    }
  })()

  // 5. Return success as long as at least one delivery channel succeeded
  const sheetsOk = sheetsResult.status === 'fulfilled' && sheetsResult.value.success
  const emailOk = emailResult.status === 'fulfilled' && emailResult.value

  if (!sheetsOk && !emailOk) {
    console.error('[leads] Both Sheets and Email failed for lead', leadId)
    return Response.json(
      { success: false, message: 'Submission could not be processed. Please try again.' },
      { status: 500 }
    )
  }

  return Response.json(
    { success: true, id: leadId } as LeadResponse,
    { status: 200 }
  )
}
