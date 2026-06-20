import { NextRequest } from 'next/server'
import { z } from 'zod'
import { sendLeadEmail } from '@/lib/email'
import { submitLeadToSheet } from '@/lib/sheets'
import type { LeadData, LeadResponse } from '@/lib/types'

/**
 * Brochure download request schema (minimal fields).
 * We expand this into a full LeadData object before submission.
 */
const BrochureSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Please enter a valid email address').optional().default(''),
  city: z.string().optional().default('Unknown'),
  selectedPlot: z.string().optional().default(''),
  source: z.string().optional().default('brochure-modal'),
  utmSource: z.string().optional().default(''),
  utmCampaign: z.string().optional().default(''),
})

export async function POST(request: NextRequest): Promise<Response> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { success: false, message: 'Invalid JSON body.' },
      { status: 400 }
    )
  }

  const parsed = BrochureSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Validation failed.'
    return Response.json({ success: false, message }, { status: 422 })
  }

  const {
    name,
    phone,
    email,
    city,
    selectedPlot,
    source,
    utmSource,
    utmCampaign,
  } = parsed.data

  // Expand into full LeadData object
  const lead: LeadData = {
    name,
    phone,
    email,
    city,
    formName: 'Brochure Download',
    customerInterest: 'Brochure',
    buyerType: '',
    plotSize: '',
    budget: '',
    purpose: '',
    enquiry: selectedPlot ? `Interested in Plot: ${selectedPlot}` : 'Brochure inquiry',
    ctaClicked: 'Download Brochure',
    utmSource,
    utmCampaign,
  }

  const leadId = `brochure_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

  // Send to both Sheets and Email (non-blocking)
  const [sheetsResult, emailResult] = await Promise.allSettled([
    submitLeadToSheet(lead),
    sendLeadEmail(lead),
  ])

  if (process.env.NODE_ENV === 'development') {
    console.log('[brochure] sheets:', sheetsResult.status, '| email:', emailResult.status)
  }

  // Non-blocking local fallback (dev convenience only)
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
      /* expected on serverless */
    }
  })()

  // Return success if at least one channel succeeded
  const sheetsOk = sheetsResult.status === 'fulfilled' && sheetsResult.value.success
  const emailOk = emailResult.status === 'fulfilled' && emailResult.value

  if (!sheetsOk && !emailOk) {
    return Response.json(
      { success: false, message: 'Submission could not be processed. Please try again.' },
      { status: 500 }
    )
  }

  // Return public brochure path (client will drop PDF in /public/documents/)
  return Response.json(
    {
      success: true,
      id: leadId,
      brochureUrl: '/documents/dollars-colony-brochure.pdf',
    } as LeadResponse,
    { status: 200 }
  )
}
