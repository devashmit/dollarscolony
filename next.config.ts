import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
    return [
      // Proxy slash-less admin requests to backend with trailing slash appended
      {
        source: "/api/admin/:path(config|users|leads|plots|gallery|highlights|amenities|updates)",
        destination: `${backendUrl}/api/admin/:path/`,
      },
      {
        source: "/api/admin/:path(config|users|leads|plots|gallery|highlights|amenities|updates)/:subpath*",
        destination: `${backendUrl}/api/admin/:path/:subpath*/`,
      },
      // General fallback proxy for admin endpoints
      {
        source: "/api/admin/:path*",
        destination: `${backendUrl}/api/admin/:path*`,
      },
    ];
  },
};

export default nextConfig;
