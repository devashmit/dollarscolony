import { NextRequest } from 'next/server'
import { z } from 'zod'
import { sendLeadEmail } from '@/lib/email'
import { sendLeadToSheets } from '@/lib/sheets'

const BrochureSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ success: false, message: 'Invalid JSON body.' }, { status: 400 })
  }

  const parsed = BrochureSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Validation failed.'
    return Response.json({ success: false, message }, { status: 422 })
  }

  const { name, phone } = parsed.data
  const timestamp = new Date().toISOString()

  // Log as a lead with source "brochure-download"
  const lead = {
    name,
    phone,
    city: 'Unknown',
    interestedIn: 'Investment' as const,
    source: 'brochure-download' as const,
    timestamp,
  }

  await Promise.allSettled([sendLeadEmail(lead), sendLeadToSheets(lead)])

  // Non-blocking local fallback
  void (async () => {
    try {
      const fs   = await import('fs/promises')
      const path = await import('path')
      const filePath = path.join(process.cwd(), 'data', 'leads.json')
      const raw  = await fs.readFile(filePath, 'utf-8').catch(() => '[]')
      const arr  = JSON.parse(raw)
      arr.push({ id: `brochure_${Date.now()}`, ...lead })
      await fs.writeFile(filePath, JSON.stringify(arr, null, 2))
    } catch { /* expected on serverless */ }
  })()

  // Return the public brochure path (client will drop PDF in /public/brochure/)
  return Response.json({
    success: true,
    brochureUrl: '/documents/dollars-colony-brochure.pdf',
  })
}
