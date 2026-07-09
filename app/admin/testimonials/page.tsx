import React from "react";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import { getTestimonials } from "@/lib/testimonials";

export const revalidate = 0;

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials({ includeInactive: true });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-wide text-[#F5F0E8] uppercase">Testimonials</h2>
        <p className="text-sm text-[#8A9BB0] mt-1">Manage customer testimonials shown on the public website.</p>
      </div>

      <TestimonialsManager initialTestimonials={testimonials || []} />
    </div>
  );
}
