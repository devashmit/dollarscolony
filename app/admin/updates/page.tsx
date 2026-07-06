import React from "react";
import { db } from "@/lib/db";
import UpdatesManager from "@/components/admin/UpdatesManager";

export const revalidate = 0;

export default async function UpdatesPage() {
  const updates = await db.projectUpdate.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-wide text-[#F5F0E8] uppercase">
          Project Update Notices
        </h2>
        <p className="text-sm text-[#8A9BB0] mt-1">
          Publish and edit construction updates, progress reports, and general notifications shown on the public website.
        </p>
      </div>

      <UpdatesManager initialUpdates={updates} />
    </div>
  );
}
