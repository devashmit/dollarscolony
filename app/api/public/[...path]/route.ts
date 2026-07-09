import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params);
}

async function handleProxy(req: NextRequest, { path }: { path: string[] }) {
  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";
  const pathString = path.join("/");
  
  // Django REST framework routes usually end with a slash, we match it!
  const destUrl = `${backendUrl}/api/public/${pathString}/`;

  // Get request body if method allows
  let body: any = undefined;
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    try {
      body = await req.text();
    } catch (_) {}
  }

  try {
    const backendRes = await fetch(destUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const contentType = backendRes.headers.get("content-type") || "";
    let data: any;
    if (contentType.includes("application/json")) {
      data = await backendRes.json();
    } else {
      data = await backendRes.text();
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    console.error("Public proxy error:", err);
    return NextResponse.json({ error: "Failed to forward request to backend" }, { status: 500 });
  }
}
