import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { del } from "@vercel/blob";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const token = (session?.user as any)?.accessToken;
  const { id } = await params;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const backendUrl = process.env.BACKEND_API_URL || "https://admin-panel-dollarscolony.onrender.com";
    
    const djangoRes = await fetch(`${backendUrl}/api/admin/gallery/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!djangoRes.ok) {
      const errData = await djangoRes.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: errData.detail || errData.error || "Failed to update image metadata" },
        { status: djangoRes.status }
      );
    }

    const djangoData = await djangoRes.json();
    return NextResponse.json({ success: true, data: djangoData.data });
  } catch (err: any) {
    console.error("PATCH metadata error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to update image metadata" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const token = (session?.user as any)?.accessToken;
  const { id } = await params;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const backendUrl = process.env.BACKEND_API_URL || "https://admin-panel-dollarscolony.onrender.com";

    // 1. Fetch image detail from Django to get the fileUrl
    const getRes = await fetch(`${backendUrl}/api/admin/gallery/${id}/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (getRes.ok) {
      const imgData = await getRes.json();
      if (imgData.fileUrl) {
        // 2. Delete from Vercel Blob
        try {
          await del(imgData.fileUrl);
        } catch (blobErr) {
          console.error("Vercel Blob deletion failed (might already be deleted):", blobErr);
        }
      }
    }

    // 3. Delete record from Django backend
    const djangoRes = await fetch(`${backendUrl}/api/admin/gallery/${id}/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!djangoRes.ok) {
      const errData = await djangoRes.json().catch(() => ({}));
      console.error("Django delete image failed:", djangoRes.status, errData);
      return NextResponse.json({ 
        success: false, 
        error: errData.detail || errData.error || `Failed to delete image record from backend (HTTP ${djangoRes.status})`
      }, { status: djangoRes.status });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE image error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to delete image" }, { status: 500 });
  }
}