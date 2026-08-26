import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";

export async function GET(req: NextRequest) {
  const session = await auth();
  const token = (session?.user as any)?.accessToken;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.BACKEND_API_URL || "https://admin-panel-dollarscolony.onrender.com";
  const destUrl = `${backendUrl}/api/admin/gallery/${req.nextUrl.search}`;

  try {
    const backendRes = await fetch(destUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err) {
    console.error("GET gallery proxy error:", err);
    return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const token = (session?.user as any)?.accessToken;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files");
    
    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No files uploaded" }, { status: 400 });
    }

    const backendUrl = process.env.BACKEND_API_URL || "https://admin-panel-dollarscolony.onrender.com";
    const uploadedImages: any[] = [];

    for (const item of files) {
      if (item instanceof File) {
        // 1. Upload to Vercel Blob
        const filename = `${Date.now()}-${item.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const blob = await put(`gallery/${filename}`, item, {
          access: "public",
        });

        // 2. Post to Django backend to save metadata
        const djangoRes = await fetch(`${backendUrl}/api/admin/gallery/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileUrl: blob.url,
            fileName: item.name,
            altText: "",
            displayOrder: 0,
          }),
        });

        if (!djangoRes.ok) {
          const errData = await djangoRes.json().catch(() => ({}));
          throw new Error(errData.detail || errData.error || "Failed to save image metadata on Django backend");
        }

        const djangoData = await djangoRes.json();
        uploadedImages.push(djangoData);
      }
    }

    return NextResponse.json({ success: true, data: uploadedImages });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to upload image" }, { status: 500 });
  }
}