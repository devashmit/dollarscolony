/**
 * Shared TypeScript types for lead data across the application.
 * These 18 fields match the Google Sheet columns D through Q.
 * 
 * The Apps Script handles:
 *   - Column A: Lead ID (auto-generated)
 *   - Column B: Date (auto-generated)
 *   - Column C: Time (auto-generated)
 *   - Column S: Lead Status (auto-set to "New")
 *   - Columns R, T, U, V: manual entry by sales team
 */

export interface LeadData {
  name: string              // D: Name
  phone: string             // E: Phone Number
  email: string             // F: Email ID
  city: string              // G: City/Location
  formName: string          // H: Form Name (e.g., "Contact Form", "Brochure Modal")
  customerInterest: string  // I: Customer Interest (Lifestyle, Premium, Signature, Investment, Site Visit, Brochure)
  buyerType: string         // J: Buyer Type (End User, Investor, NRI, Holiday Home, Retirement Home, Broker, CP)
  plotSize: string          // K: Preferred Plot Size (2000–3000 sqft, 3500 sqft, 3500+ sqft, Not Sure)
  budget: string            // L: Budget Range (Below 40L, 40L–60L, 60L–80L, 80L+, Not Shared)
  purpose: string           // M: Purpose (Investment, Build Villa, Holiday Home, Retirement, Native Place, Not Shared)
  enquiry: string           // N: Enquiry (notes/message from user)
  ctaClicked: string        // O: CTA Clicked (Download Brochure, Site Visit, WhatsApp, Call, Contact Form)
  utmSource: string         // P: UTM Source
  utmCampaign: string       // Q: UTM Campaign
}

/**
 * Form submission payload (includes timestamp for processing)
 */
export interface LeadSubmission extends LeadData {
  timestamp: string
}

/**
 * API response from lead submission endpoints
 */
export interface LeadResponse {
  success: boolean
  id?: string
  message?: string
  brochureUrl?: string
}
