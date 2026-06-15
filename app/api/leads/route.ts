import { NextRequest } from 'next/server'
import { z } from 'zod'
import { sendLeadEmail } from '@/lib/email'
import { sendLeadToSheets } from '@/lib/sheets'

const LeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  city: z.string().min(2, 'City is required'),
  interestedIn: z.enum(['Lifestyle', 'Premium', 'Signature', 'Investment', 'Site Visit']),
  source: z.enum(['contact-form', 'brochure-download', 'hero-cta']),
  timestamp: z.string().datetime(),
})

export type LeadInput = z.infer<typeof LeadSchema>

export async function POST(request: NextRequest) {
  // 1. Parse body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ success: false, message: 'Invalid JSON body.' }, { status: 400 })
  }

  // 2. Validate with Zod
  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Validation failed.'
    return Response.json({ success: false, message }, { status: 422 })
  }

  const lead = parsed.data
  const id   = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

  // 3. Primary: Email + Sheets (source of truth)
  const [emailOk, sheetsOk] = await Promise.allSettled([
    sendLeadEmail(lead),
    sendLeadToSheets(lead),
  ])

  if (process.env.NODE_ENV === 'development') {
    console.log('[leads] email:', emailOk, '| sheets:', sheetsOk)
  }

  // 4. Non-blocking fail-safe: local JSON write
  //    This WILL fail on Vercel serverless (read-only FS) — that is expected.
  //    Email + Sheets are the source of truth. This is a dev convenience only.
  void (async () => {
    try {
      const fs   = await import('fs/promises')
      const path = await import('path')
      const filePath = path.join(process.cwd(), 'data', 'leads.json')
      const raw  = await fs.readFile(filePath, 'utf-8').catch(() => '[]')
      const arr  = JSON.parse(raw)
      arr.push({ id, ...lead })
      await fs.writeFile(filePath, JSON.stringify(arr, null, 2))
    } catch {
      // Expected on serverless — silently skip
    }
  })()

  return Response.json({ success: true, id }, { status: 200 })
}
