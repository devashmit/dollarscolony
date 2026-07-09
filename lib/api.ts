export interface ApiConfig {
  phone_number: string;
  whatsapp_number: string;
  project_content: string;
}

export interface ApiPlot {
  plotId: string;
  block: string;
  category: string;
  cents: number;
  sqft: number;
  price?: number | null;
  status: 'AVAILABLE' | 'BLOCKED' | 'SOLD';
}

export interface ApiAsset {
  key: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface ApiDownloads {
  brochure?: ApiAsset;
  masterplan_pdf?: ApiAsset;
  masterplan_image?: ApiAsset;
}

export interface ApiAmenity {
  id: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  displayOrder: number;
}

export interface ApiHighlight {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
  displayOrder: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || "https://admin.dollarscolony.in";

export async function getPublicConfig(): Promise<ApiConfig> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/config/`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.error("Error fetching public config from API:", err);
  }
  return {
    phone_number: "9035624148",
    whatsapp_number: "919035624148",
    project_content: "",
  };
}

export async function getPublicPlots(): Promise<ApiPlot[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/plots/`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (err) {
    console.error("Error fetching public plots from API:", err);
  }
  return [];
}

export async function getPublicDownloads(): Promise<ApiDownloads> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/downloads/`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      const dataMap: ApiDownloads = {};
      json.data.forEach((asset: ApiAsset) => {
        if (asset.key === "brochure") dataMap.brochure = asset;
        if (asset.key === "masterplan_pdf") dataMap.masterplan_pdf = asset;
        if (asset.key === "masterplan_image") dataMap.masterplan_image = asset;
      });
      return dataMap;
    }
  } catch (err) {
    console.error("Error fetching public downloads from API:", err);
  }
  return {};
}

export async function getPublicAmenities(): Promise<ApiAmenity[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/amenities/`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (err) {
    console.error("Error fetching public amenities:", err);
  }
  return [];
}

export async function getPublicHighlights(): Promise<ApiHighlight[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/highlights/`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (err) {
    console.error("Error fetching public highlights:", err);
  }
  return [];
}
