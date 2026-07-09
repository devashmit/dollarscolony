import { promises as fs } from "fs";
import path from "path";
import { Testimonial } from "@/lib/types-prisma-mock";

const testimonialsFilePath = path.join(process.cwd(), "data", "testimonials.json");

async function ensureTestimonialsFile() {
  await fs.mkdir(path.dirname(testimonialsFilePath), { recursive: true });
  try {
    await fs.access(testimonialsFilePath);
  } catch {
    await fs.writeFile(testimonialsFilePath, JSON.stringify([], null, 2));
  }
}

function normalizeTestimonial(item: Partial<Testimonial> & { id?: string }, index: number): Testimonial {
  return {
    id: item.id || `testimonial_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    author: item.author || "Anonymous",
    role: item.role || null,
    company: item.company || null,
    body: item.body || "",
    rating: Number(item.rating || 5),
    displayOrder: Number(item.displayOrder ?? index),
    active: item.active ?? true,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  };
}

export async function getTestimonials(options?: { includeInactive?: boolean }) {
  await ensureTestimonialsFile();
  const raw = await fs.readFile(testimonialsFilePath, "utf-8").catch(() => "[]");
  const parsed = JSON.parse(raw) as Partial<Testimonial>[];
  const testimonials = parsed.map((item, index) => normalizeTestimonial(item, index));
  const filtered = options?.includeInactive ? testimonials : testimonials.filter((item) => item.active);
  return filtered.sort((a, b) => {
    const order = (a.displayOrder || 0) - (b.displayOrder || 0);
    if (order !== 0) return order;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

export async function setTestimonials(testimonials: Testimonial[]) {
  await ensureTestimonialsFile();
  const normalized = testimonials.map((item, index) => normalizeTestimonial(item, index));
  await fs.writeFile(testimonialsFilePath, JSON.stringify(normalized, null, 2));
  return normalized;
}

export async function createTestimonial(input: Omit<Testimonial, "id" | "createdAt" | "updatedAt">) {
  const existing = await getTestimonials({ includeInactive: true });
  const item = normalizeTestimonial({ ...input, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, existing.length);
  const next = [...existing, item];
  await setTestimonials(next);
  return item;
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>) {
  const existing = await getTestimonials({ includeInactive: true });
  const current = existing.find((item) => item.id === id);
  if (!current) return null;
  const updated = normalizeTestimonial({ ...current, ...updates, updatedAt: new Date().toISOString() }, existing.findIndex((item) => item.id === id));
  const next = existing.map((item) => (item.id === id ? updated : item));
  await setTestimonials(next);
  return updated;
}

export async function deleteTestimonial(id: string) {
  const existing = await getTestimonials({ includeInactive: true });
  const next = existing.filter((item) => item.id !== id);
  await setTestimonials(next);
  return next;
}
