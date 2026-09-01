import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const session = await auth();
  const token = (session?.user as any)?.accessToken;
  const { key: rawKey } = await params;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keyMap: Record<string, string> = {
    "brochure": "brochure",
    "masterplan-pdf": "masterplan_pdf",
    "masterplan-image": "masterplan_image",
    "about-entrance": "about_entrance",
  };

  const dbKey = keyMap[rawKey];
  if (!dbKey) {
    return NextResponse.json({ success: false, error: "Invalid upload key" }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const backendUrl = process.env.BACKEND_API_URL || "https://admin-panel-dollarscolony.onrender.com";

    // 1. Upload to Vercel Blob
    const filename = `${dbKey}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const blob = await put(`assets/${filename}`, file, {
      access: "public",
    });

    // 2. Fetch existing media assets from backend
    const listRes = await fetch(`${backendUrl}/api/admin/media-assets/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    let existingAsset: any = null;
    if (listRes.ok) {
      const assets = await listRes.json();
      existingAsset = assets.find((asset: any) => asset.key === dbKey);
    }

    let djangoData;
    const titleMap: Record<string, string> = {
      "brochure": "Brochure PDF",
      "masterplan_pdf": "Masterplan PDF",
      "masterplan_image": "Masterplan Image",
      "about_entrance": "Community Entrance Photo",
    };

    const payload = {
      key: dbKey,
      title: titleMap[dbKey] || file.name,
      fileUrl: blob.url,
      fileName: file.name,
      mimeType: file.type,
      fileSizeBytes: file.size,
      altText: titleMap[dbKey] || file.name,
    };

    if (existingAsset) {
      const djangoRes = await fetch(`${backendUrl}/api/admin/media-assets/${existingAsset.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!djangoRes.ok) {
        const errData = await djangoRes.json().catch(() => ({}));
        throw new Error(errData.detail || errData.error || "Failed to update media asset metadata");
      }
      djangoData = await djangoRes.json();
    } else {
      const djangoRes = await fetch(`${backendUrl}/api/admin/media-assets/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!djangoRes.ok) {
        const errData = await djangoRes.json().catch(() => ({}));
        throw new Error(errData.detail || errData.error || "Failed to create media asset metadata");
      }
      djangoData = await djangoRes.json();
    }

    return NextResponse.json({ success: true, data: djangoData });
  } catch (err: any) {
    console.error("Document upload error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to upload document" }, { status: 500 });
  }
}