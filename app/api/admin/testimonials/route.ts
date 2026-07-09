import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createTestimonial, getTestimonials } from "@/lib/testimonials";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const testimonials = await getTestimonials({ includeInactive: true });
  return NextResponse.json({ success: true, data: testimonials });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const testimonial = await createTestimonial({
      author: body.author || "Anonymous",
      role: body.role || null,
      company: body.company || null,
      body: body.body || "",
      rating: Number(body.rating || 5),
      displayOrder: Number(body.displayOrder || 0),
      active: body.active ?? true,
    });

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    console.error("Failed to create testimonial", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
