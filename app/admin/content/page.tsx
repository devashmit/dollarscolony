import React from "react";
import { db } from "@/lib/db";
import ContentManager from "@/components/admin/ContentManager";

export const revalidate = 0;

export default async function ContentPage() {
  const [highlights, amenities] = await Promise.all([
    db.highlight.findMany({ orderBy: { displayOrder: "asc" } }),
    db.amenity.findMany({ orderBy: { displayOrder: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-wide text-[#F5F0E8] uppercase">
          Website Content Management
        </h2>
        <p className="text-sm text-[#8A9BB0] mt-1">
          Customize the interactive project highlights and general community amenities surfaced on the public marketing site.
        </p>
      </div>

      <ContentManager initialHighlights={highlights} initialAmenities={amenities} />
    </div>
  );
}
