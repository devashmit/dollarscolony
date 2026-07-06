import React from "react";
import { db } from "@/lib/db";
import PlotsTable from "@/components/admin/PlotsTable";

export const revalidate = 0;

export default async function PlotsPage() {
  const plots = await db.plot.findMany();

  // Natural sort plot IDs (e.g., A1, A2, A10, A11)
  const sortedPlots = [...plots].sort((a, b) => {
    return a.plotId.localeCompare(b.plotId, undefined, { numeric: true, sensitivity: "base" });
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-wide text-[#F5F0E8] uppercase">
          Plot Inventory
        </h2>
        <p className="text-sm text-[#8A9BB0] mt-1">
          Monitor and update the live status of all 54 coastal villa plots. Changes take effect instantly.
        </p>
      </div>

      <PlotsTable initialPlots={sortedPlots} />
    </div>
  );
}
