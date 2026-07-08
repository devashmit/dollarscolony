import React from "react";
import { db } from "@/lib/db";
import SettingsManager from "@/components/admin/SettingsManager";

export const revalidate = 0;

export default async function SettingsPage() {
  let configs: Array<{ key: string; value: string; label: string }> = [];
  let assets: Array<{ key: string; title: string; fileUrl: string; fileName: string; uploadedAt: Date | string }> = [];
  let admins: Array<{ id: string; name: string; email: string; role: string; lastLoginAt: string | null; createdAt: string }> = [];
  let errorMessage: string | null = null;

  try {
    const [dbConfigs, dbAssets, dbAdmins] = await Promise.all([
      db.siteConfig.findMany(),
      db.mediaAsset.findMany(),
      db.adminUser.findMany({
        orderBy: { createdAt: "desc" },
      }),
    ]);

    configs = dbConfigs.map((c) => ({
      key: c.key,
      value: c.value,
      label: c.label,
    }));

    assets = dbAssets.map((a) => ({
      key: a.key,
      title: a.title,
      fileUrl: a.fileUrl || "",
      fileName: a.fileName || "",
      uploadedAt: a.updatedAt,
    }));

    admins = dbAdmins.map((admin) => ({
      id: admin.id,
      name: admin.name || "",
      email: admin.email,
      role: admin.role,
      lastLoginAt: admin.lastLoginAt ? admin.lastLoginAt.toISOString() : null,
      createdAt: admin.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to load admin settings:", error);
    errorMessage = error instanceof Error ? error.message : "Unable to load admin settings";
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-wide text-[#F5F0E8] uppercase">
          Portal & Document Settings
        </h2>
        <p className="text-sm text-[#8A9BB0] mt-1">
          Adjust the general contact details, dynamic pricing note text, or upload active document assets.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-[#D4A46A]/25 bg-[#102737] p-4 text-sm text-[#F5F0E8]">
          <p className="font-semibold">Unable to load settings right now.</p>
          <p className="mt-1 text-[#8A9BB0]">{errorMessage}</p>
          <p className="mt-2 text-[#8A9BB0]">Please sign in again or check the backend connection.</p>
        </div>
      ) : (
        <SettingsManager configs={configs} assets={assets} admins={admins} />
      )}
    </div>
  );
}
