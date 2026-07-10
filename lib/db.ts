import { auth } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_API_URL || "https://web-production-fe64e.up.railway.app";

async function fetchFromBackend(path: string, options: RequestInit = {}) {
  const session = await auth();
  const token = (session?.user as any)?.accessToken;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.headers) {
    const optHeaders = options.headers as Record<string, any>;
    Object.entries(optHeaders).forEach(([k, v]) => {
      headers[k] = String(v);
    });
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error(`Backend fetch failed: ${res.statusText}`);
  }

  return res.json();
}

// Helper to construct endpoint methods
function createModelHelpers(endpoint: string) {
  return {
    count: async (args?: any) => {
      const params = new URLSearchParams();
      if (args?.where) {
        // Map where conditions to query params
        Object.entries(args.where).forEach(([key, val]) => {
          if (val && typeof val === "object") {
            // e.g. submittedAt: { gte: date }
            Object.entries(val).forEach(([subKey, subVal]) => {
              if (subVal) params.set(`${key}__${subKey}`, String(subVal));
            });
          } else if (val !== undefined && val !== null) {
            params.set(key, String(val));
          }
        });
      }
      const data = await fetchFromBackend(`/api/${endpoint}/?${params.toString()}`);
      return data.count !== undefined ? data.count : (Array.isArray(data) ? data.length : 0);
    },
    findMany: async (args?: any) => {
      const params = new URLSearchParams();
      if (args?.where) {
        Object.entries(args.where).forEach(([key, val]) => {
          if (val && typeof val === "object") {
            Object.entries(val).forEach(([subKey, subVal]) => {
              if (subVal) params.set(`${key}__${subKey}`, String(subVal));
            });
          } else if (val !== undefined && val !== null) {
            params.set(key, String(val));
          }
        });
      }
      if (args?.take) {
        params.set("limit", String(args.take));
      }
      if (args?.skip) {
        const limit = args.take || 50;
        const page = Math.floor(args.skip / limit) + 1;
        params.set("page", String(page));
      }
      const data = await fetchFromBackend(`/api/${endpoint}/?${params.toString()}`);
      return data.results || data;
    },
    findUnique: async (args: any) => {
      const id = args.where.id || args.where.key || args.where.plotId;
      return fetchFromBackend(`/api/${endpoint}/${id}/`);
    },
    update: async (args: any) => {
      const id = args.where.id || args.where.key || args.where.plotId;
      return fetchFromBackend(`/api/${endpoint}/${id}/`, {
        method: "PUT",
        body: JSON.stringify(args.data),
      });
    },
    create: async (args: any) => {
      return fetchFromBackend(`/api/${endpoint}/`, {
        method: "POST",
        body: JSON.stringify(args.data),
      });
    },
    delete: async (args: any) => {
      const id = args.where.id || args.where.key || args.where.plotId;
      return fetchFromBackend(`/api/${endpoint}/${id}/`, {
        method: "DELETE",
      });
    }
  };
}

export const db = {
  $transaction: async (promises: Promise<any>[]) => {
    return Promise.all(promises);
  },
  lead: createModelHelpers("admin/leads"),
  plot: createModelHelpers("admin/plots"),
  galleryImage: createModelHelpers("admin/gallery"),
  highlight: createModelHelpers("admin/highlights"),
  amenity: createModelHelpers("admin/amenities"),
  projectUpdate: createModelHelpers("admin/updates"),
  siteConfig: createModelHelpers("admin/config"),
  mediaAsset: createModelHelpers("admin/media-assets"),
  adminUser: createModelHelpers("admin/users"),
};
