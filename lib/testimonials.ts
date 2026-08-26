import { db } from "@/lib/db";
import { Testimonial } from "@/lib/types-prisma-mock";

const BACKEND_URL = process.env.BACKEND_API_URL || "https://admin-panel-dollarscolony.onrender.com";

export async function getTestimonials(options?: { includeInactive?: boolean }) {
  if (options?.includeInactive) {
    // Admin request - fetch all testimonials using authenticated db client
    const testimonials = await db.testimonial.findMany();
    return testimonials.sort((a: any, b: any) => {
      const order = (a.displayOrder || 0) - (b.displayOrder || 0);
      if (order !== 0) return order;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  } else {
    // Public request - fetch only active testimonials from public endpoint without auth
    const res = await fetch(`${BACKEND_URL}/api/public/testimonials/`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch public testimonials: ${res.statusText}`);
    }
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data.sort((a: any, b: any) => {
        const order = (a.displayOrder || 0) - (b.displayOrder || 0);
        if (order !== 0) return order;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
    }
    return [];
  }
}

export async function createTestimonial(input: Omit<Testimonial, "id" | "createdAt" | "updatedAt">) {
  return db.testimonial.create({
    data: input,
  });
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>) {
  return db.testimonial.update({
    where: { id },
    data: updates,
  });
}

export async function deleteTestimonial(id: string) {
  return db.testimonial.delete({
    where: { id },
  });
}