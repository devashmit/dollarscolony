import React from "react";
import { db } from "@/lib/db";
import GalleryGrid from "@/components/admin/GalleryGrid";

export const revalidate = 0;

export default async function GalleryPage() {
  const images = await db.galleryImage.findMany({
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-wide text-[#F5F0E8] uppercase">
          Gallery Manager
        </h2>
        <p className="text-sm text-[#8A9BB0] mt-1">
          Upload and manage images shown in the public website gallery. Sort display order or edit alt text descriptions inline.
        </p>
      </div>

      <GalleryGrid initialImages={images} />
    </div>
  );
}
