export type LeadStatus = "NEW" | "CONTACTED" | "SITE_VISIT_SCHEDULED" | "NEGOTIATING" | "BOOKED" | "DROPPED";
export type PlotStatus = "AVAILABLE" | "BLOCKED" | "SOLD";

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  lastLoginAt: any;
  resetCode: string | null;
  resetCodeExpiresAt: any;
  createdAt: any;
  updatedAt: any;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  formName: string | null;
  customerInterest: string | null;
  buyerType: string | null;
  plotSize: string | null;
  budget: string | null;
  purpose: string | null;
  enquiry: string | null;
  ctaClicked: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  status: LeadStatus;
  notes: string | null;
  submittedAt: any;
  createdAt: any;
  updatedAt: any;
}

export interface SiteConfig {
  id: string;
  key: string;
  value: string;
  label: string;
  updatedAt: any;
}

export interface MediaAsset {
  id: string;
  key: string;
  title: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  altText: string | null;
  uploadedAt: any;
  updatedAt: any;
}

export interface GalleryImage {
  id: string;
  fileUrl: string;
  fileName: string;
  altText: string | null;
  displayOrder: number;
  createdAt: any;
  updatedAt: any;
}

export interface Plot {
  id: string;
  plotId: string;
  block: string;
  cents: number;
  sqft: number;
  category: string;
  price: number | null;
  status: PlotStatus;
  notes: string | null;
  createdAt: any;
  updatedAt: any;
}

export interface PlotHistory {
  id: string;
  plotId: string;
  buyerName: string | null;
  buyerPhone: string | null;
  price: number | null;
  status: string;
  soldAt: any;
  notes: string | null;
}

export interface Highlight {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  displayOrder: number;
  active: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface Amenity {
  id: string;
  label: string;
  icon: string | null;
  category: string | null;
  displayOrder: number;
  active: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface ProjectUpdate {
  id: string;
  title: string;
  body: string;
  publishedAt: any;
  active: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string | null;
  company: string | null;
  body: string;
  rating: number;
  displayOrder: number;
  active: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  meta: any;
  createdAt: any;
}
